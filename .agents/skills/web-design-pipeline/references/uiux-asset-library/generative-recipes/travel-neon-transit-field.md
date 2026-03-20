# Travel Neon Transit Field

## Summary
组合策略：`Canvas flow-field` + `SVG waypoint pulse` + `component micro-motion`，用于旅游场景中的“路径引导 + 状态反馈”叙事。

## Suitable
- 旅游规划、导航、任务驱动型产品
- 需要高科技冷调且信息密度较高的 web app

## Not Suitable
- 极简纯内容阅读站点
- 长时静态展示且无状态联动需求页面

## Structured Fields
- style_keywords: `high-tech`, `blue-black`, `route-pulse`, `state-feedback`
- interaction_level: `high`
- visual_primitives: `field`, `waypoint`, `glow`, `depth`, `grid`
- motion_primitives: `pulse`, `state-transition`, `micro-feedback`, `scroll-sync`
- generative_primitives: `flow-field`, `particle-system`, `noise-field`
- implementation_hints: `Canvas2D`, `SVG`, `React`, `prefers-reduced-motion fallback`
- uiuxmax_domains: `style`, `color`, `ux`, `landing`, `stack`
- suitable_stacks: `react`, `nextjs`, `vue`
- avoid_patterns: `full-screen-heavy-glow`, `always-on-high-frequency-animation`, `decorative-only-particles`

## Risks
- 视觉层过强导致正文可读性下降
- 动画并发过多导致移动端掉帧

## Guardrails
- 发光透明度上限建议 <= 0.22（背景层）
- 关键文本区域禁用混合模式
- reduced-motion 时关闭连续生成动画，仅保留必要状态反馈
# Travel Neon Transit Field

## 适用场景
- 旅行规划、城市探索、交通导览类 web app
- 需要“高科技蓝黑”调性但又强调可读与可操作

## 不适用场景
- 纯阅读型内容站
- 低端设备占比极高且无降级预算的项目

## 组合策略
- Primary: `flow-field` 背景（Canvas / WebGL 可选）
- Secondary: `hud-grid + waypoint pulse` 结构层
- Feedback: 任务完成、积分变化、waypoint切换触发短促脉冲

## 风险点
- 发光层过强会压制文本可读性
- 只保留背景特效而无业务联动会变成“屏保感”

## 结构化索引
- style_keywords: `high-tech`, `blue-black`, `transit-field`, `hud-minimal`
- interaction_level: `high`
- visual_primitives: `field`, `grid`, `glow`, `depth`, `waypoint`
- motion_primitives: `pulse`, `status-morph`, `micro-feedback`
- generative_primitives: `noise`, `flow`, `particles`
- implementation_hints: `react`, `typescript`, `canvas2d`, `reduced-motion fallback`
- uiuxmax_domains: `style`, `color`, `ux`, `stack`
- suitable_stacks: `react`, `nextjs`
- avoid_patterns: `over-glassmorphism`, `full-screen-neon`, `non-functional-ar`

