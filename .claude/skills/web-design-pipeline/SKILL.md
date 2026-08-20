---
name: web-design-pipeline
description: 端到端网站或app设计代码生成工作流。适用于用户想根据一句 query、产品想法、测试 JSON、需求描述或案例批量生成高质量网站、app。
version: 8.0
tags: [web design, app design, ui generation, data synthesis, front-end]
---

# Web Design Pipeline

这个 skill 的目标不是"快速吐一份页面代码"，而是把一次网站生成任务拆成可复盘、可重跑、可批量化的流水线。

核心原则：

- 先澄清需求和范围，再设计和实现
- 参考现有 skill 的方法，但不要照搬它们的结构和措辞
- 对每个 case 保存过程证据，便于后续批量测试和数据合成
- 设计要兼顾前沿感、多样性与可实现性，避免模板化同质输出
- 你需要强调视觉表现力，优先把"动态交互、插图、空间感、3D、生成式视觉层"视为正式设计语言，而不是后期点缀
- **前端交付栈（v8）**：React 18 + TypeScript + Vite + Tailwind 3.4 + shadcn/ui，由 Frontend Agent 借助 `anthropic-skills:web-artifacts-builder` 的 `init-artifact.sh` 与 `bundle-artifact.sh` 完成脚手架与打包，最终产物是单文件 **`bundle.html`**（parcel + html-inline），浏览器直接双击即可运行
- **Tailwind 主题**通过 **shadcn CSS 变量 (`:root` / `.dark` HSL 三元)** + **`tailwind.config.js` 的 `theme.extend`** 双段配合驱动；Designer Agent 直接产出这两段，Frontend Agent 粘贴落地
- 第三方视觉库（three / p5 / gsap / d3 / lottie-react / lenis 等）通过 `pnpm add` 安装为 npm 依赖，由 parcel 打包进 `bundle.html`，**不再通过 CDN 引入**
- 页面内部各区块之间的交互（导航切换、筛选联动、状态流转、数据传递、动画编排等）必须完整实现，而不是只做外观
- 视觉效果和交互品质是必要的核心竞争力：鼓励多种 generative 方式和代码艺术手法组合，并结合 inspiration 调研成果提升表现力

## 🛑 强制执行纪律 (CRITICAL EXECUTION RULES)

为了防止 AI 模型偷懒、跳步或凭空捏造（Hallucinate），本工作流设定以下严格纪律：

1. **禁止一口气输出**：在执行各个 Agent（PM、Designer、Frontend）时，禁止在一个输出块里把调研和代码全部写完。
2. **无结果不输出**：只有当 `WebSearch` 等工具或 `python` 脚本真实返回结果后，你才能继续执行写入动作。如果你直接默写出了趋势或设计规范，你的任务将被直接判定为失败。

## 何时使用

在这些场景使用本 skill：

- 用户要"生成一个网站""做一个 landing page""根据需求产出前端页面"
- 用户给一条 query、一个 JSON 测试集、一个产品想法，希望端到端生成高质量前端
- 用户强调设计表现力、交互、前沿风格、WebGL、动效、算法艺术
- 用户希望保存中间过程、按案例归档、支持后续批量测试或数据合成

不要把它用于：

- 只改一个已有组件的小样式
- 纯后端任务
- 不涉及网站或前端交付的任务

## 输入形式

接受两类输入：

1. `query`
   - 一句自然语言需求
   - 一个较完整的产品描述

2. `test file`
   - 一个 JSON 文件路径
   - 每条记录至少包含需求文本；若存在 `id`、`domain`、`user_req` 等字段，优先用于归档命名和上下文补全

如果输入模糊但仍可推进，先在 PM 阶段补足合理假设；只有当关键信息缺失会导致架构分叉时才向用户提问。

## 交付目标

每个 case 至少产生：

- PM 产物：`prdSpec.json`（11 个固定字段：user_intent / target_user / usage_context / platform / page_type / primary_task / secondary_tasks / functional_requirements / visual_requirements / interaction_requirements / implicit_requirements）
- Designer 产物：`design_brief.md`（风格方向 + 设计系统 token + 组件规范 + 视觉特效方案 + Tailwind 配置 Block A/Block B 双段，全部整合在一份文件）
- Frontend 产物：单文件 `bundle.html`（React + TS + Vite + Tailwind + shadcn/ui 工程经 parcel + html-inline 打包而来，自包含全部依赖）

## 总流程

**端到端自动执行**。按这个顺序连续执行，不要跳步、不要中途停下来等用户回复：

1. 解析输入并创建 case 目录
2. 调用 PM Agent 产出 `prdSpec.json`，完成后**直接进入下一步**
3. 调用 Designer Agent 做前沿风格探索、设计系统收敛和特效建议。**本阶段必须真实遵从 SKILL 工作流，不可脑补。** 完成后直接进入下一步
4. 调用 Frontend Agent 实现网站：Agent 自行用 `.claude/skills/web-design-pipeline/scripts/init-artifact.sh` 在 `03_frontend/_build/` 下脚手架 React + Vite + shadcn 工程，编辑源码，再用 `.claude/skills/web-design-pipeline/scripts/bundle-artifact.sh` 打包，把 `bundle.html` 留在 `03_frontend/`，清理 `_build/`
5. 归档所有结果，并把可复用设计结论沉淀到资产库
6. 全流程结束后，**只在最终交付时**向用户汇报本次产物路径与关键决策

`init-artifact.sh`、`bundle-artifact.sh`、`shadcn-components.tar.gz` 已**预装在项目本地** `.claude/skills/web-design-pipeline/scripts/`，从项目根目录直接 `bash .claude/skills/web-design-pipeline/scripts/init-artifact.sh _build` 调用即可，无需解析外部 skill 路径。

例外：仅当输入信息缺失到会导致架构分叉、且 PM 阶段也无法用合理假设补足时，才允许在 STEP 2 之前向用户提问；其余任何阶段的"是否继续"都是被禁止的。

## 目录与归档

先读取 `references/output-structure.md`，严格按其中规则归档。

命名格式：`{case_id}@v{N}_{YYYYMMDD}`

如果是单条 query：

- `{case_id}` = 2-4 个英文词描述主题，如 `habit-tracker`
- 完整目录名示例：`habit-tracker@v7_20260315`

把每个 case 的结果放在：

- `outputs/<case_id>@v<N>_<YYYYMMDD>/01_pm/`
- `outputs/<case_id>@v<N>_<YYYYMMDD>/02_designer/`
- `outputs/<case_id>@v<N>_<YYYYMMDD>/03_frontend/`

## Agent 调用协议

不要让各 agent 各说各话。每一步都要基于上游文件继续，而不是重新发明任务。

## 多样性与去同质化

这是关键要求。

不要机械复用同一套：
- 英雄区结构
- 紫蓝渐变
- 居中大标题加三栏卡片

## 技术栈选择原则

此处为顶层约束，与 Frontend Agent 部分的具体选型指南互为补充。

**硬性要求：v8 起所有前端交付使用 React + TypeScript + Vite + Tailwind 3.4 + shadcn/ui，由 `anthropic-skills:web-artifacts-builder` 的脚本完成脚手架与打包，最终交付为单文件 `bundle.html`。** 禁止 Tailwind CDN、禁止 `tailwind.config = {}` 字面量、禁止再用纯原生 JS 字符串拼 DOM。

视觉/动效库按需通过 `pnpm add` 安装为 npm 依赖（会被 parcel 打包进 bundle.html）：

- 复杂状态：React state / zustand
- 表单 + 校验：react-hook-form + zod（shadcn Form 自带集成）
- 强交互动效、滚动叙事：`pnpm add gsap`（含 ScrollTrigger）
- 平滑滚动：`pnpm add lenis`
- 数据可视化：`pnpm add d3` 或 `pnpm add chart.js`
- 生成式视觉背景：`pnpm add p5`
- 3D 场景：`pnpm add three`
- Lottie：`pnpm add lottie-react`
- 图标：`lucide-react`（脚手架已预装）

为什么仍要单文件交付：

- 浏览器直接双击 `bundle.html` 运行，零依赖安装，便于批量测试和数据合成存档
- 单文件便于版本对比、diff 和人工 review
- 但内部走 React + TS + shadcn，拿到组件库、类型检查、可访问性、键盘交互等基础设施，避免每个 case 都重新发明

视觉库选择记录在 `design_brief.md` 的视觉特效方案章节中：

- 是否需要 WebGL / p5.js / Canvas / Three.js / GSAP
- 是否需要插图系统、场景动效编排、3D 层或可交互数据模块
- 生成式视觉层如何与页面内容配合

Frontend Agent 据此 `pnpm add` 对应包，挂载模式见 `references/engineering-guardrails.md` §5。

## 页面内部交互完整性要求

这是新增的硬要求，贯穿 Designer 和 Frontend 两个阶段。

页面不是一组静态截图的拼接，而是一个有状态、有流转、有反馈的交互系统。以下交互维度必须在设计和实现中完整覆盖：

### 导航与视图切换

- 顶部导航、侧边栏、标签页点击后必须真正切换内容区域
- 锚点滚动必须平滑定位到目标区块
- 面包屑、返回按钮、步骤指示器必须反映当前位置并可操作

### 数据联动与筛选

- 筛选器变化必须实时影响列表/卡片/图表的内容
- 搜索框必须支持至少基本的过滤逻辑（前端过滤或模拟搜索）
- 排序控件必须真正重排数据
- 图表参数变化必须反映在可视化输出上

### 表单与输入

- 所有表单字段必须有验证逻辑和错误提示
- 表单提交必须有 loading 态和成功/失败反馈
- 多步表单必须有步骤间的数据保持

### 组件间通信

- 卡片点击展开详情面板
- 列表项选中后联动右侧预览区
- 全局状态（如主题切换、语言切换、用户偏好）必须影响所有相关组件
- 通知/toast 系统必须可由任意操作触发

### 动画与转场

- 页面/视图切换必须有过渡动画
- 元素进入/离开视口必须有编排好的出现/消失动效
- 交互触发的状态变化必须有平滑过渡，而不是瞬间跳变
- 滚动驱动的动画必须精确同步

### 空状态与边界

- 列表为空时必须有空状态视觉
- 加载中必须有骨架屏或 loading 指示
- 错误状态必须有明确的恢复引导

## 视觉效果品质提升策略

这是新增的硬要求。视觉品质不靠堆特效，而靠系统性地把多种方法组合起来。

### 多源灵感融合

Designer Agent 的风格探索阶段必须同时调研：

- 前沿 web design 趋势（Awwwards、FWA、CSS Design Awards、Dribbble、Behance）
- 代码艺术与生成式视觉（OpenProcessing、ShaderToy、Art Blocks、fx(hash)）
- 动态交互范式（Lottie、Rive、GSAP showcases、Framer Motion examples）
- 数据可视化艺术（Observable、D3 gallery、Flourish、Deck.gl showcases）

调研结果必须转化为可实现的视觉策略，写入 `design_brief.md` 的视觉特效方案章节。

### Generative + Code Art 组合模式

Frontend Agent 实现视觉层时，鼓励组合以下方式，不要只用单一手法：

| 组合模式 | 示例 | 适用场景 |
|---------|------|---------|
| Canvas 背景 + CSS 微交互 | 流场粒子背景 + 卡片 hover 涟漪 | 科技产品、AI 工具 |
| WebGL shader + SVG 插图动效 | 噪声渐变背景 + 图标路径动画 | 品牌站、创意机构 |
| Three.js 3D 场景 + 滚动叙事 | 产品 3D 模型 + scroll-driven 转场 | 产品展示、电商 |
| p5.js 生成图案 + D3 数据可视化 | 有机纹理 + 交互式图表 | 科研、环保、农业 |
| GSAP 编排 + Canvas 粒子 | 复杂时间线动画 + 响应式粒子系统 | 叙事型 landing page |
| CSS Houdini + SVG filter | 自定义绘制 API + 滤镜合成 | 轻量但精致的视觉层 |
| Lottie/Rive 动画 + WebGL 后处理 | 向量动画 + 后期光效/模糊 | 插画风格 + 高端质感 |

每个 case 的 `design_brief.md` 必须记录选择了哪些生成式视觉组合方式及原因。

## 参考文件

按需阅读这些文件：

- `../agents/pm-agent.md`
- `../agents/designer-agent.md`
- `../agents/frontend-agent.md`
- `references/output-structure.md`
- `references/design-guardrails.md` — Designer Agent 必读，视觉与交互设计红线
- `references/engineering-guardrails.md` — Frontend Agent 必读，React + Vite + Tailwind + shadcn/ui + Parcel 栈实现红线

本地预装脚本（已就绪）：
- `.claude/skills/web-design-pipeline/scripts/init-artifact.sh` — 脚手架（来自 anthropic-skills:web-artifacts-builder，已拷入项目）
- `.claude/skills/web-design-pipeline/scripts/bundle-artifact.sh` — parcel + html-inline 打包
- `.claude/skills/web-design-pipeline/scripts/shadcn-components.tar.gz` — init 时解包的 shadcn 组件预包

运行环境前置：Node 18+（项目已验证 v22.11）、pnpm 8+（已验证 v8.7.5）、bash。