---
name: web-design-pipeline
description: 端到端网站设计与前端生成工作流。适用于用户想根据一句 query、产品想法、测试 JSON、需求描述或案例批量生成高质量网站、landing page、dashboard、营销页或 web app 原型时。遇到网站设计、前端生成、UI 风格探索、技术栈选型、批量测试网站生成、沉淀设计资产、为 UI 数据合成保存中间过程等任务时，应优先使用此 skill，而不是直接一次性写代码。
---

# Web Design Pipeline

这个 skill 的目标不是"快速吐一份页面代码"，而是把一次网站生成任务拆成可复盘、可重跑、可批量化的流水线。

核心原则：

- 先澄清需求和范围，再设计和实现
- 参考现有 skill 的方法，但不要照搬它们的结构和措辞
- 对每个 case 保存过程证据，便于后续批量测试和数据合成
- 设计要兼顾前沿感、多样性与可实现性，避免模板化同质输出
- 你需要强调网站的表现力，优先把"动态交互、插图、空间感、3D、生成式视觉层"视为正式设计语言，而不是后期点缀
- **前端交付必须使用 TypeScript 或前端组件框架**，不接受纯静态 HTML 作为最终交付
- **全面拥抱 Tailwind CSS V4 原生架构**：禁止生成和使用过时的 `tailwind.config.js`，所有的设计 Token（颜色、间距、排版）必须直接转化为基于 `@theme` 指令的原生 CSS 变量写入全局样式。
- 页面内部各区块之间的交互（导航切换、筛选联动、状态流转、数据传递、动画编排等）必须完整实现，而不是只做外观
- 视觉效果和交互品质是必要的核心竞争力：鼓励多种 generative 方式和代码艺术手法组合，并结合 inspiration 调研成果提升表现力

## 🛑 强制执行纪律 (CRITICAL EXECUTION RULES)

为了防止 AI 模型偷懒、跳步或凭空捏造（Hallucinate），本工作流设定以下严格纪律：

1. **禁止一口气输出**：在执行各个 Agent（PM、Designer、Frontend）时，禁止在一个输出块里把调研和代码全部写完。
2. **强制思考与执行链路 (Chain of Thought)**：在进行每个 agent 角色阶段的任何文件写入之前，你**必须**按照不同 agent 的skill先输出 `<execution_plan>` 标签：
   ```xml
<execution_plan>
- [ ] 将调用的工具与参数...
- [ ] 等待工具返回...
</execution_plan>

（注意：当输出了 `<execution_plan>` 后，你必须在同一轮对话中或者紧接着的下一轮中，**真实执行这些工具调用**，而不是假装执行然后直接返回结果。）
   ```
3. **无结果不输出**：只有当 `WebSearch` 等工具或 `python` 脚本真实返回结果后，你才能继续执行写入动作。如果你直接默写出了趋势或设计规范，你的任务将被直接判定为失败。

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

- PM 产物：`prd.md`（推理记录）、`requirement_spec.json`（执行契约 + 设计意图）、`ia_structure.json`（内容意图地图）
- Designer 产物：`style_research.md`、`design_system.json`、`component_specs.json`、`design_brief.md`、`visual_effects.json`
- Frontend 产物：基于 TypeScript/组件框架的可运行前端源码、`tech_decision.json`、`self_review.json`
- 元数据：`meta.json`

## 总流程

按这个顺序执行，不要跳步：

1. 解析输入并创建 case 目录
2. 调用 PM Agent 产出需求和信息架构，**完成后必须向用户输出 "PM Agent 已完成，是否继续？"，等待用户回复后再推进**。
3. 调用 Designer Agent 做前沿风格探索、设计系统收敛和特效建议。**本阶段必须真实遵从SKILL工作流，不可脑补。**
4. 调用 Frontend Agent 做技术栈决策并实现网站
5. 归档所有结果，并把可复用设计结论沉淀到资产库

## 目录与归档

先读取 `references/output-structure.md`，严格按其中规则归档。详细版本历史见 `CHANGELOG.md`。

**当前管线版本：`v4`（2026-03-15）**

命名格式：`{case_id}@v{N}_{YYYYMMDD}`

如果是单条 query：

- `{case_id}` = 2-4 个英文词描述主题，如 `habit-tracker`
- 完整目录名示例：`habit-tracker@v4_20260315`

如果来自测试文件且有 `id`：

- `{case_id}` = `{NNN}_{domain_slug}`，如 `010_meeting-collab`
- 完整目录名示例：`010_meeting-collab@v4_20260315`

把每个 case 的结果放在：

- `outputs/<case_id>@v<N>_<YYYYMMDD>/01_pm/`
- `outputs/<case_id>@v<N>_<YYYYMMDD>/02_designer/`
- `outputs/<case_id>@v<N>_<YYYYMMDD>/03_frontend/`

同时把可复用设计结论沉淀到：

- `references/uiux-asset-library/`

## Agent 调用协议

不要让各 agent 各说各话。每一步都要基于上游文件继续，而不是重新发明任务。

### PM Agent

调用 `agents/pm-agent.md`，输入：

- 原始 query 或测试项
- 已知字段：`id`、`domain`、`user_req`、`original_example_text`
- case 输出目录

产出必须写入：

- `01_pm/prd.md`
- `01_pm/requirement_spec.json`
- `01_pm/ia_structure.json`

### Designer Agent

调用 `agents/designer-agent.md`，输入：

- `01_pm/requirement_spec.json`（主要输入）
- `01_pm/ia_structure.json`
- `01_pm/prd.md`（可选参考）
- 资产库路径 `references/uiux-asset-library/`

Designer Agent 必须先探索再收敛：

- 用 `design-inspiration-ai` 的方法做风格探索和趋势判断
- 用 `ui-ux-pro-max` 做设计系统、排版、配色、动效和可访问性收敛
- 在风格探索和视觉特效阶段，主动研究多种 generative 视觉方式和代码艺术手法的组合可能性，把调研结果写入 `visual_effects.json`

产出必须写入：

- `02_designer/style_research.md`
- `02_designer/design_brief.md`
- `02_designer/design_system.json`
- `02_designer/component_specs.json`
- `02_designer/visual_effects.json`

### Frontend Agent

调用 `agents/frontend-agent.md`，输入：

- `01_pm/requirement_spec.json`（主要输入，重点读取 `execution_contracts`）
- `01_pm/ia_structure.json`
- `02_designer/` 下全部产物

Frontend Agent 需要先做 `tech_decision.json`，再实现。

**硬性要求：所有前端交付必须使用 TypeScript 或前端组件框架**，禁止纯静态 HTML 作为最终交付形式。

栈选择根据场景判断，不要被旧默认限制：

- `react` + TypeScript — 复杂状态交互、模块化动画编排、设计系统级组件
- `nextjs` + TypeScript — 品牌站、营销站、需要 SSR/SEO 与高表现力互动
- `vue` + TypeScript — 内容结构明确、视觉控制精细、组件编排复杂
- `svelte` + TypeScript — 强交互、轻量交付、强调动画性能与细腻过渡
- `astro` / `vite` + TypeScript — 轻量展示页、快速验证的最低门槛
- Three.js / React Three Fiber / TresJS / p5.js / D3 / GSAP / Motion / OGL / Lenis / SVG animation / Web Components 等按需组合引入
- **动效组件增强层（与 shadcn/ui 同层级，均为 React/Next.js 组件，通过 MCP 叠加使用）**：
  - `MagicUI`：Globe、Bento Grid、Text Animate、BorderBeam、Particles、Marquee、OrbitingCircles
  - `ReactBits`：Dither / Aurora / FlowField 等生成式背景，FadeContent / SplitText / TextPressure 等动效
  - `AnimateUI`：为 Radix 标准组件注入 Framer Motion 物理感（Button、Dialog 等）
  - 三者通过 `shadcn MCP` 或专属 MCP 服务器集成，可与 Canvas/WebGL 层并行叠加
- 其他技术只要更适合目标体验，也可以使用，不必被既有清单限制
- `html-tailwind` **仅在以下极端条件全部成立时允许**：明确的归档强制约束 + 零交互纯展示 + 用户显式要求；其他一切场景禁止

如果 `visual_effects.json` 建议加入 WebGL、Canvas、3D、插图动画、p5.js 或数字艺术动效，Frontend Agent **必须**参考：

- `.agents/skills/frontend/generative-ui/SKILL.md`

不仅借用其方法论，还要主动把 generative-ui 的多种模式（背景层、交互组件、算法艺术）与 inspiration 调研结果组合使用，探索多种生成式和代码艺术方式的叠加，以系统性地提升视觉品质和交互深度。但最终效果必须服务于产品目标，不能脱离叙事变成纯艺术实验。

**页面内部交互完整性要求**：

Frontend Agent 必须确保页面内各区块之间的交互是真实、完整、可用的，而不是只有视觉外壳：

- 导航点击必须真正切换视图或滚动到对应区块
- 筛选器、标签页、下拉菜单必须联动内容区域
- 表单输入必须有验证、状态反馈和提交流程
- 卡片、列表、数据面板之间的联动关系必须实现（点击卡片展开详情、筛选影响列表、图表响应参数变化）
- 动画和转场必须在用户操作时正确触发，而不是只有初始加载动画
- 模态框、抽屉、toast 等叠加层必须有完整的打开/关闭/交互流程
- 如果页面有多视图或多步骤流程，步骤间的状态保持和数据传递必须实现

## 设计资产沉淀

每次完成 Designer 阶段后，审查哪些结论可以泛化为资产：

- 趋势观察放入 `trend-notes/`
- 可复用风格定义放入 `style-recipes/`
- 配色策略放入 `palette-strategies/`
- 动效模式放入 `motion-patterns/`
- 常见同质化风险更新到 `anti-patterns.md`

沉淀原则：

- 提炼为"可复用规则"，不要粘贴当前 case 的最终文案
- 明确适用场景和不适用场景
- 如果只是一次性偶然选择，不要强行入库
- 每条资产都要尽量写成"双索引"形式：既能被 `web-design-pipeline` 的资产目录理解，也能被 `ui-ux-pro-max` 的 CSV 维度检索和吸收
- 把先锋视觉探索转成结构化标签，而不是只写"很酷、很未来、很高级"这类不可复用描述

## 资产互通要求

这是新的硬要求。

`ui-ux-pro-max` 的 CSV 数据库和 `references/uiux-asset-library/` 不是两个平行世界，而是同一套风格知识库的两种载体：

- CSV 更适合检索、召回、推理和批量匹配
- Markdown 资产更适合记录趋势脉络、组合策略、反模式和实现提醒

每次资产沉淀时，尽量补齐这些结构化信息：

- `style_keywords`
- `interaction_level`：`low|medium|high|immersive`
- `visual_primitives`：例如 grid、glow、ink、grain、orb、field、depth、illustration、3d
- `motion_primitives`：例如 parallax、morph、pulse、scroll-sync、physics、noise、camera
- `implementation_hints`：例如 CSS、SVG、Canvas、WebGL、Three.js、p5.js、D3
- `uiuxmax_domains`：映射到 `style`、`color`、`typography`、`ux`、`landing`、`prompt`、`chart`、`stack`
- `suitable_stacks`
- `avoid_patterns`

如果某条资产无法映射回这些字段，说明它仍然过于感性或偶然，需要继续抽象。

## 多样性与去同质化

这是关键要求。

不要机械复用同一套：

- 英雄区结构
- 紫蓝渐变
- 玻璃拟态卡片
- 居中大标题加三栏卡片

每次设计时都要明确写出：

- 本案探索过哪些方向
- 为什么没选其他方向
- 这次如何避免和过往输出变得相似

如果你发现当前产出明显像"套模板"，返回 Designer 阶段重做风格探索。

## 技术栈选择原则

此处为顶层约束，与 Frontend Agent 部分的具体选型指南互为补充。

**硬性要求：所有前端交付必须使用 TypeScript 或前端组件框架。** 禁止以纯静态 HTML 作为最终交付形式。

根据目标选型：

- 复杂状态交互、SaaS、仪表盘、富组件体验：优先 `react` + TypeScript
- 有 SEO/SSR 明确诉求：优先 `nextjs` + TypeScript
- 强交互、丰富动效、追求轻量运行时：优先 `svelte` + TypeScript
- 内容结构明确、视觉控制精细：可用 `vue` + TypeScript
- 轻量展示页、快速验证：可用 `astro` + TypeScript 或 `vite` + TypeScript 最小模板
- 当页面包含较强的叙事动画、3D、生成式视觉层、插图编排或复杂组件协同时，优先多文件组件化组织
- `html-tailwind` **仅在极端条件全部成立时允许**：明确归档强制约束 + 零交互纯展示 + 用户显式要求

为什么禁止纯静态 HTML：

- 静态 HTML 无法支撑页面内部的真实状态管理和组件间通信
- 缺乏类型安全导致交互逻辑脆弱，难以维护和扩展
- 无法实现路由、组件生命周期、响应式数据绑定等现代交互模式
- 与"页面内部交互必须完整实现"的核心要求直接冲突

技术选型要在 `tech_decision.json` 中解释：

- 为什么选这个栈
- 为什么不选其他候选
- 是否需要 WebGL / p5.js / Canvas / Three.js / GSAP
- 多文件源码结构如何组织
- 是否需要插图系统、场景动效编排、3D 层或可交互数据模块
- 生成式视觉层（generative-ui）如何与组件框架集成
- 选型是否受性能、制作周期、归档形式和可维护性共同约束

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

调研结果必须转化为可实现的视觉策略，写入 `visual_effects.json`。

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

每个 case 的 `tech_decision.json` 必须记录选择了哪些组合方式及原因。

### 品质检查清单

- 视觉层是否有层次感（前景/中景/背景分明）
- 动效是否有节奏感（不是所有东西同时动）
- 色彩是否有氛围感（不是只有 UI 色板，还有光影、渐变、材质）
- 交互是否有反馈感（hover/press/focus/scroll 都有对应视觉响应）
- 排版是否有呼吸感（不是信息挤在一起）
- 生成式视觉层是否与内容形成对话（不是独立运行的屏保）
- 整体是否达到"值得截图分享"的品质水准

## 质量门槛

最终交付必须满足：

- 页面可运行（`npm run dev` 或等效命令即可启动）
- 使用 TypeScript 或前端组件框架，非纯静态 HTML
- 结构完整，非半成品
- 有明确设计方向和层级
- **页面内部各区块之间的交互完整实现**，导航、筛选、表单、状态流转、组件联动全部可用
- 有足够支撑设计方向的交互反馈，不满足时要明确解释为什么选择更克制方案
- 响应式可用
- 无明显可访问性硬伤
- 产物归档完整
- 当需求强调生动感或沉浸感时，必须体现至少一种高价值表现层：复杂组件交互、系统化动画、插图叙事、空间层级或生成式视觉
- **视觉品质必须达到"值得作为设计参考"的水准**，不接受"功能正确但视觉平庸"的交付

如果无法全部满足，明确记录在 `self_review.json` 中，不要伪装成完成。

## 输出风格

对用户汇报时，优先给这些信息：

- 本次选择的技术栈（必须是 TypeScript/组件框架）
- 设计方向与差异化点
- 使用了哪些 generative/code art 视觉手法
- 页面内部交互的完整性覆盖情况
- 主要交付物路径
- 若未完成，缺什么、为什么

不要只汇报"已生成完成"，没有验证的完成是谎言。

## 参考文件

按需阅读这些文件：

- `agents/pm-agent.md`
- `agents/designer-agent.md`
- `agents/frontend-agent.md`
- `references/output-structure.md`
- `references/uiux-asset-library/anti-patterns.md`

外部参考 skill：

- `.agents/skills/designer/design-inspiration-ai/SKILL.md`
- `.agents/skills/designer/ui-ux-pro-max/SKILL.md`
- `.agents/skills/frontend/generative-ui/SKILL.md`（含 Mode D：MagicUI / ReactBits / AnimateUI 动效组件库集成指南）

外部组件库与模板参考（Frontend Agent 技术决策时应主动评估）：

- [MagicUI](https://magicui.design/docs/components) — SaaS / landing page 动效组件（Globe、BentoGrid、TextAnimate 等），MCP：`npx @magicuidesign/cli@latest install cursor`
- [ReactBits](https://reactbits.dev/get-started/index) — 生成式背景（Dither/Aurora/FlowField）+ 交互动效，MCP：shadcn MCP + `@react-bits` registry
- [AnimateUI](https://animate-ui.com/docs/components) — 基于 Radix + Framer Motion 的物理感交互组件，MCP：shadcn MCP
- [Vercel Next.js Templates](https://vercel.com/templates/next.js) — 生产级 Next.js 模板参考（AI、SaaS、电商、实时协作）

这些参考用于吸收方法，不用于复制结构。
