# Cosmic Dark Control — 宇宙深色控制台风格

## 风格名称

**Cosmic Dark Control** — 宇宙深色控制台

## 来源

case 005_car-intelligence，2026-03-16，车载 HMI 场景实战沉淀

## 适用场景

- 车载 HMI / 驾驶舱 UI
- IoT 设备控制台（高端感）
- 智能硬件管理界面
- 安防监控 Dashboard
- 需要"系统级可信度"的控制类产品
- 夜间高频使用场景

**不适用**：
- 以内容浏览/发现为主的产品
- 老年用户或低视力用户为主要受众（高对比度需求不同）
- 快消品/电商等需要温暖感的场景

## 核心色彩策略

```css
/* 主背景 — 宇宙深黑，带蓝灰调 */
--bg-primary: #060A12;
--bg-secondary: #0C1220;
--surface: #111827;

/* 强调色 — 冰青/极光蓝（区别于普通科技蓝） */
--accent: #00D4FF;          /* 主强调 */
--accent-glow: rgba(0,212,255,0.25);

/* 状态语义发光色 */
--safe: #10B981;            /* 连接成功、安全状态 */
--warning: #F59E0B;         /* 疲劳、速度偏高 */
--danger: #EF4444;          /* 超速、紧急 */

/* 设备类型发光色编码（来自车内设备语义） */
--climate: #60A5FA;         /* 空调/气候 */
--music: #A78BFA;           /* 音乐/娱乐 */
--seat: #FB923C;            /* 座椅/暖风 */
--window: #34D399;          /* 车窗/通风 */
```

## 与 Ambient Dark IoT 的区别

| 维度 | Ambient Dark IoT | Cosmic Dark Control |
|------|-----------------|---------------------|
| 场景 | 智能家居，居家温馨 | 车载，专业控制台 |
| 强调色 | 暖调（金黄/橙/绿）| 冷调（冰青）|
| 字体 | 圆润现代 | 技术感 Mono + 紧凑 Sans |
| 信息密度 | 中 | 极低（安全驾驶） |
| 触控目标 | 标准 44px | 车规 72px+ |
| 背景动效 | 可适中 | 极弱（不能分散驾驶注意力） |

## 车规 UI 基线规则

1. **最小触控目标**：48×48px（强制），关键功能 72px，紧急按钮 96px
2. **最小字号**：16px，关键仪表数字 28-64px
3. **背景动效约束**：不得在主功能视图区域运行；仅在非核心区域（侧边栏底部）
4. **发光克制**：同时发光的元素不超过 3 个，避免全屏发光竞争
5. **颜色对比度**：WCAG AA（#F0F4FF on #060A12 = 约 16:1，远超标准）

## 结构化标签

```
style_keywords: cosmic-dark, automotive-hmi, safety-glow, voice-first, ambient-intelligence
interaction_level: immersive
visual_primitives: glow, canvas, depth, glass, grid
motion_primitives: waveform, pulse, flow, spring, css-keyframes
implementation_hints: CSS box-shadow glow, backdrop-filter, Canvas 2D, SVG stroke-dashoffset
uiuxmax_domains: style, color, ux, dashboard
suitable_stacks: react-ts, vue-ts, svelte-ts
avoid_patterns: bright-ui, competing-bg-effects, small-touch-targets, purple-blue-gradient
```
