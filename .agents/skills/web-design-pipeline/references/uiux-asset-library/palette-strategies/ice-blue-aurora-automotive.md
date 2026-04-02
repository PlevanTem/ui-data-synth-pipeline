# 冰青极光色板 — 车载/设备控制场景

## 名称

**Ice-Blue Aurora Control Palette** — 冰青极光控制台配色

## 来源

case 005_car-intelligence，2026-03-16

## 适用场景

- 车载 HMI、驾驶舱界面
- 高端 IoT / 设备控制 Dashboard
- 科技感强、专业感强的控制类产品
- 夜间场景为主的界面

**不适用**：
- 消费级电商/娱乐产品（缺少温暖感）
- 医疗（需要高亮度高对比度白色系）
- 需要强品牌色适配的场景

## 核心色板

```css
/* 背景层次 */
#060A12  /* 宇宙深黑主背景 */
#0C1220  /* 卡片底色 */
#111827  /* 表面层 */
#1A2535  /* 抬升表面 */

/* 强调色 */
#00D4FF  /* 冰青主色 — 系统激活/AI在线/导航 */
#0099BB  /* 冰青暗色 — 悬停/按压 */

/* 状态语义色 */
#10B981  /* 安全绿 — 连接成功/服务可用 */
#F59E0B  /* 琥珀警告 — 疲劳/速度偏高 */
#EF4444  /* 紧急红 — 超速/碰撞/求援 */

/* 设备语义色（可选扩展） */
#60A5FA  /* 空调/气候蓝 */
#A78BFA  /* 音乐/娱乐紫 */
#FB923C  /* 座椅/暖风橙 */
#34D399  /* 车窗/通风绿 */

/* 文字 */
#F0F4FF  /* 主文字 — 带冷调白 */
#8B9DC3  /* 次文字 — 蓝灰色 */
#4A5A7A  /* 三级文字 — 深蓝灰 */
```

## 与常见"科技蓝"的差异

- 普通科技蓝：#0066FF / #1D4ED8 → 过于常规，无独特性
- 本色板：#00D4FF（冰青）→ 更轻盈、更冷空间感，类似极光/冰层质感
- 背景不是纯黑，而是 #060A12（带蓝灰调）→ 避免纯黑的廉价感

## 结构化标签

```
style_keywords: ice-blue, cosmic, aurora, control-panel
interaction_level: immersive
visual_primitives: glow, depth, glass
uiuxmax_domains: color, style
suitable_stacks: react-ts, vue-ts, svelte-ts
avoid_patterns: pure-black-bg, standard-tech-blue, warm-tones
```
