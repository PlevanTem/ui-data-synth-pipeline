---
asset_id: anti-common-web-generation-failures
asset_type: anti-patterns
title: Common Web Generation Anti-Patterns
summary: 汇总网站生成过程中最常见的视觉、交互、技术和资产沉淀反模式。
domains:
  - generic
  - web
  - pipeline
style_keywords:
  - anti-template
  - quality-control
interaction_level: medium
visual_primitives:
  - over-glow
  - glass-cards
  - generic-hero
motion_primitives:
  - decorative-hover
  - empty-animation
implementation_hints:
  - preflight-check
  - review-checklist
uiuxmax_domains:
  - ux
  - style
  - web
  - stack
suitable_stacks:
  - react
  - nextjs
  - vue
  - svelte
avoid_patterns:
  - default-purple-gradient
  - meaningless-glassmorphism
  - over-heavy-stack
  - no-fallback-webgl
component_primitives: []
motion_stack: []
data_stack: []
rendering_stack: []
---

# Anti-Patterns

这个文件记录网站生成过程中常见的同质化和低质量设计问题。

## 视觉同质化

- 默认紫蓝科技渐变，和领域语义无关
- 不分场景地铺满玻璃拟态卡片
- 总是“居中标题 + 副标题 + 3 张卡片 + CTA”
- 过度使用发光、模糊、噪声背景来制造“高级感”

## 信息架构问题

- 英雄区视觉很满，但用户不知道下一步做什么
- Dashboard 信息堆积，没有视觉优先级
- CTA 太多，导致主转化路径不清楚

## 交互问题

- hover 很炫但点击后没有价值
- 动效只追求存在感，不服务于状态切换
- 背景特效抢走正文注意力

## 技术实现问题

- 为简单页面选择过重技术栈
- 引入 WebGL 或 p5.js 却没有降级方案
- 页面可运行性差，却用截图或描述掩盖问题

## 资产沉淀问题

- 把某次案例成品直接复制进资产库
- 把一次性的潮流元素误当成长期可复用方法
- 只记录“喜欢什么”，不记录“为什么”和“不适合什么”

## 使用方式

每次生成前，先快速检查这份清单。

每次生成后，若发现新的重复问题或低质量套路，及时补充。
