# SaaS Neuro Flow Command

- style_keywords: [neumorphism, command-center, flowfield, secure-signal, data-relay]
- interaction_level: high
- visual_primitives: [soft-depth, field, pulse, grid, heatmap]
- motion_primitives: [pulse, scroll-sync, stagger, morph]
- generative_primitives: [flow-field, noise, particles]
- implementation_hints: [Canvas2D, SVG animation, CSS blend-mode, React state-driven params]
- uiuxmax_domains: [style, color, typography, ux, stack]
- suitable_stacks: [react, nextjs, vue]
- avoid_patterns: [neon overload, unreadable soft-ui, decorative-only particles]

## 适用场景
企业协作工具、运营指挥台、实时监控类 SaaS，需要在高信息密度下保持“平静但有动态反馈”。

## 不适用场景
纯营销单页、低交互内容站、强娱乐导向品牌页。

## 风险点
- 软UI阴影过重会降低文本对比。
- 生成式层若参数无约束，会夺走主内容注意力。

## 组合建议
主层用低速 flow field 映射实时风险，次层用 SVG 脉冲表达事件，交互层用弹性按钮/模态提升操作手感。
