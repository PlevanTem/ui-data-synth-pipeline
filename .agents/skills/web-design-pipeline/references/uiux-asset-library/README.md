# UI/UX Asset Library

这里不是案例成品仓库，而是设计能力沉淀区。

## 目标

把每次 case 中可泛化的 UI/UX 结论沉淀下来，减少重复思考，同时避免输出越来越像同一套模板。

这套资产库现在不仅服务 `web-design-pipeline`，也要和 `ui-ux-pro-max` 的 CSV 检索体系互通。目标不是堆参考，而是形成一套可检索、可复用、可扩展的风格知识库。

## 子目录说明

- `trend-notes/`
  - 记录某类领域、情绪或交互趋势
  - **当前资产**：`ai-meeting-tool-design-2026.md`、`ios26-liquid-glass-web-adaptation.md`、`travel-frictionless-flow-2026.md`、`component-library-mcp-era-2026.md`（新）
- `style-recipes/`
  - 记录可复用风格配方
  - **当前资产**：`liquid-glass-spatial-commerce.md`、`liquid-glass-mobile-commerce.md`、`devtools-precision-console.md`
- `palette-strategies/`
  - 记录配色体系和适用语境
  - **当前资产**：`deep-slate-ice-blue-productivity.md`、`ice-blue-amber-ecommerce.md`、`blue-black-wayfinding.md`
- `motion-patterns/`
  - 记录动效模式、适用场景和性能风险
  - **当前资产**：`streaming-text-reveal.md`、`ar-wayfinding-pulses.md`、`animated-text-primitives.md`（新：文字动效原语库，含 MagicUI/ReactBits 组件速查）
- `generative-recipes/`
  - 记录生成式视觉和代码艺术的组合策略
  - **当前资产**：`calm-fluid-intelligence.md`、`canvas-waveform-ai-listening.md`
- `anti-patterns.md`
  - 记录常见同质化问题和设计误区

## 沉淀规则

- 只沉淀“可复用规律”，不直接复制某个 case 的最终文案
- 每条资产都写清楚：
  - 适用场景
  - 不适用场景
  - 风险与反模式
- 如果某条经验还不足以泛化，不要入库
- 每条资产尽量带上结构化标签，便于和 `ui-ux-pro-max` 的 CSV 维度互相映射

## 双索引原则

同一条资产最好同时满足两种阅读方式：

- 作为 Markdown，被设计师快速理解其脉络、场景和风险
- 作为结构化信号，被检索系统映射到 style/color/typography/ux/prompt/stack 等维度

建议每条资产补齐以下元信息字段：

- `style_keywords`
- `interaction_level`: `low|medium|high|immersive`
- `visual_primitives`
- `motion_primitives`
- `implementation_hints`
- `uiuxmax_domains`
- `suitable_stacks`
- `avoid_patterns`

如果一条资产很难被抽象成这些字段，说明它还偏案例描述，不够稳定，暂时不应视为成熟资产。

## 资产类型补充说明

- `trend-notes/`
  - 除趋势描述外，要尽量提炼“正在上升的视觉信号”和“可迁移到网页中的实现方向”
- `style-recipes/`
  - 不只写静态版式，还应包含交互语言、动画编排、插图/3D 使用边界
- `palette-strategies/`
  - 颜色不只描述审美，也要描述可读性、层级对比和动态媒介中的使用限制
- `motion-patterns/`
  - 必须说明叙事作用、触发条件、性能风险和降级方案

## 建议模板

建议在每条资产开头使用简短的结构化块，格式可灵活，但字段尽量统一：

```md
## Metadata

- style_keywords: futuristic, editorial, tactile
- interaction_level: high
- visual_primitives: depth, glow, grid, illustration
- motion_primitives: parallax, pulse, scroll-sync
- implementation_hints: css, svg, canvas
- uiuxmax_domains: style, ux, prompt, stack
- suitable_stacks: react, nextjs, svelte
- avoid_patterns: meaningless-glassmorphism, decorative-3d-only
```

## 命名建议

使用短英文 slug：

- `b2b-dashboard-density.md`
- `warm-editorial-commerce.md`
- `soft-tech-motion-patterns.md`
