#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Batch-run a Cursor SKILL.md against many user queries via an OpenAI-compatible
POST /v1/chat/completions API (stdlib only).

Encoding
  All file I/O and HTTP bodies use UTF-8. JSON is serialized with ensure_ascii=False
  so Chinese and other Unicode appear as literal characters in JSONL (not \\uXXXX).

  Some OpenAI-compatible gateways mis-decode model UTF-8 as latin-1 when building JSON.
  That yields mojibake like ``æ¹ç¨`` instead of Chinese. ``extract_assistant_text`` applies
  a safe reverse mapping (encode latin-1 → decode utf-8) only when every character is
  in U+0000–U+00FF; real Unicode text outside that range is left unchanged.

How a Cursor SKILL maps to the Chat Completions API
  A SKILL.md file is meant for Cursor (frontmatter keys like name/description are for
  the IDE). This script does NOT send that metadata to the API.

  1) Parse SKILL.md: skip the first YAML block delimited by a line ``---`` at the top,
     then the next ``---`` line. Everything after the second ``---`` is the **skill
     body** (markdown instructions).

  2) Build ``messages`` (OpenAI-style):
     - If the body contains the literal placeholder ``{query}`` (e.g. long-cot-IDEO):
         * ``role=system`` ``content`` = body with ``{query}`` replaced by this row's
           user text (your benchmark field, e.g. ``question``).
         * ``role=user`` = a short nudge so the model still has a user turn.
     - Else:
         * ``role=system`` ``content`` = full body unchanged.
         * ``role=user`` ``content`` = this row's user text only.

  3) POST JSON to ``--url`` with ``model``, ``messages``, ``stream: false``, plus
     ``tool_choice: "none"`` and ``tools: []`` to discourage tool-only completions
     when the gateway honors OpenAI semantics. For LiteLLM, ``--litellm-timeout`` sets
     the JSON ``timeout`` field (upstream default is often 30s and too low for long skills).

  If a Claude route is bound to an agentic deployment that ignores ``tool_choice`` and
  returns only ``tool_calls``, switch ``--model`` (e.g. to Gemini) or fix the proxy route,
  or pass gateway-specific keys via ``--merge-json`` (merged into the request body last).

  Use ``--resume-success-only`` to re-run only rows whose last saved line has ``ok`` not
  true, then rewrite the whole JSONL (merged + sorted by id). Pair with the same ``--out``.

Example:
  python scripts/batch_skill_llm.py \\
    --skill .cursor/skills/long-cot-IDEO/SKILL.md \\
    --queries test_data/artifactsbench_test_query.json \\
    --query-field question \\
    --id-field index \\
    --model gemini-3.1-pro-preview \\
    --out runs/artifactsbench_ideo.jsonl
"""

from __future__ import annotations

import argparse
import json
import ssl
import sys
import threading
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Any


def parse_skill_md(path: Path) -> tuple[str, str]:
    """Return (frontmatter_raw_or_empty, body_after_frontmatter)."""
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---"):
        return "", text
    lines = text.splitlines()
    if len(lines) < 2 or lines[0].strip() != "---":
        return "", text
    end = None
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            end = i
            break
    if end is None:
        return "", text
    fm = "\n".join(lines[1:end])
    body = "\n".join(lines[end + 1 :]).lstrip("\n")
    return fm, body


def pick_query_text(item: Any, field: str | None) -> str:
    if isinstance(item, str):
        return item
    if not isinstance(item, dict):
        raise TypeError(f"Query item must be str or dict, got {type(item)}")
    if field:
        if field not in item:
            raise KeyError(f"Missing query field {field!r} in item keys {list(item)!r}")
        v = item[field]
        if not isinstance(v, str):
            raise TypeError(f"Field {field!r} must be str, got {type(v)}")
        return v
    for k in ("question", "query", "message", "text", "prompt", "user_query"):
        v = item.get(k)
        if isinstance(v, str) and v.strip():
            return v
    raise KeyError(f"No query string found; tried {field or 'auto fields'} keys={list(item)!r}")


def pick_id(item: Any, id_field: str | None, line_no: int) -> Any:
    if isinstance(item, str):
        return line_no
    if not isinstance(item, dict):
        return line_no
    if id_field:
        return item.get(id_field, line_no)
    for k in ("index", "id", "uuid", "key"):
        if k in item:
            return item[k]
    return line_no


def chat_completion(
    url: str,
    api_key: str,
    model: str,
    messages: list[dict[str, str]],
    timeout: float,
    insecure: bool,
    max_tokens: int | None,
    temperature: float | None,
    merge: dict[str, Any] | None,
    litellm_timeout: float,
) -> dict[str, Any]:
    payload: dict[str, Any] = {
        "model": model,
        "messages": messages,
        "stream": False,
        # Gateway may inject default tools on long prompts; empty tools + none disables them.
        "tool_choice": "none",
        "tools": [],
    }
    if litellm_timeout > 0:
        payload["timeout"] = litellm_timeout
    if max_tokens is not None:
        payload["max_tokens"] = max_tokens
    if temperature is not None:
        payload["temperature"] = temperature
    if merge:
        for k, v in merge.items():
            payload[k] = v

    data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        method="POST",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json; charset=utf-8",
            "Accept": "application/json; charset=utf-8",
        },
    )
    ctx = None
    if url.lower().startswith("https://") and insecure:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE

    with urllib.request.urlopen(req, timeout=timeout, context=ctx) as resp:
        raw = resp.read().decode("utf-8", errors="replace")
    return json.loads(raw)


def repair_utf8_misdecoded_as_latin1(s: str) -> str:
    """Undo UTF-8 bytes wrongly interpreted as latin-1 (one code unit per byte).

    Safe for normal model output: any real CJK or most non-latin-1 Unicode makes
    ``encode('latin-1')`` fail, and we return the string unchanged.
    """
    if not s:
        return s
    try:
        return s.encode("latin-1").decode("utf-8")
    except (UnicodeEncodeError, UnicodeDecodeError):
        return s


def extract_assistant_text(resp: dict[str, Any]) -> str:
    choices = resp.get("choices") or []
    if not choices:
        return ""
    msg = choices[0].get("message") or {}

    def from_content(val: Any) -> str:
        if val is None:
            return ""
        if isinstance(val, str):
            return val.strip()
        if isinstance(val, list):
            parts: list[str] = []
            for block in val:
                if not isinstance(block, dict):
                    continue
                if block.get("type") == "text" and isinstance(block.get("text"), str):
                    parts.append(block["text"])
                elif block.get("type") == "output_text" and isinstance(block.get("text"), str):
                    parts.append(block["text"])
                elif isinstance(block.get("content"), str):
                    parts.append(block["content"])
            return "".join(parts).strip()
        return str(val).strip()

    text = from_content(msg.get("content"))
    if text:
        return repair_utf8_misdecoded_as_latin1(text)
    # Gemini / thinking bridges sometimes omit `content` but set `reasoning_content`.
    rc = msg.get("reasoning_content")
    if isinstance(rc, str) and rc.strip():
        return repair_utf8_misdecoded_as_latin1(rc.strip())
    return ""


def build_messages(skill_body: str, user_query: str) -> list[dict[str, str]]:
    if "{query}" in skill_body:
        system = skill_body.replace("{query}", user_query)
        return [
            {"role": "system", "content": system},
            {"role": "user", "content": "请严格按系统指令输出完整结果。"},
        ]
    return [
        {"role": "system", "content": skill_body},
        {"role": "user", "content": user_query},
    ]


def load_done_ids(out_path: Path) -> set[str]:
    if not out_path.is_file():
        return set()
    done: set[str] = set()
    for line in out_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            obj = json.loads(line)
        except json.JSONDecodeError:
            continue
        if "id" in obj:
            done.add(str(obj["id"]))
    return done


def load_jsonl_last_by_id(out_path: Path) -> dict[str, dict[str, Any]]:
    """Last JSON object per id (string key), for merge/resume."""
    if not out_path.is_file():
        return {}
    last: dict[str, dict[str, Any]] = {}
    for line in out_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            obj = json.loads(line)
        except json.JSONDecodeError:
            continue
        if isinstance(obj, dict) and "id" in obj:
            last[str(obj["id"])] = obj
    return last


def write_merged_jsonl(
    out_path: Path,
    raw: list[Any],
    id_field: str | None,
    merged: dict[str, dict[str, Any]],
    updates: dict[str, dict[str, Any]],
) -> None:
    rows: list[dict[str, Any]] = []
    for i, item in enumerate(raw, start=1):
        sid = str(pick_id(item, id_field, i))
        row = updates.get(sid) or merged.get(sid)
        if row is None:
            raise ValueError(f"Missing output row for id={sid!r} (queries vs merge)")
        rows.append(row)

    def sort_key(r: dict[str, Any]) -> tuple[int, Any]:
        rid = r.get("id")
        try:
            return (0, int(rid))  # type: ignore[arg-type]
        except (TypeError, ValueError):
            return (1, str(rid))

    rows.sort(key=sort_key)
    out_path.write_text(
        "\n".join(json.dumps(r, ensure_ascii=False) for r in rows) + "\n",
        encoding="utf-8",
    )


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        description="Batch POST user queries with a SKILL.md system prompt to an OpenAI-compatible API."
    )
    p.add_argument("--skill", type=Path, required=True, help="Path to SKILL.md")
    p.add_argument("--queries", type=Path, required=True, help="JSON file: array of objects or strings")
    p.add_argument(
        "--limit",
        type=int,
        default=0,
        help="Process at most N items from the queries array (0 = all).",
    )
    p.add_argument(
        "--query-field",
        default=None,
        help="JSON object field for the user text (default: auto question/query/message/text/prompt)",
    )
    p.add_argument(
        "--id-field",
        default=None,
        help="Field to record as id in output (default: index/id/uuid/key or line number)",
    )
    p.add_argument("--out", type=Path, required=True, help="JSONL output path (appended if --resume)")
    p.add_argument(
        "--url",
        default="http://7.242.104.218:4000/v1/chat/completions",
        help="Chat completions URL",
    )
    p.add_argument("--api-key", default="sk-1234567", help="Bearer token without Bearer prefix")
    p.add_argument(
        "--model",
        default="gemini-3.1-pro-preview",
        help="Model id in JSON body (default: gemini-3.1-pro-preview)",
    )
    p.add_argument(
        "--merge-json",
        default=None,
        metavar="JSON",
        help="Optional JSON object merged into the POST body last (gateway-specific).",
    )
    p.add_argument(
        "--timeout",
        type=float,
        default=600.0,
        help="HTTP client read timeout in seconds (urllib).",
    )
    p.add_argument(
        "--litellm-timeout",
        type=float,
        default=600.0,
        help="If > 0, set JSON field `timeout` for LiteLLM upstream (avoids proxy default ~30s). Use 0 to omit.",
    )
    p.add_argument("--insecure", action="store_true", help="Skip TLS verify for HTTPS")
    p.add_argument("--max-tokens", type=int, default=None, help="Optional max_tokens")
    p.add_argument(
        "--temperature",
        type=float,
        default=None,
        help="Optional sampling temperature",
    )
    p.add_argument("--workers", type=int, default=1, help="Concurrent requests (1 = sequential)")
    p.add_argument("--delay", type=float, default=0.0, help="Seconds to sleep after each request (per worker)")
    p.add_argument(
        "--resume",
        action="store_true",
        help="Skip items whose id already appears in the output JSONL",
    )
    p.add_argument(
        "--resume-success-only",
        action="store_true",
        help="Read output JSONL: skip ids whose last line has ok==true; rerun others; rewrite whole file merged by id order.",
    )
    p.add_argument(
        "--dry-run",
        action="store_true",
        help="Print first built messages only, do not call API",
    )
    return p


def main() -> int:
    args = build_parser().parse_args()
    merge_body: dict[str, Any] | None = None
    if args.merge_json:
        try:
            parsed = json.loads(args.merge_json)
        except json.JSONDecodeError as e:
            print(f"--merge-json invalid JSON: {e}", file=sys.stderr)
            return 1
        if not isinstance(parsed, dict):
            print("--merge-json must be a JSON object.", file=sys.stderr)
            return 1
        merge_body = parsed

    _, body = parse_skill_md(args.skill.resolve())
    if not body.strip():
        print("Skill body is empty after frontmatter.", file=sys.stderr)
        return 1

    raw = json.loads(args.queries.read_text(encoding="utf-8"))
    if not isinstance(raw, list):
        print("--queries JSON must be a top-level array.", file=sys.stderr)
        return 1
    if args.limit > 0:
        raw = raw[: args.limit]

    if args.resume and args.resume_success_only:
        print("--resume ignored when --resume-success-only is set.", file=sys.stderr)

    rewrite_mode = args.resume_success_only
    args.out.parent.mkdir(parents=True, exist_ok=True)
    merged = load_jsonl_last_by_id(args.out) if rewrite_mode else {}
    done_ids = load_done_ids(args.out) if args.resume and not rewrite_mode else set()
    write_lock = threading.Lock()
    updates: dict[str, dict[str, Any]] = {}
    append_mode = not rewrite_mode

    def run_one(line_no: int, item: Any) -> dict[str, Any]:
        qid = pick_id(item, args.id_field, line_no)
        query = pick_query_text(item, args.query_field)
        messages = build_messages(body, query)

        if args.dry_run and line_no == 1:
            print(json.dumps(messages, ensure_ascii=False, indent=2)[:12000])

        if args.dry_run:
            return {"dry_run": True, "id": qid}

        t0 = time.perf_counter()
        try:
            resp = chat_completion(
                args.url,
                args.api_key,
                args.model,
                messages,
                args.timeout,
                args.insecure,
                args.max_tokens,
                args.temperature,
                merge_body,
                args.litellm_timeout,
            )
            elapsed = time.perf_counter() - t0
            text = extract_assistant_text(resp)
            choices = resp.get("choices") or []
            ch0 = choices[0] if choices else {}
            finish = ch0.get("finish_reason") or ""
            msg = ch0.get("message") or {}
            tool_calls = msg.get("tool_calls")
            if not text and (finish == "tool_calls" or tool_calls):
                detail = json.dumps(tool_calls, ensure_ascii=False) if tool_calls else str(finish)
                row = {
                    "id": qid,
                    "ok": False,
                    "error": "tool_calls",
                    "detail": detail[:8000],
                }
            elif not text.strip():
                row = {
                    "id": qid,
                    "ok": False,
                    "error": "empty_assistant",
                    "detail": str(finish)[:4000],
                }
            else:
                row = {
                    "id": qid,
                    "ok": True,
                    "elapsed_sec": round(elapsed, 3),
                    "model": resp.get("model"),
                    "usage": resp.get("usage"),
                    "assistant": text,
                }
        except urllib.error.HTTPError as e:
            err = e.read().decode("utf-8", errors="replace") if e.fp else ""
            row = {
                "id": qid,
                "ok": False,
                "error": f"HTTP {e.code}",
                "detail": err[:8000],
            }
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError, OSError) as e:
            row = {"id": qid, "ok": False, "error": type(e).__name__, "detail": str(e)[:4000]}

        if args.delay > 0:
            time.sleep(args.delay)

        if append_mode:
            line = json.dumps(row, ensure_ascii=False)
            with write_lock:
                with args.out.open("a", encoding="utf-8", newline="\n") as f:
                    f.write(line + "\n")
        return row

    tasks: list[tuple[int, Any]] = []
    for i, item in enumerate(raw, start=1):
        qid = pick_id(item, args.id_field, i)
        qs = str(qid)
        if rewrite_mode:
            prev = merged.get(qs)
            if prev is not None and prev.get("ok") is True:
                continue
        elif args.resume and qs in done_ids:
            continue
        tasks.append((i, item))

    if not tasks:
        if rewrite_mode and merged:
            write_merged_jsonl(args.out, raw, args.id_field, merged, {})
            print("Nothing to run; rewrote JSONL from disk (all ok).", file=sys.stderr)
        else:
            print("Nothing to run (empty list or all resumed).")
        return 0

    try:
        pick_query_text(tasks[0][1], args.query_field)
    except (KeyError, TypeError) as e:
        print(f"Invalid queries or --query-field: {e}", file=sys.stderr)
        return 1

    if args.dry_run:
        run_one(tasks[0][0], tasks[0][1])
        print("Dry-run only first item.", file=sys.stderr)
        return 0

    workers = max(1, args.workers)
    if workers == 1:
        for line_no, item in tasks:
            r = run_one(line_no, item)
            if rewrite_mode:
                updates[str(r["id"])] = r
            print(f"done id={pick_id(item, args.id_field, line_no)}", file=sys.stderr)
    else:
        with ThreadPoolExecutor(max_workers=workers) as ex:
            futs = {ex.submit(run_one, ln, it): (ln, it) for ln, it in tasks}
            for fut in as_completed(futs):
                ln, it = futs[fut]
                try:
                    r = fut.result()
                    if rewrite_mode:
                        with write_lock:
                            updates[str(r["id"])] = r
                except Exception as e:
                    qid = pick_id(it, args.id_field, ln)
                    row = {"id": qid, "ok": False, "error": type(e).__name__, "detail": str(e)[:4000]}
                    if append_mode:
                        line = json.dumps(row, ensure_ascii=False)
                        with write_lock:
                            with args.out.open("a", encoding="utf-8", newline="\n") as f:
                                f.write(line + "\n")
                    if rewrite_mode:
                        with write_lock:
                            updates[str(qid)] = row
                    print(f"fail id={qid} {e}", file=sys.stderr)
                    continue
                print(f"done id={pick_id(it, args.id_field, ln)}", file=sys.stderr)

    if rewrite_mode:
        write_merged_jsonl(args.out, raw, args.id_field, merged, updates)

    print(f"Wrote JSONL: {args.out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
