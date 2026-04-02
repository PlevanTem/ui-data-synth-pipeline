---
style_keywords: ["calm", "healing", "soft-glassmorphism", "organic-shapes", "medical", "elderly-friendly"]
interaction_level: "medium"
visual_primitives: ["glow", "field", "glass", "organic-gradient"]
motion_primitives: ["pulse", "fluid", "layout-flip", "staggered-fade"]
implementation_hints: ["CSS blur", "Framer Motion layout", "CSS keyframe blob"]
uiuxmax_domains: ["style", "color", "ux"]
suitable_stacks: ["React", "Framer Motion", "TailwindCSS"]
avoid_patterns: ["clinical-hard-edges", "pure-white-backgrounds", "dense-data-tables"]
---

# Calm Healing Dashboard

## Description
A style recipe specifically designed for health, wellness, and medical apps that need to present complex data without inducing anxiety. It replaces traditional "clinical" white/blue color schemes with warm off-whites, soft glassmorphism, and organic gradient backgrounds.

## Key Characteristics
- **Background**: Ambient, slow-moving fluid gradients (Aurora) in warm tones (peach, mint green, soft blue) indicating overall status.
- **Cards**: Soft glassmorphism (`backdrop-filter: blur`, semi-transparent white) to let the healing background peek through.
- **Data Visualization**: Smooth splines instead of hard-angled line charts. Heart rate or similar vital signs use subtle, continuous pulsing animations.
- **Accessibility**: Built-in support for "Elderly Mode" via layout animations (e.g., Framer Motion), which swaps dense charts for large, readable status badges and simplified language without losing context.

## Usage Scenarios
- Health tracking dashboards
- Chronic disease management apps
- Meditation and sleep tracking apps
- Apps with a significant elderly user base requiring a less intimidating interface

## Implementation Details
- Use CSS `mix-blend-mode: multiply` and `filter: blur` on animated background blobs.
- Use `framer-motion` `layout` prop for seamless switching between normal density and elderly (low density) modes.
