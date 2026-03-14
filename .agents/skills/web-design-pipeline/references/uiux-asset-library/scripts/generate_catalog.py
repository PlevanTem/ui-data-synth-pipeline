#!/usr/bin/env python3
"""Generate catalog.json from asset frontmatter.

This script scans the UI/UX asset library, extracts YAML-like frontmatter from
Markdown assets, and rebuilds catalog.json using a stable field order.

It intentionally supports only the frontmatter subset used in this repository:
- scalar values: key: value
- list values:
    key:
      - item-a
      - item-b
- empty lists: key: []
"""

from __future__ import annotations

import json
import re
from datetime import date
from pathlib import Path
from typing import Any


LIBRARY_ROOT = Path(__file__).resolve().parent.parent
CATALOG_PATH = LIBRARY_ROOT / "catalog.json"

EXCLUDED_FILE_NAMES = {"README.md", "asset-schema.md"}
EXCLUDED_DIR_NAMES = {"templates", "scripts"}

REQUIRED_FIELDS = [
    "asset_id",
    "asset_type",
    "title",
    "summary",
    "domains",
    "style_keywords",
    "interaction_level",
    "uiuxmax_domains",
    "suitable_stacks",
]

OPTIONAL_FIELDS = [
    "visual_primitives",
    "motion_primitives",
    "implementation_hints",
    "avoid_patterns",
    "component_primitives",
    "motion_stack",
    "data_stack",
    "rendering_stack",
]

FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---\n?", re.DOTALL)


def strip_quotes(value: str) -> str:
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {'"', "'"}:
        return value[1:-1]
    return value


def parse_scalar(raw: str) -> Any:
    value = raw.strip()
    if value == "[]":
        return []
    return strip_quotes(value)


def parse_frontmatter_block(block: str) -> dict[str, Any]:
    data: dict[str, Any] = {}
    lines = block.splitlines()
    i = 0

    while i < len(lines):
        line = lines[i]
        if not line.strip():
            i += 1
            continue

        if ":" not in line:
            raise ValueError(f"Invalid frontmatter line: {line}")

        key, _, remainder = line.partition(":")
        key = key.strip()
        remainder = remainder.strip()

        if remainder:
            data[key] = parse_scalar(remainder)
            i += 1
            continue

        items: list[Any] = []
        i += 1
        while i < len(lines):
            nested = lines[i]
            if nested.startswith("  - "):
                items.append(parse_scalar(nested[4:]))
                i += 1
                continue
            if not nested.strip():
                i += 1
                continue
            break
        data[key] = items

    return data


def extract_frontmatter(text: str) -> dict[str, Any] | None:
    match = FRONTMATTER_RE.match(text)
    if not match:
        return None
    return parse_frontmatter_block(match.group(1))


def should_include(path: Path) -> bool:
    if path.name in EXCLUDED_FILE_NAMES:
        return False
    relative = path.relative_to(LIBRARY_ROOT)
    return not any(part in EXCLUDED_DIR_NAMES for part in relative.parts)


def relative_asset_path(path: Path) -> str:
    return str(path.relative_to(LIBRARY_ROOT)).replace("\\", "/")


def build_asset_entry(path: Path, frontmatter: dict[str, Any]) -> dict[str, Any]:
    missing = [field for field in REQUIRED_FIELDS if field not in frontmatter]
    if missing:
        missing_str = ", ".join(missing)
        raise ValueError(f"{relative_asset_path(path)} missing required fields: {missing_str}")

    entry: dict[str, Any] = {}
    for field in REQUIRED_FIELDS:
        entry[field] = frontmatter[field]
    entry["path"] = relative_asset_path(path)
    for field in OPTIONAL_FIELDS:
        if field in frontmatter:
            entry[field] = frontmatter[field]
    return entry


def main() -> None:
    assets: list[dict[str, Any]] = []

    for path in sorted(LIBRARY_ROOT.rglob("*.md")):
        if not should_include(path):
            continue

        frontmatter = extract_frontmatter(path.read_text(encoding="utf-8"))
        if not frontmatter or "asset_id" not in frontmatter:
            continue

        assets.append(build_asset_entry(path, frontmatter))

    assets.sort(key=lambda item: item["asset_id"])

    asset_types: list[str] = []
    for asset in assets:
        asset_type = asset["asset_type"]
        if asset_type not in asset_types:
            asset_types.append(asset_type)

    catalog = {
        "version": 1,
        "updated_at": date.today().isoformat(),
        "root": "references/uiux-asset-library",
        "asset_count": len(assets),
        "asset_types": asset_types,
        "assets": assets,
    }

    CATALOG_PATH.write_text(
        json.dumps(catalog, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(f"Updated {CATALOG_PATH} with {len(assets)} assets.")


if __name__ == "__main__":
    main()
