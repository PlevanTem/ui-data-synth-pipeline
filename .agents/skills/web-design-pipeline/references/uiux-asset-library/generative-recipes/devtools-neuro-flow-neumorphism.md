# Devtools Neuro Flow Neumorphism

## Summary
面向开发者性能工具的生成式组合：`flow-field background + severity particles + svg micro-interactions`，强调高密度数据可读前提下的动态反馈。

## Applicable
- 复杂 dashboard / observability / devtools
- 需要 dark premium 气质与实时状态感
- 交互等级 `high|immersive`

## Not Suitable
- 纯营销静态页
- 文本主导且无数据联动场景
- 低性能终端占比极高且无法降级时

## Structured Tags
- `style_keywords`: dark-neumorphism, precision-console, flow-energy, devtools
- `interaction_level`: immersive
- `visual_primitives`: depth, field, glow-soft, grid
- `motion_primitives`: pulse, flow, spring-feedback, stagger
- `generative_primitives`: noise, particles, flow, shader-light
- `implementation_hints`: React + TypeScript, Canvas module, SVG chart transitions, CSS token variables
- `uiuxmax_domains`: style,color,typography,ux,chart,stack
- `suitable_stacks`: react,nextjs,vue,svelte
- `avoid_patterns`: full-screen flashy shader, unreadable low-contrast neumorphism, decorative infinite motion

## Risk Notes
- 新拟态在高密度表格中容易牺牲对比度，必须先保可读再保风格。
- 生成式层若与业务状态脱钩，会退化为背景屏保。
