# IoT 设备状态发光系统 Palette

## 名称

**IoT Device Status Glow** — 物联网设备类型色彩发光系统

## 适用场景

智能家居、IoT Dashboard、设备管理类 App

## 色彩逻辑

每种设备类型有独立的发光色，基于设备真实感知（灯=暖光/冷光，空调=冷蓝，安防=监控绿，娱乐=影院紫）

```
照明设备：#FFD700 (金黄) / #FF9500 (暖橙) — 暖光灯具激活
气候设备：#60A5FA (冷蓝) — 空调制冷感
安防设备：#34D399 (绿) — 监控运行，对应安全语义
娱乐设备：#A78BFA (紫) — 影音娱乐感
家电设备：#FB923C (橙) — 厨房家电
```

## 背景色系

```
主背景：#0D0F14（带蓝灰调的近黑）
卡片底：#161921（深炭蓝）
磨砂面：rgba(255,255,255,0.06) + blur(16px)
```

## 应用规则

1. 发光色只在设备"开启/激活"时显示，关闭时完全消失（不用灰色替代）
2. 发光色用 30% 透明度作为背景渐变，20-25% 作为 box-shadow，40% 作为 border
3. 同一界面中最多 4-5 种发光色并存，不能超过，避免视觉混乱
4. 离线设备不用任何发光色，用 opacity: 0.5 + 虚线边框表示

## 结构化标签

```
style_keywords: device-glow, status-color, iot, ambient-lighting
visual_primitives: glow, color-coding, depth
uiuxmax_domains: color, style, dashboard
suitable_stacks: react-ts, css-variables
avoid_patterns: grey-only-status, no-color-differentiation
```
