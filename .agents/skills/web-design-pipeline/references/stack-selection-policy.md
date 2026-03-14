# Stack Selection Policy

这份文件是 `web-design-pipeline` 的前端技术选型单一真源。

目标不是选“最熟悉”的框架，而是为以下结果服务：

- 真实交互优先，而不是静态落版
- 页面内部联动完整实现
- 视觉品质高，且与业务语义一致
- 生成式视觉层服务内容，不是独立炫技层
- 代码可维护、可扩展、可继续迭代

## 决策原则

技术选型时按这个顺序判断：

1. 主要目标是重交互产品界面，还是内容/品牌叙事
2. 是否存在明确的 SSR / SEO / 内容分发诉求
3. 动画、空间层级、视觉媒介是否是核心体验，而不是装饰
4. 页面内部状态、组件通信、数据联动有多复杂
5. 是否需要独立的 Canvas / WebGL / 3D / D3 视觉模块
6. 性能预算、交付周期和维护成本是否允许更激进的方案

## 栈选择矩阵

## 当前生态基线

写这份 policy 时，默认参考的是当前成熟且高质量的交互型前端生态：

- `Next.js 15`
- `React 19`
- `Tailwind CSS 4`
- `shadcn/ui`
- `Radix UI`
- `React Aria`
- `motion` (`motion/react`, formerly Framer Motion)
- `GSAP`
- `TanStack Query`
- `Zustand`
- `React Hook Form`
- `Zod`
- `Sonner`
- `Recharts`
- `D3`
- `Three.js`
- `@react-three/fiber`
- `Spline`
- `pnpm`

这不是“默认全装清单”，而是你在做技术映射时应知道的当代能力底盘。

### React + TypeScript

这是重交互产品界面的首选路径，适用于：

- SaaS、工具、工作台、dashboard、复杂筛选和多模块联动
- 需要稳定支撑状态管理、组件通信、复杂视图切换
- 需要集成 D3、Three.js、React Three Fiber、Motion、GSAP
- 需要长期扩展和多文件工程组织

推荐组合：

- `vite` + `react` + `typescript`
- `react-router-dom`：多视图或多步骤流程
- `zustand`：跨模块共享状态
- `motion`：组件级转场、布局动画与手势反馈
- `gsap`：重叙事滚动和时间线编排
- `tanstack-query`：服务端数据缓存与异步状态
- `react-hook-form` + `zod`：表单与校验
- `sonner`：toast 反馈
- `recharts` 或 `d3`：数据可视化
- `d3`：数据交互层
- `three` + `@react-three/fiber`：3D / shader / spatial layer
- `shadcn/ui` + `radix-ui`：高质量基础组件与可访问性原语

### Next.js + TypeScript

适用于：

- 品牌站、营销站、内容站
- SSR / SEO / 首屏抓取明确重要
- 内容与高品质互动并重
- 需要服务端数据、鉴权或内容分发能力

推荐组合：

- `next@15` + `react@19` + `typescript`
- `tailwindcss@4`
- `shadcn/ui`
- `radix-ui`，必要时 `react-aria`
- `motion`：组件动效
- `gsap`：少量高价值滚动编排
- `tanstack-query`：客户端异步状态
- `react-hook-form` + `zod`
- `sonner`
- `recharts` / `d3`
- `three` + `@react-three/fiber` 或 `Spline`
- `pnpm`

不要因为“更高级”或“更流行”而默认选它。没有 SSR / SEO 明确需求时，通常优先考虑 `vite + react`。

### Svelte + TypeScript

适用于：

- 动画和过渡极其重要
- 运行时预算更敏感
- 单页沉浸式体验、实验性交互、细腻运动表现

如果产品重点是复杂状态业务系统，而不是高密度动效体验，通常仍优先 `react`。

### Vue + TypeScript

适用于：

- 内容结构清晰，模板表达和组件编排更重要
- 生态或团队本身偏 Vue
- 需要在内容组织和交互表达之间取得平衡

### Astro + TypeScript

适用于：

- 内容主导，交互只在局部 islands
- 追求较低 JS 负载
- 局部交互增强，而非完整重交互应用壳

它不是重交互工作台的默认壳。

## 生成式视觉层接法

生成式视觉层始终是“网站中的一层”，而不是替代整个前端架构。

推荐做法：

- 背景层：`Canvas` / `WebGL` / `Three.js` / `OGL`
- 前景交互层：`D3` / `SVG` / `Motion` / `Canvas`
- 所有状态仍由主框架掌控，视觉层只消费 props、store 或 selector
- 视觉模块独立放在 `src/generative/`

默认组合建议：

- 组件级动效：`motion`（`motion/react`）
- 滚动叙事：`gsap`
- 数据交互：`d3`
- 3D / shader：`three` + 组件框架适配层，或 `Spline` 用于更快搭建 3D 交互模块

必须提供：

- `prefers-reduced-motion` 降级
- WebGL 不可用时的回退方案
- 重模块懒加载
- 不破坏主信息可读性的层级控制

## html-tailwind 例外条件

`html-tailwind` 不是默认选项，只在以下条件同时成立时允许：

- 用户显式要求
- 页面为零交互或极低交互的纯展示
- 存在明确的归档 / 交付 / 环境约束，导致 TypeScript 多文件项目不合理

即便如此，也必须在 `tech_decision.json` 中明确说明：

- 为什么 `vite + typescript` 或 `astro + typescript` 不合适
- 为什么静态交付不会损害核心体验

## 禁止的错误选型

- 因为熟悉而默认 React / Next / Vue / Svelte
- 因为省事而退回纯静态 HTML
- 因为想炫技而引入不服务业务目标的 3D / shader
- 因为追求“高端感”而忽略交互完整性
- 让视觉层自己维护一套脱节状态

## 最终判断口径

好的技术选型不是“最先进”，而是：

- 最能支撑该场景下的高品质体验
- 最能保证交互真实可用
- 最能承载视觉方向
- 最能让项目继续演进
