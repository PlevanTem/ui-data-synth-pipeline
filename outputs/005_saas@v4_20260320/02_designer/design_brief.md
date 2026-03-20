# Design Brief — ClarityMesh Frontend Handoff

## 核心视觉方向
- Direction: Neuro-Flow Command
- 气质：calm / secure / precise / collaborative
- 基调：浅色新拟态容器 + 低频动态背景流场 + 数据状态脉冲

## 布局策略
- Desktop: 三栏主工作台（左侧导航 + 中央协作区 + 右侧情报/状态）
- Tablet: 双栏，地图/白板可切换主视图
- Mobile: 顶部上下文 + 视图切换 tabs + 抽屉详情

## 页面内部交互完整清单
1. 侧栏导航切换 `overview | whiteboard | secure-chat | geo-intel | reports`。
2. 全局筛选（时间/区域/风险）联动：任务队列、地图热力、报表统计同时变化。
3. 白板卡片点击可高亮关联聊天线程。
4. 聊天消息点击可定位关联白板节点或地理事件。
5. 报表计划表单：必填校验、错误提示、提交 loading、成功 toast。
6. 模态与抽屉：支持 ESC/遮罩关闭，带过渡动画。
7. loading/empty/error 状态：白板、聊天、地图、报表均有独立状态组件。

## 动画与视觉母题
- 流场背景作为 atmosphere 层，速度受风险等级影响。
- 热力图和告警卡使用 pulse ring 强调变化事件。
- 数据更新使用 number ticker + smooth transition，避免突跳。

## Generative 实现指南
- 推荐算法：2D flow field + simplex noise
- 参数范围：
  - 粒子数 80-180（按性能分级）
  - 噪声尺度 0.002-0.006
  - 速度 0.12-0.45
  - 不透明度 0.12-0.28
- 触发钩子：风险等级升高 → 流速和亮度增加；筛选切换 → 短暂扰动后回稳
- 可读性保护：背景层 z-index 最低，使用 multiply/soft-light，文本层最小对比 4.5:1

## 组件气质
- 卡片：轻凹凸、边界柔和、强调信息分区
- 按钮：明确主次 CTA，交互反馈可感知
- 图表/地图：数据优先，特效辅助，不遮挡关键标签

## 禁止事项
- 仅做静态布局，不实现联动逻辑
- 使用默认 neon 发光造成阅读干扰
- 过度依赖 hover（需兼容触控）
- 用通用模板替代本案“跨模块聚焦”核心体验
