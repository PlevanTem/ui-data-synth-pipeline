---
asset_id: style-interactive-frontend-system-baseline
asset_type: style-recipe
title: Interactive Frontend System Baseline
summary: 面向高品质互动产品界面的当前技术与体验基线配方。
domains:
  - saas
  - dashboard
  - premium-webapp
  - immersive-site
style_keywords:
  - interactive
  - premium
  - immersive
  - product-system
  - motion-led
interaction_level: high
visual_primitives:
  - depth
  - glow
  - grid
  - panel
  - layer
  - shader
  - data
  - 3d
motion_primitives:
  - spring
  - layout-transition
  - scroll-sync
  - parallax
  - reveal
  - timeline
implementation_hints:
  - nextjs15
  - react19
  - tailwind4
  - shadcn-ui
  - radix-ui
  - motion-react
  - gsap
  - tanstack-query
  - zustand
  - react-hook-form
  - zod
  - sonner
  - recharts
  - d3
  - r3f
  - spline
uiuxmax_domains:
  - style
  - ux
  - stack
  - chart
suitable_stacks:
  - nextjs
  - react
  - shadcn
component_primitives:
  - shadcn-ui
  - radix-dialog
  - radix-tabs
  - command-palette
  - data-table
motion_stack:
  - motion
  - gsap
data_stack:
  - tanstack-query
  - zustand
  - react-hook-form
  - zod
  - sonner
rendering_stack:
  - recharts
  - d3
  - r3f
  - spline
avoid_patterns:
  - decorative-3d-only
  - fake-premium-hover-only
  - isolated-background-effects
  - template-dashboard-look
---

# Interactive Frontend System Baseline

这不是“所有项目都必须照抄”的技术清单，而是一套适合高品质、互动丰富、沉浸式前端界面的当前基线 recipe。

## 适用场景

- 高端产品型 web app
- 互动丰富的 dashboard / SaaS
- 兼顾品牌感与复杂交互的 Next.js 站点
- 需要把内容层、交互层、动画层、渲染层和系统层组合起来的项目

## 推荐分层

### 内容层

- `Next.js 15` + `React 19`
- Server Components / Actions 处理内容骨架和服务端能力

### 组件层

- `shadcn/ui` 作为基础组件拥有权
- `Radix UI` 作为无障碍原语
- `React Aria` 作为某些复杂可访问性交互的替代方案

### 样式层

- `Tailwind CSS 4`
- CSS variables / token-driven theme system

### 动效层

- `motion` (`motion/react`) 负责组件级动效、布局动画、手势反馈
- `GSAP` 只用于高价值滚动、叙事时间线、复杂视差，不应全站滥用

### 交互与状态层

- `TanStack Query`：服务端状态、缓存、异步获取
- `Zustand`：客户端 UI 状态、视图状态、跨模块联动
- `React Hook Form` + `Zod`：表单与校验
- `Sonner`：toast 反馈

### 可视化与渲染层

- `Recharts`：常规产品图表
- `D3`：高自由度数据可视化和交互
- `Three.js` / `@react-three/fiber`：3D、shader、空间场景
- `Spline`：更快搭建局部 3D 交互模块

## 使用原则

### 1. 框架只是底盘

不要把特色寄托在 `Next.js` 或 `React` 名字上。真正的差异来自：

- 项目专属视觉语法
- 真实模块联动
- 动画节奏
- 渲染层与内容层的耦合

### 2. 先定体验押注

先决定这次作品要赢在：

- 空间纵深
- 材质与光感
- 叙事滚动
- 组件联动
- 生成式视觉与内容关系
- 操作后页面“活起来”的反馈

再决定各层由什么技术承载。

### 3. 真交互优先于伪高级

优先实现：

- 筛选时视图重组
- 点击后多模块同步变化
- 信息揭示型 hover / focus / drag
- 与状态相关的动画推进

不要停留在：

- 玻璃卡片
- 渐变字
- 视频背景
- 孤立的粒子背景

## 风险与边界

- `GSAP` 适合高价值段落，不适合全站替代基础动效系统
- `R3F` 适合和状态深度耦合的 3D 模块，展示型 3D 也可考虑 `Spline`
- `D3` 适合复杂可视化，不必为了“高级感”强行取代所有图表
- `TanStack Query` 管服务端状态，`Zustand` 管客户端状态，不要混成一锅

## 不适用场景

- 纯静态品牌页
- 极低交互的轻展示页
- 预算极低、只求快速归档的 demo

这些场景应选择更轻的组合，而不是全量上栈。
