#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量编排 web-design-pipeline：从测试 JSON 生成符合 output-structure 的 case 目录、
meta 模板，以及每个 case 的 Agent 执行说明（供在 Cursor 中逐条或批量跑 PM→Designer→Frontend）。

说明：本仓库的 web-design-pipeline 依赖 Agent 工具链（读文件、WebSearch、写多文件前端工程），
无法像纯 API 文本生成那样在「无 Cursor/无 Claude Code」环境里一键出完整 03_frontend。
本脚本负责「批量建壳 + 统一提示词」，与 scripts/batch_synth_causal_chains.py（读已有 case 合成因果链）配合使用。

典型流程：
  1) python scripts/batch_web_design_pipeline.py --inputs test_data/example_inputs_5.json --out-root outputs
  2) 在 Cursor Agent 中打开生成的 outputs/<case>@v4_YYYYMMDD/00_RUN_WEB_DESIGN_PIPELINE.md，
     按文档指示执行（或对每条 case 粘贴该文件全文）。

输入 JSON：数组，每项建议包含：
  - id: 数字或字符串（会格式化为三位补零）
  - domain: 字符串，含英文括号时优先用括号内英文作 slug，如「开发者工具 (DevTools)」→ devtools
  - user_req: 短需求关键词
  - original_example_text: 可选，完整描述（优先作为 Agent 主输入）

单条自然语言（无测试文件）：
  python scripts/batch_web_design_pipeline.py --slug habit-tracker --user-text "..." --out-root outputs

依赖：仅 Python 标准库。
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import date
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parents[1]
SKILL_REL = ".agents/skills/web-design-pipeline/SKILL.md"
OUTPUT_STRUCTURE_REL = ".agents/skills/web-design-pipeline/references/output-structure.md"
PM_AGENT_REL = ".agents/skills/web-design-pipeline/agents/pm-agent.md"
DESIGNER_AGENT_REL = ".agents/skills/web-design-pipeline/agents/designer-agent.md"
FRONTEND_AGENT_REL = ".agents/skills/web-design-pipeline/agents/frontend-agent.md"


def domain_slug(domain: str) -> str:
    """从 domain 字段提取英文 slug：优先括号内英文，否则简单归一。"""
    domain = (domain or "").strip()
    m = re.search(r"\(([A-Za-z0-9][A-Za-z0-9\s\-&/]*)\)", domain)
    if m:
        s = m.group(1).strip().lower()
        s = re.sub(r"[\s_/]+", "-", s)
        s = re.sub(r"[^a-z0-9\-]", "", s)
        s = re.sub(r"-+", "-", s).strip("-")
        return s or "case"
    # 无括号：取连续拉丁片段
    parts = re.findall(r"[A-Za-z][A-Za-z0-9\-]*", domain)
    if parts:
        return "-".join(p.lower() for p in parts[:4])
    # 纯中文等：用占位，避免空目录名
    h = abs(hash(domain)) % 10_000_000
    return f"domain-{h}"


def format_case_id(numeric_id: Any, domain: str) -> str:
    try:
        n = int(numeric_id)
        prefix = f"{n:03d}"
    except (TypeError, ValueError):
        prefix = re.sub(r"[^a-zA-Z0-9]+", "-", str(numeric_id)).strip("-").lower() or "000"
    return f"{prefix}_{domain_slug(domain)}"


def slug_from_text(text: str) -> str:
    text = (text or "").lower()
    words = re.findall(r"[a-z][a-z0-9]{2,}", text)
    if len(words) >= 2:
        return "-".join(words[:4])
    return "custom-query"


def case_dir_name(case_id: str, pipeline_version: str, yyyymmdd: str) -> str:
    ver = pipeline_version.lstrip("v") if pipeline_version.startswith("v") else pipeline_version
    return f"{case_id}@v{ver}_{yyyymmdd}"


def load_items(path: Path) -> list[dict[str, Any]]:
    raw = path.read_text(encoding="utf-8")
    data = json.loads(raw)
    if isinstance(data, list):
        return data
    raise ValueError("输入 JSON 顶层必须是数组")


def build_query_text(item: dict[str, Any]) -> str:
    if item.get("original_example_text"):
        return str(item["original_example_text"]).strip()
    parts = []
    if item.get("domain"):
        parts.append(f"领域：{item['domain']}")
    if item.get("user_req"):
        parts.append(f"核心痛点/主题：{item['user_req']}")
    return "\n".join(parts) if parts else json.dumps(item, ensure_ascii=False)


def write_meta(case_root: Path, case_id: str, pipeline_version: str, yyyymmdd: str, item: dict[str, Any]) -> None:
    meta = {
        "case_id": case_id,
        "pipeline_version": f"v{pipeline_version.lstrip('v')}",
        "generated_date": yyyymmdd,
        "source_type": "batch_web_design_pipeline",
        "source_file": str(item.get("_source_path", "")),
        "input_summary": build_query_text(item)[:500],
        "domain": item.get("domain", ""),
        "batch_status": "pending_agent_run",
        "notes": "由 scripts/batch_web_design_pipeline.py 生成；完成各阶段后可将 batch_status 改为 completed",
    }
    (case_root / "meta.json").write_text(
        json.dumps(meta, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


def write_run_markdown(
    case_root: Path,
    case_folder_name: str,
    case_id: str,
    item: dict[str, Any],
    query_text: str,
    batch_mode_no_pause: bool,
) -> None:
    skill_path = REPO_ROOT / SKILL_REL
    rel_skill = SKILL_REL
    rel_out = case_root.relative_to(REPO_ROOT)

    pause_note = (
        "**批量模式**：请连续执行 PM → Designer → Frontend 三个阶段，**不要在 PM 结束后停下来等待用户确认**。\n"
        if batch_mode_no_pause
        else "（若严格按 SKILL 默认流程，PM 完成后可询问用户是否继续；批量跑批建议开启脚本的 `--batch-no-pause`）\n"
    )

    body = f"""# Web Design Pipeline — 本 Case 执行说明

**Case 目录名**：`{case_folder_name}`  
**case_id**：`{case_id}`  
**输出根路径**（相对仓库）：`{rel_out.as_posix()}/`

## 1. 必须先读的技能与规范

1. `{rel_skill}` — **web-design-pipeline** 主技能（总流程、纪律、交付物）
2. `{OUTPUT_STRUCTURE_REL}` — 目录与文件命名（**必须遵守**）
3. 分阶段 Agent（按顺序阅读并执行）：
   - `{PM_AGENT_REL}`
   - `{DESIGNER_AGENT_REL}`
   - `{FRONTEND_AGENT_REL}`

技能绝对路径（本机）：`{skill_path}`

## 2. 批量执行约定

{pause_note}

- 禁止「一口气」把三阶段全部臆造完：每阶段按 SKILL 要求思考、检索（如 WebSearch / 脚本）、再写入文件。
- Designer 阶段须真实走 inspiration 与 ui-ux-pro-max 等工作流，不得凭空编造趋势。
- Frontend 须为 **TypeScript + 组件框架** 的可运行工程，交付物写入本目录下的 `03_frontend/`。

## 3. 本 Case 输入（交给 PM Agent 的原始需求）

```text
{query_text}
```

## 4. 必须落盘的结构（完成后自检）

在 **`{rel_out.as_posix()}/`** 下：

- `meta.json`（可更新 `batch_status`、栈与设计摘要等字段）
- `01_pm/prd.md`、`01_pm/requirement_spec.json`、`01_pm/ia_structure.json`
- `02_designer/style_research.md`、`02_designer/design_brief.md`、`02_designer/design_system.json`、`02_designer/component_specs.json`、`02_designer/visual_effects.json`
- `03_frontend/` 完整可运行项目（含 `package.json`、`tech_decision.json`、`self_review.json` 等）

## 5. 完成后

将 `meta.json` 中 `batch_status` 改为 `completed`，并简要记录 `selected_stack` / `design_style` 等（与仓库中其他 case 的 meta 对齐即可）。

---
*本文件由 `scripts/batch_web_design_pipeline.py` 自动生成。*
"""
    (case_root / "00_RUN_WEB_DESIGN_PIPELINE.md").write_text(body, encoding="utf-8")


def ensure_skeleton(case_root: Path) -> None:
    for sub in ("01_pm", "02_designer", "03_frontend"):
        (case_root / sub).mkdir(parents=True, exist_ok=True)
    # 占位，避免空目录不被 git 跟踪时可选；用户可用 .gitkeep
    gitkeep = case_root / "03_frontend" / ".gitkeep"
    if not gitkeep.exists():
        gitkeep.write_text("", encoding="utf-8")


def resolve_existing(case_root: Path, on_exists: str) -> Path:
    if not case_root.exists():
        return case_root
    if on_exists == "fail":
        raise FileExistsError(f"已存在: {case_root}")
    if on_exists == "skip":
        return case_root
    # suffix
    base = case_root.name
    parent = case_root.parent
    n = 2
    while True:
        cand = parent / f"{base}-run{n}"
        if not cand.exists():
            return cand
        n += 1
    raise RuntimeError("unreachable")


def main() -> int:
    parser = argparse.ArgumentParser(
        description="批量生成 web-design-pipeline 的 case 目录与 Agent 执行说明"
    )
    parser.add_argument(
        "--inputs",
        type=Path,
        help="测试集 JSON 路径（数组，每项含 id / domain / user_req 等）",
    )
    parser.add_argument("--out-root", type=Path, default=REPO_ROOT / "outputs", help="输出根目录")
    parser.add_argument(
        "--pipeline-version",
        default="4",
        help="管线版本号，用于目录名中的 vN（默认 4）",
    )
    parser.add_argument(
        "--date",
        default="",
        help="YYYYMMDD；默认今天本地日期",
    )
    parser.add_argument(
        "--batch-no-pause",
        action="store_true",
        help="在 00_RUN 说明中要求 Agent 连续跑完三阶段，不在 PM 后等待确认",
    )
    parser.add_argument(
        "--on-exists",
        choices=("suffix", "skip", "fail"),
        default="suffix",
        help="目标 case 目录已存在时的策略",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="只打印将创建的目录，不写文件",
    )
    # 单条 query 模式
    parser.add_argument("--slug", default="", help="单条模式：case slug（2-4 个英文词，连字符）")
    parser.add_argument("--user-text", default="", help="单条模式：完整需求文本")

    args = parser.parse_args()
    yyyymmdd = args.date.strip() or date.today().strftime("%Y%m%d")
    pv = str(args.pipeline_version).lstrip("v")

    items: list[dict[str, Any]] = []
    if args.inputs:
        items = load_items(args.inputs.resolve())
        for it in items:
            it["_source_path"] = str(args.inputs)
    elif args.user_text.strip():
        slug = args.slug.strip() or slug_from_text(args.user_text)
        items = [
            {
                "id": 0,
                "domain": slug,
                "user_req": "",
                "original_example_text": args.user_text.strip(),
                "_source_path": "cli--user-text",
            }
        ]
    else:
        print("请指定 --inputs <test.json> 或同时指定 --user-text（可选 --slug）", file=sys.stderr)
        return 1

    args.out_root.mkdir(parents=True, exist_ok=True)
    manifest: list[dict[str, Any]] = []

    for item in items:
        if item.get("original_example_text") or item.get("user_req") or item.get("domain"):
            pass
        else:
            print(f"跳过无效项（无 domain/user_req/original_example_text）: {item}", file=sys.stderr)
            continue

        if int(item.get("id") or 0) == 0 and item.get("_source_path") == "cli--user-text":
            case_id = item["domain"]  # slug mode: domain field holds slug
        else:
            case_id = format_case_id(item.get("id"), str(item.get("domain", "")))

        folder = case_dir_name(case_id, pv, yyyymmdd)
        case_root = (args.out_root.resolve() / folder)

        try:
            case_root = resolve_existing(case_root, args.on_exists)
        except FileExistsError as e:
            print(e, file=sys.stderr)
            return 1

        if args.on_exists == "skip" and case_root.exists() and any(case_root.iterdir()):
            # 已有内容则跳过
            if (case_root / "01_pm" / "prd.md").exists():
                print(f"SKIP (已有 prd): {case_root.name}")
                manifest.append({"case_id": case_id, "dir": case_root.name, "status": "skipped_existing"})
                continue

        query_text = build_query_text(item)

        if args.dry_run:
            print(f"WOULD CREATE: {case_root}")
            manifest.append({"case_id": case_id, "dir": case_root.name, "status": "dry_run"})
            continue

        case_root.mkdir(parents=True, exist_ok=True)
        ensure_skeleton(case_root)
        write_meta(case_root, case_id, pv, yyyymmdd, item)
        write_run_markdown(
            case_root,
            case_root.name,
            case_id,
            item,
            query_text,
            batch_mode_no_pause=args.batch_no_pause,
        )
        print(f"OK: {case_root}")
        manifest.append(
            {
                "case_id": case_id,
                "dir": case_root.name,
                "path": str(case_root.relative_to(REPO_ROOT)),
                "status": "skeleton_ready",
            }
        )

    manifest_path = args.out_root / f"batch_manifest_{yyyymmdd}.json"
    if not args.dry_run:
        manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"\nManifest: {manifest_path}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
