---
asset_id: motion-ar-wayfinding-pulses
asset_type: motion-pattern
title: AR Wayfinding Pulses
summary: 用低频脉冲圈层和路径尾迹构建轻量空间导向反馈的动效模式。
domains:
  - travel
  - navigation
  - mobility
  - ar
style_keywords:
  - wayfinding
  - spatial
  - guided
interaction_level: medium
visual_primitives:
  - pulse-rings
  - path-trail
  - hotspot
motion_primitives:
  - pulse
  - glow
  - selection-highlight
implementation_hints:
  - canvas
  - css
  - reduced-motion
uiuxmax_domains:
  - ux
  - style
  - stack
suitable_stacks:
  - react
  - nextjs
  - svelte
avoid_patterns:
  - full-page-pulse-overlay
  - high-frequency-pulsing
  - hotspot-noise
component_primitives:
  - map-hotspot
  - route-overlay
motion_stack:
  - motion
  - css
data_stack:
  - zustand
rendering_stack:
  - canvas
  - svg
---

# AR Wayfinding Pulses

## 适用场景
- AR 导览入口
- 地图热点提示
- 需要轻量空间感的定位或探索模块

## 动效模式
- 使用低频率脉冲圈层提示当前热点。
- 辅以短路径粒子或航线尾迹，表达“从这里到那里”的方向感。
- hover 或选中时增强亮度和边框，不依赖大范围位移。

## 实现建议
- 优先 Canvas 或 CSS，避免无证据地上 WebGL。
- reduced-motion 下退化为静态圈层与边框高亮。
- 动效放在局部容器中，不铺满整页。

## 不适用场景
- 高信息密度表格
- 长时间阅读的正文区域

## 风险点
- 脉冲频率过高会引发注意力疲劳。
- 如果热点数量过多，空间层会变成噪声而不是导向。 
