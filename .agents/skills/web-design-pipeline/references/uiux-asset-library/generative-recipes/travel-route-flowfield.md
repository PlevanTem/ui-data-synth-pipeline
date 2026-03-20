# travel-route-flowfield

## Summary
将“旅行路径语义”与 flow-field 粒子背景结合：背景表达探索氛围，前景路径线表达下一步行动，适合需要高科技但强可读性的旅游/导航类产品。

## Suitable
- 旅游规划、AR 导览、地理探索类 web app
- 需要“动态感 + 信息可读性”并存的深色界面

## Not Suitable
- 医疗告警、金融交易等对稳定静态阅读优先的高风险界面
- 低性能终端比例极高且无法提供降级的项目

## Metadata
- style_keywords: `high-tech`, `route-driven`, `calm-dark`, `exploration`
- interaction_level: `rich`
- visual_primitives: `field`, `route-line`, `signal-node`, `depth`, `glow`
- motion_primitives: `pulse`, `state-linked`, `micro-spring`, `fade-sequence`
- generative_primitives: `flow-field`, `particles`, `noise`
- implementation_hints: `Canvas 2D`, `SVG path animation`, `Framer Motion`, `reduced-motion fallback`
- uiuxmax_domains: `style,color,ux,prompt,stack`
- suitable_stacks: `react`, `nextjs`, `svelte`
- avoid_patterns: `full-screen strong glow`, `decorative-only particles`, `color-only status cues`

## Risks
- 背景粒子过密会降低可读性
- AR 区域与动态背景叠加时易出现信息竞争

## Guardrails
- 粒子透明度上限 0.22
- 移动端粒子数量小于等于 72
- `prefers-reduced-motion` 时切换到静态纹理
