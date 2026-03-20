# Travel Quest AR - Style Research

## 设计问题定义
本案需要在高科技蓝黑冷调下，同时实现“流程更短、反馈更清晰、失败可恢复”。核心挑战是把 `任务-积分-商城-无障碍表单-AR` 变成连续交互系统，而不是模块拼接。

## 趋势扫描（基于真实 WebSearch）
- 旅游 UI 趋势：AI 规划、任务闭环、移动优先持续增强（Dribbble/Behance）。
- 交互趋势：3D globe、路径叙事、状态驱动反馈上升（旅行互动站点案例）。
- 视觉趋势：蓝黑深底 + 冷青强调色 + 可控发光层成为“科技可信感”主流。
- 可用性趋势：AR 体验强调权限拒绝/设备不支持时的降级可用路径。

## Generative 与代码艺术调研结论
- 适合本案的算法族群：`flow-field`、`particle-system`、`noise-field`。
- 适合本案的组合：Canvas 流场主层 + SVG waypoint 脉冲 + 组件级微动效。
- 风险控制：减少常驻高频动画，优先状态触发型动画；强制支持 `prefers-reduced-motion`。

## 方向发散

### 方向 A：Precision Mission Console（保守高完成）
- 关键词：`structured` `tactical` `clear-state`
- 优点：可读性强，实施风险低。
- 缺点：探索感偏弱，品牌辨识度一般。

### 方向 B：Neon Transit Field（主推）
- 关键词：`blue-black` `route-pulse` `guided-motion`
- 优点：可把任务进度、积分、AR 点位映射成统一视觉叙事。
- 风险：发光和动态层过量会干扰表单可读性。
- 控制：限制亮度/透明度和并行动画数量。

### 方向 C：Orbit Atlas Lab（实验）
- 关键词：`3d-globe` `cinematic` `orbital`
- 优点：视觉冲击强。
- 缺点：实现复杂、移动端性能风险高，不利于“流程简化”目标。

## 最终选型
选择方向 B `Neon Transit Field`，并继承方向 A 的可读性纪律。该组合最能同时满足高科技氛围、交互完整性和可访问性要求。

## 动态交互策略
- 任务完成 -> 积分数值变化 + 路径亮度短脉冲。
- 商城兑换 -> 按钮态、余额、账本和 toast 联动。
- 表单步骤 -> 转场 + 字段级错误提示 + 焦点管理。
- AR waypoint -> overlay 标签与方向提示实时更新。

## 去同质化策略
- 避免“居中标题 + 三卡片”的模板首屏。
- 避免满屏毛玻璃和无语义粒子背景。
- 生成式视觉必须绑定业务状态，不做独立屏保层。

## 可沉淀资产映射
- style_keywords: `high-tech`, `route-feedback`, `blue-black`, `accessible-motion`
- interaction_level: `high`
- visual_primitives: `field`, `glow`, `depth`, `waypoint`, `grid`
- motion_primitives: `pulse`, `scroll-sync`, `micro-feedback`, `state-transition`
- implementation_hints: `Canvas2D`, `SVG`, `React state`, `CSS blend modes`
