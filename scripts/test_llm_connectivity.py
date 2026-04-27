#!/usr/bin/env python3
"""
Probe an OpenAI-compatible chat completion endpoint for basic connectivity.

Default host matches the user-provided base; path defaults to /v1/chat/completions
(common for LiteLLM, vLLM, etc.). Override with --url if your gateway uses another path.
"""

from __future__ import annotations

import argparse
import json
import ssl
import sys
import urllib.error
import urllib.request
from typing import Any


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="Test LLM HTTP API connectivity.")
    p.add_argument(
        "--url",
        default="http://7.242.104.218:4000/v1/chat/completions",
        help="Full chat-completions URL (POST).",
    )
    p.add_argument(
        "--api-key",
        default="sk-1234567",
        help="Bearer token (without 'Bearer ' prefix).",
    )
    p.add_argument(
        "--model",
        default="gemini-3.1-pro-preview",
        help="Model id in the JSON body.",
    )
    p.add_argument(
        "--insecure",
        action="store_true",
        help="Skip TLS certificate verification (HTTPS only).",
    )
    p.add_argument(
        "--timeout",
        type=float,
        default=60.0,
        help="Socket timeout in seconds.",
    )
    return p


def main() -> int:
    args = build_parser().parse_args()
    payload: dict[str, Any] = {
        "model": args.model,
        "messages": [
            {
                "role": "user",
                "content": "Hello, are you connected?",
            }
        ],
        "stream": False,
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        args.url,
        data=data,
        method="POST",
        headers={
            "Authorization": f"Bearer {args.api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    )
    ctx = None
    if args.url.lower().startswith("https://") and args.insecure:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE

    print(f"POST {args.url}")
    print(f"model={args.model!r} stream=false")
    try:
        with urllib.request.urlopen(req, timeout=args.timeout, context=ctx) as resp:
            body = resp.read().decode("utf-8", errors="replace")
            print(f"HTTP {resp.status}")
            try:
                obj = json.loads(body)
                print(json.dumps(obj, ensure_ascii=False, indent=2)[:8000])
                if len(body) > 8000:
                    print("... (truncated)")
            except json.JSONDecodeError:
                print(body[:8000])
                if len(body) > 8000:
                    print("... (truncated)")
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8", errors="replace") if e.fp else ""
        print(f"HTTP {e.code} {e.reason}", file=sys.stderr)
        if err_body:
            print(err_body[:4000], file=sys.stderr)
        return 1
    except urllib.error.URLError as e:
        print(f"Request failed: {e.reason}", file=sys.stderr)
        return 1
    except TimeoutError:
        print("Request timed out.", file=sys.stderr)
        return 1

    print("OK: endpoint responded successfully.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
