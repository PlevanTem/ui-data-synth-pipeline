#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量按 slow-think-causal-chain 规范合成训练样本（需调用 OpenAI 兼容 API）。

规模估算（重要）：
  - 每个 v3 case 通常产出 8~15 条「决策锚点」样本；要到 ~1w 条，大致需要：
      • ~700~1200 个独立 case（若每 case 约 8~15 条），或
      • 在少量 case 上做「多样化」：同一锚点多版本（改写 user、改写推理角度、换代码切片组合），
        例如 100 case × 12 锚点 × 8 变体 ≈ 9600 条。

用法示例：
  export OPENAI_API_KEY=sk-...
  export OPENAI_BASE_URL=https://api.openai.com/v1   # 或你的兼容网关
  export OPENAI_MODEL=gpt-4o-mini

  # 单 case、单锚点试跑
  python scripts/batch_synth_causal_chains.py \\
    --case-dir outputs/v3-pipeline/003_smart-home@v4_20260316 \\
    --focus tech_stack_selection \\
    --out outputs/batch-synth/causal_samples.jsonl

  # 多 case（目录下每个子目录当作一个 case），每个 case 用默认锚点列表各生成 1 条
  python scripts/batch_synth_causal_chains.py \\
    --cases-root outputs/v3-pipeline \\
    --case-glob "*" \\
    --out outputs/batch-synth/all.jsonl \\
    --concurrency 3

恢复：脚本按行追加 JSONL，中断后删掉未完成行或从 --offset 跳过已处理 case（可自行扩展 manifest）。

依赖：pip install -r scripts/requirements-batch-synth.txt
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Any

try:
    import httpx
except ImportError:
    httpx = None  # type: ignore

REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SKILL = REPO_ROOT / ".cursor" / "skills" / "slow-think-causal-chain" / "SKILL.md"

# 与仓库内 build_causal_chains_003.py、SKILL 示例一致：HTML 式思考块标记
THINK_OPEN = "<" + "think" + ">"
THINK_CLOSE = "<" + "/" + "think" + ">"

# 与 SKILL 中「必选锚点」对齐的默认焦点（可按 case 类型再维护映射表）
DEFAULT_FOCUSES = [
    "tech_stack_selection",
    "state_management",
    "visual_direction",
    "layout_navigation",
    "feature_boundary_negative_mock_or_scope",
    "library_or_tooling_choice",
    "generative_or_visual_tech",
    "component_design",
    "performance_or_responsive",
]


def read_text(path: Path, max_chars: int | None = None) -> str:
    try:
        raw = path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return ""
    if max_chars is not None and len(raw) > max_chars:
        return raw[: max_chars // 2] + "\n\n...[truncated]...\n\n" + raw[-max_chars // 2 :]
    return raw


def collect_case_context(case_dir: Path, max_file_chars: int) -> str:
    """打包 case 内关键文本，避免把整个 node_modules 读进来。"""
    chunks: list[str] = []
    rel = case_dir.relative_to(case_dir.anchor) if case_dir.is_absolute() else case_dir

    patterns = [
        "meta.json",
        "01_pm/**/*.md",
        "01_pm/**/*.json",
        "02_designer/**/*.md",
        "02_designer/**/*.json",
        "03_frontend/**/*.md",
        "03_frontend/**/*.json",
        "03_frontend/**/package.json",
        "03_frontend/**/tech_decision.json",
        "03_frontend/**/src/**/*.tsx",
        "03_frontend/**/src/**/*.ts",
        "03_frontend/**/src/**/*.css",
        "03_frontend/health-dashboard/src/**/*.tsx",
        "03_frontend/health-dashboard/src/**/*.ts",
        "03_frontend/health-dashboard/src/**/*.css",
    ]

    seen: set[Path] = set()
    for pat in patterns:
        for p in sorted(case_dir.glob(pat)):
            if not p.is_file():
                continue
            if p in seen:
                continue
            # 跳过巨型 lock 文件
            if p.name in ("package-lock.json",) and p.stat().st_size > 200_000:
                continue
            if p.suffix not in {".md", ".json", ".tsx", ".ts", ".css"}:
                continue
            seen.add(p)
            rel_path = p.relative_to(case_dir)
            body = read_text(p, max_file_chars)
            if not body.strip():
                continue
            chunks.append(f"===== {rel_path.as_posix()} =====\n{body}\n")

    header = f"[CASE_DIR] {case_dir}\n"
    return header + "\n".join(chunks)


def load_skill_excerpt(skill_path: Path, max_chars: int = 12000) -> str:
    text = read_text(skill_path)
    if len(text) > max_chars:
        return text[:max_chars] + "\n...[skill truncated]..."
    return text


def build_system_prompt(skill_excerpt: str) -> str:
    return f"""你是 UI 前端与产品设计助手，负责生成「慢思考因果链」SFT 样本。

以下是与产出格式和质量要求相关的技能说明（请严格遵守，不要输出技能外的元说明）：

{skill_excerpt}

【硬性输出要求】
1. 只输出一个 JSON 对象，不要 markdown 代码围栏包裹整个 JSON，不要前后解释文字。
2. JSON 字段：
   - "user_prompt": 字符串，80~200 字，自然用户语气，与 case 需求一致；不要罗列内部文件名或 JSON 键名。
   - "focus": 字符串，英文 snake_case，与任务给定的焦点一致或极接近。
   - "assistant_content": 字符串，整段 assistant 回复，结构必须为：
        {THINK_OPEN}
        （第一人称思考独白，500~2000 汉字左右，无 # 标题）
        {THINK_CLOSE}

        （空行后）1~3 句中文过渡，再给出与决策直接相关的代码；代码用 markdown 围栏，首行注释写清路径，如 // src/App.tsx
3. assistant_content 中思考段必须恰好以 {THINK_OPEN} 开头、以 {THINK_CLOSE} 结束（顺序出现）。
4. 必须包含至少一次「明确放弃某方案」的推理，以及至少一次「A 还是 B」式犹豫比较。
"""


def build_user_task(case_context: str, focus: str, variation_hint: str | None) -> str:
    extra = ""
    if variation_hint:
        extra = f"\n【多样化要求】{variation_hint}\n"
    return f"""基于下面 case 产物与代码上下文，为焦点「{focus}」生成 1 条训练样本。{extra}

【上下文】
{case_context}

请输出 JSON。"""


def chat_completion(
    base_url: str,
    api_key: str,
    model: str,
    system: str,
    user: str,
    timeout: float = 120.0,
) -> str:
    if httpx is None:
        raise RuntimeError("请安装 httpx: pip install -r scripts/requirements-batch-synth.txt")

    url = base_url.rstrip("/") + "/chat/completions"
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        "temperature": 0.7,
    }
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    with httpx.Client(timeout=timeout) as client:
        r = client.post(url, headers=headers, json=payload)
        r.raise_for_status()
        data = r.json()
    return data["choices"][0]["message"]["content"]


def parse_json_object(text: str) -> dict[str, Any]:
    text = text.strip()
    # 模型偶发包 ```json
    m = re.search(r"\{[\s\S]*\}\s*$", text)
    if not m:
        raise ValueError("响应中未找到 JSON 对象")
    return json.loads(m.group(0))


def validate_sample(obj: dict[str, Any]) -> list[str]:
    errs: list[str] = []
    for k in ("user_prompt", "focus", "assistant_content"):
        if k not in obj or not isinstance(obj[k], str) or not obj[k].strip():
            errs.append(f"缺少或非字符串字段: {k}")

    ac = obj.get("assistant_content", "")
    o, c = ac.find(THINK_OPEN), ac.find(THINK_CLOSE)
    if o < 0:
        errs.append(f"assistant_content 缺少思考开始标记 {THINK_OPEN!r}")
    if c < 0:
        errs.append(f"assistant_content 缺少思考结束标记 {THINK_CLOSE!r}")
    if o >= 0 and c >= 0 and o >= c:
        errs.append("思考标记顺序错误：开始标记须在结束标记之前")
    # 粗查 markdown 标题
    for line in ac.split("\n"):
        if line.strip().startswith("# "):
            errs.append("思考中使用了 markdown 标题")
            break
    return errs


def discover_cases(root: Path, pattern: str) -> list[Path]:
    cases = sorted(
        p for p in root.iterdir() if p.is_dir() and not p.name.startswith(".")
    )
    if pattern != "*":
        import fnmatch

        cases = [p for p in cases if fnmatch.fnmatch(p.name, pattern)]
    # 过滤：至少要有 01_pm 或 meta
    out = []
    for p in cases:
        if (p / "meta.json").exists() or (p / "01_pm").exists():
            out.append(p)
    return out


def one_job(
    case_dir: Path,
    focus: str,
    skill_path: Path,
    max_file_chars: int,
    base_url: str,
    api_key: str,
    model: str,
    variation_hint: str | None,
) -> dict[str, Any]:
    ctx = collect_case_context(case_dir, max_file_chars)
    system = build_system_prompt(load_skill_excerpt(skill_path))
    user = build_user_task(ctx, focus, variation_hint)
    raw = chat_completion(base_url, api_key, model, system, user)
    obj = parse_json_object(raw)
    errs = validate_sample(obj)
    if errs:
        raise ValueError("; ".join(errs))

    record = {
        "case_dir": str(case_dir),
        "focus": obj["focus"],
        "conversations": [
            {"role": "user", "content": obj["user_prompt"]},
            {"role": "assistant", "content": obj["assistant_content"]},
        ],
        "metadata": {
            "synth_method": "causal-chain-api-batch",
            "model": model,
        },
    }
    return record


def append_jsonl(path: Path, row: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as f:
        f.write(json.dumps(row, ensure_ascii=False) + "\n")


def main() -> int:
    parser = argparse.ArgumentParser(description="Batch causal-chain SFT synthesis via OpenAI-compatible API")
    parser.add_argument("--case-dir", type=Path, help="单个 case 目录（v3-pipeline 下某一子目录）")
    parser.add_argument("--cases-root", type=Path, help="包含多个 case 子目录的根目录")
    parser.add_argument("--case-glob", default="*", help="在 cases-root 下筛选目录名，如 003_*")
    parser.add_argument("--focus", action="append", help="锚点 focus，可多次传入；默认使用内置列表")
    parser.add_argument("--skill-path", type=Path, default=DEFAULT_SKILL)
    parser.add_argument("--out", type=Path, required=True, help="输出 JSONL 路径")
    parser.add_argument("--max-file-chars", type=int, default=8000, help="单文件读入最大字符（截断）")
    parser.add_argument("--concurrency", type=int, default=2)
    parser.add_argument(
        "--variation",
        action="append",
        help="多样化提示，可多次传入；与任务组合时会轮流附加到 prompt（扩增用）",
    )
    args = parser.parse_args()

    api_key = os.environ.get("OPENAI_API_KEY", "")
    base_url = os.environ.get("OPENAI_BASE_URL", "https://api.openai.com/v1")
    model = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
    if not api_key:
        print("请设置环境变量 OPENAI_API_KEY", file=sys.stderr)
        return 1
    if httpx is None:
        print("缺少 httpx，请: pip install -r scripts/requirements-batch-synth.txt", file=sys.stderr)
        return 1

    focuses = args.focus if args.focus else DEFAULT_FOCUSES
    variations = args.variation or [None]

    if args.case_dir:
        case_dirs = [args.case_dir.resolve()]
    elif args.cases_root:
        case_dirs = discover_cases(args.cases_root.resolve(), args.case_glob)
    else:
        print("必须指定 --case-dir 或 --cases-root", file=sys.stderr)
        return 1

    jobs: list[tuple[Path, str, str | None]] = []
    for c in case_dirs:
        for fi, focus in enumerate(focuses):
            hint = variations[fi % len(variations)]
            jobs.append((c, focus, hint))

    print(f"计划任务数: {len(jobs)} （cases={len(case_dirs)} × focuses={len(focuses)}）")

    def run(j: tuple[Path, str, str | None]) -> tuple[bool, str]:
        c, focus, hint = j
        try:
            rec = one_job(
                c, focus, args.skill_path, args.max_file_chars, base_url, api_key, model, hint
            )
            append_jsonl(args.out, rec)
            return True, f"OK {c.name} :: {focus}"
        except Exception as e:
            return False, f"FAIL {c.name} :: {focus} :: {e}"

    ok, fail = 0, 0
    with ThreadPoolExecutor(max_workers=max(1, args.concurrency)) as ex:
        futs = [ex.submit(run, j) for j in jobs]
        for fut in as_completed(futs):
            success, msg = fut.result()
            if success:
                ok += 1
            else:
                fail += 1
            print(msg)
            time.sleep(0)  # placeholder

    print(f"完成: 成功 {ok}, 失败 {fail}, 输出 {args.out}")
    return 0 if fail == 0 else 2


if __name__ == "__main__":
    raise SystemExit(main())
