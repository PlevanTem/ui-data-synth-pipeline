# Travel Route Pulse Layering

## 适用场景
- 旅游、地图、探索型 web app
- 需要同时表达“流程效率 + 沉浸感”的产品

## 不适用场景
- 极简纯文本工具页
- 超低性能设备优先且无动效预算的企业内网

## 核心做法
- 主层：Canvas flow-field 低频背景（提供空间方向感）
- 辅层：SVG waypoint pulse（提供目标聚焦）
- 组件层：数字/按钮短反馈动效（提供可操作反馈）

## 结构化标签
- style_keywords: high-tech, route-pulse, cinematic, travel-ui
- interaction_level: rich
- visual_primitives: field, waypoint, glow, depth, grid
- motion_primitives: pulse, state-transition, scroll-sync
- generative_primitives: noise, particles, flow
- implementation_hints: Canvas2D, SVG animation, React state events, reduced-motion
- uiuxmax_domains: style, color, typography, ux, stack
- suitable_stacks: react, nextjs, vue
- avoid_patterns: full-screen heavy particles, unreadable glow overlays, single-effect dependency

## 风险点
- 连续动画过多会抢走任务信息注意力
- 发光/对比失控会导致可读性下降
- 未做 reduced-motion 降级会触发可访问性问题
