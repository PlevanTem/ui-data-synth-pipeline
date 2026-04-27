#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Fix assistant text in JSONL where UTF-8 was mis-decoded as latin-1 (gateway mojibake)."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

_scripts = Path(__file__).resolve().parent
if str(_scripts) not in sys.path:
    sys.path.insert(0, str(_scripts))
from batch_skill_llm import repair_utf8_misdecoded_as_latin1


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("input", type=Path, help="Input JSONL (e.g. runs/foo.jsonl)")
    p.add_argument(
        "-o",
        "--output",
        type=Path,
        default=None,
        help="Output path (default: input with suffix .repaired.jsonl)",
    )
    args = p.parse_args()
    out = args.output or args.input.with_suffix(args.input.suffix + ".repaired")
    n = 0
    with args.input.open(encoding="utf-8", newline="\n") as fin, out.open(
        "w", encoding="utf-8", newline="\n"
    ) as fout:
        for line in fin:
            line = line.strip()
            if not line:
                continue
            row = json.loads(line)
            if isinstance(row.get("assistant"), str):
                row["assistant"] = repair_utf8_misdecoded_as_latin1(row["assistant"])
                n += 1
            fout.write(json.dumps(row, ensure_ascii=False) + "\n")
    print(f"Wrote {n} rows to {out}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
