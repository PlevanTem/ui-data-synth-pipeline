# Recipe: Ecommerce Graph Frost Flowfield

## Summary
将“关系图谱 + 磨砂材质 + 流场背景”组合成高信息密度电商的可解释视觉方案，用于在移动端维持高级感与可读性平衡。

## Suitable Scenarios
- 跨境电商、金融商品对比、合规风险可视化
- 需要同时呈现关系网络与交易动作的产品

## Unsuitable Scenarios
- 纯内容展示型博客
- 超低性能预算且无法使用 Canvas/WebGL 的环境

## Risks
- 玻璃层叠过多导致对比下降
- 流场粒子与图谱运动叠加后认知噪声过高

## Structured Metadata
- style_keywords: ["frosted-depth", "semantic-graph", "premium-commerce", "trust-layer"]
- interaction_level: immersive
- visual_primitives: ["glass", "field", "depth", "graph", "glow"]
- motion_primitives: ["flow", "pulse", "focus-zoom", "scroll-sync"]
- generative_primitives: ["flow-field", "particle-system", "force-directed", "noise"]
- implementation_hints: ["React + TypeScript", "Canvas 2D flowfield", "WebGL graph layer", "Framer Motion micro-interactions"]
- uiuxmax_domains: ["style", "color", "typography", "ux", "landing", "stack"]
- suitable_stacks: ["react", "nextjs", "vue"]
- avoid_patterns: ["full-screen heavy glow", "single-technique-only", "glass without contrast guard"]

## Implementation Notes
1. 主层使用 force-directed graph 并提供节点分级渲染。
2. 背景流场速度保持低频，交互时短时增强。
3. 风险态必须颜色+图标+文案三重编码。
4. 支持 reduced-motion 与 WebGL fallback。
