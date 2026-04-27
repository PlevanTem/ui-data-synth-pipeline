#!/usr/bin/env python3
"""Think Quality Evaluator — slow-think-causal-chain-v3 专用

从 JSONL 训练样本中提取 <think> 独白，调用 LLM 按 5 维度评分框架打分，
结果写入 eval_results/ 目录（每条样本一个 JSON），并自动启动 viewer。

用法:
    python evaluate.py <path-to-jsonl> [--model MODEL] [--port PORT] [--static OUTPUT_HTML]

依赖:
    pip install openai          # 或 pip install anthropic
    设置 OPENAI_API_KEY 或 ANTHROPIC_API_KEY 环境变量

评测维度（5 项，每项 1-10 分）:
    1. reframing        问题重构深度
    2. empathy          共情与语境化
    3. divergence       路径搜索广度
    4. self_correction  自我反思与纠错
    5. feasibility      结论闭环性
"""

import argparse
import json
import os
import re
import signal
import subprocess
import sys
import time
import webbrowser
from functools import partial
from http.server import HTTPServer, BaseHTTPRequestHandler
from pathlib import Path

# ---------------------------------------------------------------------------
# Prompt template
# ---------------------------------------------------------------------------

EVALUATOR_SYSTEM = """# Role
你是一位资深设计思维专家与 AI 推理架构审计师。你的任务是评估一段"推理过程（Thought Process/CoT）"在解决复杂设计问题时的质量，并给出结构化的量化反馈。

# Evaluation Criteria (Scoring Rules)
请根据以下五个维度进行打分（每个维度 1-10 分）：

1. **问题重构深度 (Reframing)**：是否超越了表面需求，挖掘到了底层动机或潜在冲突？
2. **共情与语境化 (Contextualization)**：是否充分考虑了最终用户的情感、环境及现实约束？
3. **路径搜索广度 (Divergence)**：推理是否包含多个备选方案的对比，而非单一路径？
4. **自我反思与纠错 (Self-Correction)**：推理过程中是否出现过对假设的质疑、路径的调整或错误的发现？
5. **结论闭环性 (Closing/Feasibility)**：最终方案是否逻辑自洽，并具备实际落地或测试的可能性？

# Workflow
1. 阅读并理解用户提供的"设计思维推理过程"内容。
2. 对照评分标准，分析该推理过程中的亮点与不足。
3. 识别并提取推理中的"路径切换点（Path Switches）"——即模型改变思路的地方。
4. 汇总各维度得分，给出改进建议。
5. **最终结果仅以 JSON 格式输出。**

# Output Format (Strict JSON)
{
  "evaluation_summary": {
    "overall_score": 0,
    "quality_tier": "Excellent/Good/Average/Poor",
    "key_strengths": [],
    "key_weaknesses": []
  },
  "dimension_scores": {
    "reframing": { "score": 0, "analysis": "" },
    "empathy": { "score": 0, "analysis": "" },
    "divergence": { "score": 0, "analysis": "" },
    "self_correction": { "score": 0, "analysis": "" },
    "feasibility": { "score": 0, "analysis": "" }
  },
  "system2_evidence": {
    "path_switches_detected": 0,
    "evidence_quotes": []
  },
  "improvement_recommendations": []
}"""

EVALUATOR_USER_TMPL = """请评测以下设计思维推理过程：

<think>
{think_content}
</think>

按照指定 JSON 格式输出评测结果，不要输出任何 JSON 以外的文字。"""


# ---------------------------------------------------------------------------
# LLM call
# ---------------------------------------------------------------------------

def call_llm(think_content: str, model: str) -> dict:
    """Call LLM to evaluate a <think> block. Returns parsed JSON dict."""
    user_msg = EVALUATOR_USER_TMPL.format(think_content=think_content)

    if model.startswith("claude"):
        return _call_anthropic(model, user_msg)
    else:
        return _call_openai(model, user_msg)


def _call_openai(model: str, user_msg: str) -> dict:
    try:
        from openai import OpenAI
    except ImportError:
        print("Error: openai package not installed. Run: pip install openai", file=sys.stderr)
        sys.exit(1)

    client = OpenAI()
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": EVALUATOR_SYSTEM},
            {"role": "user", "content": user_msg},
        ],
        temperature=0.2,
        response_format={"type": "json_object"},
    )
    raw = response.choices[0].message.content
    return json.loads(raw)


def _call_anthropic(model: str, user_msg: str) -> dict:
    try:
        import anthropic
    except ImportError:
        print("Error: anthropic package not installed. Run: pip install anthropic", file=sys.stderr)
        sys.exit(1)

    client = anthropic.Anthropic()
    message = client.messages.create(
        model=model,
        max_tokens=2048,
        system=EVALUATOR_SYSTEM,
        messages=[{"role": "user", "content": user_msg}],
        temperature=0.2,
    )
    raw = message.content[0].text
    # Strip any markdown fences if present
    raw = re.sub(r"^```(?:json)?\s*", "", raw.strip())
    raw = re.sub(r"\s*```$", "", raw)
    return json.loads(raw)


# ---------------------------------------------------------------------------
# JSONL parsing
# ---------------------------------------------------------------------------

def extract_think(assistant_content: str) -> str | None:
    """Extract <think>...</think> from assistant content."""
    match = re.search(r"<think>([\s\S]*?)</think>", assistant_content)
    if match:
        return match.group(1).strip()
    return None


def load_samples(jsonl_path: Path) -> list[dict]:
    """Load samples from a JSONL file. Returns list of sample dicts."""
    samples = []
    with jsonl_path.open(encoding="utf-8") as f:
        for lineno, line in enumerate(f, 1):
            line = line.strip()
            if not line:
                continue
            try:
                sample = json.loads(line)
            except json.JSONDecodeError as e:
                print(f"Warning: line {lineno} parse error: {e}", file=sys.stderr)
                continue
            samples.append(sample)
    return samples


def get_think_from_sample(sample: dict) -> str | None:
    """Extract <think> from a sample's assistant conversation turn."""
    conversations = sample.get("conversations", [])
    for turn in conversations:
        if turn.get("role") == "assistant":
            think = extract_think(turn.get("content", ""))
            if think:
                return think
    return None


def get_user_prompt(sample: dict) -> str:
    """Extract user prompt from a sample."""
    conversations = sample.get("conversations", [])
    for turn in conversations:
        if turn.get("role") == "user":
            return turn.get("content", "")
    return ""


# ---------------------------------------------------------------------------
# Eval runner
# ---------------------------------------------------------------------------

def run_eval(jsonl_path: Path, model: str, results_dir: Path) -> list[dict]:
    """Run evaluation on all samples. Returns list of result dicts."""
    samples = load_samples(jsonl_path)
    if not samples:
        print(f"No samples found in {jsonl_path}", file=sys.stderr)
        sys.exit(1)

    results_dir.mkdir(parents=True, exist_ok=True)
    results = []

    for i, sample in enumerate(samples):
        sample_id = sample.get("sample_id") or sample.get("case_id") or f"sample_{i+1:02d}"
        case_id = sample.get("case_id", "")
        result_path = results_dir / f"{sample_id}.json"

        print(f"[{i+1}/{len(samples)}] Evaluating {sample_id} ...", end=" ", flush=True)

        # Load cached result if exists
        if result_path.exists():
            try:
                cached = json.loads(result_path.read_text(encoding="utf-8"))
                print("(cached)")
                results.append(cached)
                continue
            except (json.JSONDecodeError, OSError):
                pass

        think = get_think_from_sample(sample)
        if not think:
            print("(no <think> found, skipped)")
            result = {
                "sample_id": sample_id,
                "case_id": case_id,
                "user_prompt": get_user_prompt(sample),
                "think_content": None,
                "eval": None,
                "error": "No <think> block found",
            }
            results.append(result)
            result_path.write_text(json.dumps(result, ensure_ascii=False, indent=2))
            continue

        try:
            eval_result = call_llm(think, model)
            # Compute overall_score as average if not already set
            dim = eval_result.get("dimension_scores", {})
            scores = [v["score"] for v in dim.values() if isinstance(v, dict) and "score" in v]
            if scores:
                avg = round(sum(scores) / len(scores), 1)
                if "evaluation_summary" in eval_result:
                    eval_result["evaluation_summary"]["overall_score"] = avg
                    # Assign quality tier
                    if avg >= 8.5:
                        tier = "Excellent"
                    elif avg >= 7.0:
                        tier = "Good"
                    elif avg >= 5.0:
                        tier = "Average"
                    else:
                        tier = "Poor"
                    eval_result["evaluation_summary"]["quality_tier"] = tier

            result = {
                "sample_id": sample_id,
                "case_id": case_id,
                "user_prompt": get_user_prompt(sample),
                "think_content": think,
                "think_length": len(think),
                "eval": eval_result,
                "model": model,
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
            }
            print(f"score={eval_result.get('evaluation_summary', {}).get('overall_score', '?')} "
                  f"tier={eval_result.get('evaluation_summary', {}).get('quality_tier', '?')}")
        except Exception as e:
            print(f"(error: {e})")
            result = {
                "sample_id": sample_id,
                "case_id": case_id,
                "user_prompt": get_user_prompt(sample),
                "think_content": think,
                "eval": None,
                "error": str(e),
            }

        results.append(result)
        result_path.write_text(json.dumps(result, ensure_ascii=False, indent=2))

    return results


# ---------------------------------------------------------------------------
# HTML generation
# ---------------------------------------------------------------------------

def generate_html(results: list[dict], jsonl_name: str) -> str:
    """Generate the standalone eval viewer HTML with embedded results."""
    template_path = Path(__file__).parent / "viewer.html"
    template = template_path.read_text(encoding="utf-8")

    embedded = {
        "skill_name": f"Think Quality Eval — {jsonl_name}",
        "results": results,
    }
    data_json = json.dumps(embedded, ensure_ascii=False)
    return template.replace("/*__EMBEDDED_DATA__*/", f"const EMBEDDED_DATA = {data_json};")


# ---------------------------------------------------------------------------
# HTTP server
# ---------------------------------------------------------------------------

def _kill_port(port: int) -> None:
    """Attempt to free a port."""
    try:
        result = subprocess.run(
            ["lsof", "-ti", f":{port}"],
            capture_output=True, text=True, timeout=5,
        )
        for pid_str in result.stdout.strip().split("\n"):
            if pid_str.strip():
                try:
                    os.kill(int(pid_str.strip()), signal.SIGTERM)
                except (ProcessLookupError, ValueError):
                    pass
        if result.stdout.strip():
            time.sleep(0.5)
    except (subprocess.TimeoutExpired, FileNotFoundError):
        pass


class EvalHandler(BaseHTTPRequestHandler):
    def __init__(self, results_dir: Path, jsonl_name: str, *args, **kwargs):
        self.results_dir = results_dir
        self.jsonl_name = jsonl_name
        super().__init__(*args, **kwargs)

    def _load_results(self) -> list[dict]:
        results = []
        for p in sorted(self.results_dir.glob("*.json")):
            try:
                results.append(json.loads(p.read_text(encoding="utf-8")))
            except (json.JSONDecodeError, OSError):
                pass
        return results

    def do_GET(self) -> None:
        if self.path in ("/", "/index.html"):
            results = self._load_results()
            html = generate_html(results, self.jsonl_name)
            content = html.encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(content)))
            self.end_headers()
            self.wfile.write(content)
        else:
            self.send_error(404)

    def log_message(self, format: str, *args: object) -> None:
        pass


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Evaluate <think> quality in slow-think JSONL samples"
    )
    parser.add_argument("jsonl", type=Path, help="Path to .jsonl file to evaluate")
    parser.add_argument(
        "--model", "-m", default="gpt-4o",
        help="LLM model to use (default: gpt-4o). Use claude-* for Anthropic.",
    )
    parser.add_argument(
        "--port", "-p", type=int, default=3118,
        help="Viewer server port (default: 3118)",
    )
    parser.add_argument(
        "--static", "-s", type=Path, default=None,
        help="Write standalone HTML to this path instead of starting a server",
    )
    parser.add_argument(
        "--no-serve", action="store_true",
        help="Run evaluation only, skip launching viewer",
    )
    args = parser.parse_args()

    jsonl_path = args.jsonl.resolve()
    if not jsonl_path.exists():
        print(f"Error: {jsonl_path} not found", file=sys.stderr)
        sys.exit(1)

    results_dir = jsonl_path.parent / "eval_results"
    jsonl_name = jsonl_path.stem

    print(f"\n  Think Quality Evaluator")
    print(f"  ─────────────────────────────────────────")
    print(f"  Input:   {jsonl_path}")
    print(f"  Model:   {args.model}")
    print(f"  Results: {results_dir}")
    print()

    results = run_eval(jsonl_path, args.model, results_dir)

    # Summary
    scored = [r for r in results if r.get("eval")]
    if scored:
        avg = round(sum(
            r["eval"]["evaluation_summary"]["overall_score"]
            for r in scored
            if r["eval"].get("evaluation_summary", {}).get("overall_score")
        ) / len(scored), 1)
        tiers = [r["eval"]["evaluation_summary"].get("quality_tier", "") for r in scored]
        print(f"\n  ✓ Evaluated {len(scored)}/{len(results)} samples")
        print(f"  Average score: {avg}/10")
        print(f"  Tiers: {', '.join(tiers)}")

    if args.static:
        html = generate_html(results, jsonl_name)
        args.static.parent.mkdir(parents=True, exist_ok=True)
        args.static.write_text(html, encoding="utf-8")
        print(f"\n  Static viewer written to: {args.static}\n")
        return

    if args.no_serve:
        return

    # Launch viewer
    port = args.port
    _kill_port(port)
    handler = partial(EvalHandler, results_dir, jsonl_name)
    try:
        server = HTTPServer(("127.0.0.1", port), handler)
    except OSError:
        server = HTTPServer(("127.0.0.1", 0), handler)
        port = server.server_address[1]

    url = f"http://localhost:{port}"
    print(f"\n  Viewer: {url}")
    print(f"  Press Ctrl+C to stop.\n")
    webbrowser.open(url)

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
        server.server_close()


if __name__ == "__main__":
    main()
