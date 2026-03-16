# 智能家居中控设计趋势 2026

## 核心趋势

**来源**：web-design-pipeline case 003_smart-home@v4_20260316，基于实际调研

### 1. Ambient Dark Control 风格

智能家居控制界面在 2026 正在从"功能工具感"向"有氛围感的居家空间感"转变。
- 深沉近黑背景（#0D0F14 带蓝灰调）+ 磨砂玻璃卡片叠加
- 设备开启状态以"发光"而非仅"颜色变化"表达
- 每种设备类型有独立的发光色彩编码（暖灯=金黄，空调=冷蓝，安防=绿，娱乐=紫）

**适用场景**：智能家居中控、IoT Dashboard、设备管理类产品
**不适用**：医疗类（需高可及性对比度）、老年人为主的受众

### 2. 2026 智能家居仪表盘 UI 核心原则

- **信息先于操作**：仪表盘应在用户提问之前回答问题（设备状态一屏可见）
- **Grid Card 标准**：卡片成为基础布局单元，替代嵌套 stack 复杂结构
- **极简分组逻辑**：房间维度 > 设备类型维度，用户按空间而非功能组织认知
- **场景联动是核心入口**：预设场景一键触发优先级高于单设备操作

### 3. 多端适配策略差异

- 手机端：底部导航（Dock）+ 单列卡片流 + 固定语音 FAB
- 平板端：可折叠侧边栏 + 双列卡片 + 场景固定在侧边
- 大屏/TV：三列全景布局，左侧场景+导航，中间设备控制，右侧能耗+详情

### 4. 能耗可视化最佳实践

- 多时间维度（今日/周/月）是标配
- 设备耗能排行榜比饼图更有行动导向
- 用暖色（警示）/ 冷色（正常）编码能耗等级，而非仅比较高低
- 圆形进度条表达"节能目标"比柱状图更有情感共鸣

## 反模式提醒

- 避免照搬 HomeAssistant 社区风格（过于功能工具感，缺少情感温度）
- 避免纯粹的科技冷感（全蓝色，金属感），智能家居需要居家温馨感
- 避免让所有设备卡片看起来一样（无类型差异化）

## 结构化标签

```
style_keywords: ambient-dark, glassmorphism, device-glow, card-based, warm-contrast
interaction_level: rich
visual_primitives: glow, glass, grid, depth, gradient
motion_primitives: stagger, pulse, spring, parallax
implementation_hints: CSS box-shadow glow, backdrop-filter blur, Framer Motion stagger
uiuxmax_domains: style, ux, dashboard
suitable_stacks: react-ts, vue-ts
avoid_patterns: pure-white-minimal, cold-blue-only, no-ambient-layer
```
