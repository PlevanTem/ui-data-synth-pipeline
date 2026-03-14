#!/usr/bin/env python3
"""Generate reviewable UI/UX Pro Max CSV sync candidates from asset catalog.

This script does NOT modify any CSV files directly.
It produces a conservative JSON file with candidate rows and mapping hints so a
human can review and selectively port stable signals back into ui-ux-pro-max.
"""

from __future__ import annotations

import json
from datetime import date
from pathlib import Path
from typing import Any


LIBRARY_ROOT = Path(__file__).resolve().parent.parent
CATALOG_PATH = LIBRARY_ROOT / "catalog.json"
OUTPUT_PATH = LIBRARY_ROOT / "uiuxmax-sync-candidates.json"


def list_to_csv(values: list[str]) -> str:
    return ", ".join(v for v in values if v)


def complexity_from_interaction(level: str) -> str:
    return {
        "low": "Low",
        "medium": "Medium",
        "high": "High",
        "immersive": "High",
    }.get(level, "Medium")


def type_from_asset_type(asset_type: str) -> str:
    mapping = {
        "style-recipe": "General",
        "trend-note": "General",
        "motion-pattern": "General",
        "palette-strategy": "General",
        "generative-recipe": "General",
        "anti-patterns": "General",
    }
    return mapping.get(asset_type, "General")


def build_style_candidate(asset: dict[str, Any]) -> dict[str, Any]:
    return {
        "source_asset_id": asset["asset_id"],
        "target_csv": "styles.csv",
        "confidence": "medium",
        "candidate_row": {
            "Style Category": asset["title"],
            "Type": type_from_asset_type(asset["asset_type"]),
            "Keywords": list_to_csv(asset.get("style_keywords", []) + asset.get("domains", [])),
            "Primary Colors": list_to_csv(asset.get("visual_primitives", [])),
            "Effects & Animation": list_to_csv(asset.get("motion_primitives", [])),
            "Best For": list_to_csv(asset.get("domains", [])),
            "Do Not Use For": list_to_csv(asset.get("avoid_patterns", [])),
            "Framework Compatibility": list_to_csv(asset.get("suitable_stacks", [])),
            "Complexity": complexity_from_interaction(asset.get("interaction_level", "medium")),
        },
    }


def build_color_candidate(asset: dict[str, Any]) -> dict[str, Any]:
    return {
        "source_asset_id": asset["asset_id"],
        "target_csv": "colors.csv",
        "confidence": "medium",
        "candidate_row": {
            "Product Type": asset["title"],
            "Keywords": list_to_csv(asset.get("domains", []) + asset.get("style_keywords", [])),
            "Primary (Hex)": "",
            "Secondary (Hex)": "",
            "CTA (Hex)": "",
            "Background (Hex)": "",
            "Text (Hex)": "",
            "Border (Hex)": "",
            "Notes": asset.get("summary", ""),
        },
    }


def build_product_candidate(asset: dict[str, Any]) -> dict[str, Any]:
    return {
        "source_asset_id": asset["asset_id"],
        "target_csv": "products.csv",
        "confidence": "low",
        "candidate_row": {
            "Product Type": asset["title"],
            "Keywords": list_to_csv(asset.get("domains", []) + asset.get("style_keywords", [])),
            "Primary Style Recommendation": asset["title"],
            "Secondary Styles": list_to_csv(asset.get("style_keywords", [])),
            "Landing Page Pattern": "",
            "Dashboard Style (if applicable)": "",
            "Color Palette Focus": list_to_csv(asset.get("visual_primitives", [])),
            "Key Considerations": asset.get("summary", ""),
        },
    }


def build_stack_signal(asset: dict[str, Any]) -> dict[str, Any]:
    return {
        "source_asset_id": asset["asset_id"],
        "recommended_stacks": asset.get("suitable_stacks", []),
        "motion_stack": asset.get("motion_stack", []),
        "data_stack": asset.get("data_stack", []),
        "rendering_stack": asset.get("rendering_stack", []),
        "implementation_hints": asset.get("implementation_hints", []),
    }


def main() -> None:
    catalog = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
    assets = catalog.get("assets", [])

    style_candidates: list[dict[str, Any]] = []
    color_candidates: list[dict[str, Any]] = []
    product_candidates: list[dict[str, Any]] = []
    stack_signals: list[dict[str, Any]] = []

    for asset in assets:
        asset_type = asset.get("asset_type")

        if asset_type in {"style-recipe", "trend-note", "motion-pattern", "generative-recipe"}:
            style_candidates.append(build_style_candidate(asset))

        if asset_type == "palette-strategy":
            color_candidates.append(build_color_candidate(asset))

        if asset_type in {"style-recipe", "trend-note", "palette-strategy"}:
            product_candidates.append(build_product_candidate(asset))

        if any(asset.get(key) for key in ("suitable_stacks", "motion_stack", "data_stack", "rendering_stack")):
            stack_signals.append(build_stack_signal(asset))

    output = {
        "version": 1,
        "updated_at": date.today().isoformat(),
        "source_catalog": "references/uiux-asset-library/catalog.json",
        "review_policy": [
            "These candidates are advisory and should be reviewed before updating CSV files.",
            "colors.csv candidates intentionally leave hex columns blank for manual completion.",
            "products.csv candidates are low-confidence because asset-level knowledge is more granular than product taxonomy.",
        ],
        "style_candidates": style_candidates,
        "color_candidates": color_candidates,
        "product_candidates": product_candidates,
        "stack_signals": stack_signals,
    }

    OUTPUT_PATH.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Updated {OUTPUT_PATH}")
    print(
        "Candidates: "
        f"{len(style_candidates)} style, "
        f"{len(color_candidates)} color, "
        f"{len(product_candidates)} product, "
        f"{len(stack_signals)} stack"
    )


if __name__ == "__main__":
    main()
