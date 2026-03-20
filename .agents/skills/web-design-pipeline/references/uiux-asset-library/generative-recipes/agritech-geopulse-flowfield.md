# AgriTech GeoPulse Flowfield

## 适用场景
- 农业、物流、能源等“资源调度 + 地理监控”类产品。
- 需要在高信息密度下维持科技感和可信度的深色界面。

## 不适用场景
- 纯内容阅读页或低交互宣传页。
- 主视觉要求极简静态且不需要实时状态反馈的场景。

## 组合策略
- 主层：Canvas flow-field（noise + particles）表达系统流动性。
- 次层：地图热区脉冲（alpha mapping）表达风险聚焦。
- 数据层：SVG 路径 morph 和数值 ticker 表达指标变化。
- 组件层：按钮/toast 微交互增强操作确认。

## 风险点
- 若背景层对比过高会干扰数据可读性。
- 若所有层都高频运动会引发认知疲劳和性能抖动。

## 结构化标签
- `style_keywords`: geopulse, tactical-ui, dark-command, agri-flow
- `interaction_level`: immersive
- `visual_primitives`: field, heatmap, route, glow, depth, grid
- `motion_primitives`: pulse, morph, drift, edge-highlight, scroll-sync
- `generative_primitives`: noise, particles, flow, wave
- `implementation_hints`: Canvas2D, SVG animation, map heat layer, shared state store
- `uiuxmax_domains`: style, color, ux, chart, stack
- `suitable_stacks`: react, nextjs, vue
- `avoid_patterns`: full-screen neon bloom, template hero cards, unbounded infinite animation
