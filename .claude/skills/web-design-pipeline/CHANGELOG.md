# Web Design Pipeline — CHANGELOG

每次管线规则发生重要更新时在此记录。版本号格式：`vN`，只升整数，小修补不升版本。

---
## v8.1 补丁（2026-05-15）

**补丁代号**：本地化脚本 + 依赖预热 + favicon bug 修复

- 把 `anthropic-skills:web-artifacts-builder` 的 `init-artifact.sh` / `bundle-artifact.sh` / `shadcn-components.tar.gz` 拷贝到项目本地 `.claude/skills/web-design-pipeline/scripts/`，避免依赖外部 skill 路径解析；SKILL / frontend-agent / engineering-guardrails 中所有 `${SKILL_PATH}` 引用替换为项目本地路径
- 修复 `init-artifact.sh` 中 favicon 清理 sed 只匹配旧版 `vite.svg` 的 bug，新版 Vite 模板的 `/favicon.svg` 漏掉会导致 parcel build 失败；改为匹配任意 `<link rel="icon"`
- 一次性预跑 init + bundle 完整流程，pnpm 全局 store（D:\.pnpm-store\v3，约 322MB）已预热 React 18 + Vite + Tailwind 3.4 + shadcn 全套 + parcel 2.16 + html-inline 等所有依赖；后续 case 第一次 `init-artifact.sh` 会从本地 store 直接 hardlink，不再走网络
- engineering-guardrails.md §6 新增 favicon 与 postcss 两条 parcel 报错速查项

---
## v8（2026-05-14）

**版本代号**：React + shadcn + Bundle

### 核心变更

- **前端栈从「单文件 HTML + Tailwind CDN + 原生 JS」迁移到「React 18 + TypeScript + Vite + Tailwind 3.4 + shadcn/ui，parcel + html-inline 打包为单文件 `bundle.html`」**
- 引入 `anthropic-skills:web-artifacts-builder` 的两个脚本作为编排核心：`init-artifact.sh`（脚手架 + 40+ shadcn 组件 + 主题配置）与 `bundle-artifact.sh`（parcel build + html-inline 内联）
- Frontend 唯一交付物：`bundle.html`（浏览器直接双击运行，自包含全部依赖，除 Google Fonts 字体外）
- 临时工程目录 `03_frontend/_build/` 在 bundle 成功后必须由 Frontend Agent 删除；失败时保留供排错
- 视觉/动效库（three / p5 / gsap / d3 / lottie-react / lenis / chart.js）通过 `pnpm add` 安装为 npm 依赖，**不再走 CDN**

### Designer Agent 改动

- 输出的 Tailwind 配置章节从单段 `tailwind.config = {...}` 字面量改为**双段**：
  - **Block A**：`src/index.css` 的 shadcn CSS 变量（裸 HSL 三元，`--background` / `--primary` / `--ring` / `--radius` 等全套 shadcn token，含 `:root` 与 `.dark`）
  - **Block B**：`tailwind.config.js` 的 `theme.extend`（用 `hsl(var(--xxx))` 引用 Block A 变量；案例专属品牌色 / `fontFamily` / `boxShadow` 直接写）
- STEP 3 设计系统收敛增加硬约束：色彩 token 必须能映射为 HSL 三元值（机器消费），圆角 token 必须带单位
- Component Stylings 章节每个组件可选 `shadcn Mapping`，标注复用哪个 shadcn 组件或显式标注「自写」
- 成功标准更新：Frontend 直接复制 Block A/B 到对应文件，`pnpm add` 安装指定视觉库

### Frontend Agent 改动（完全重写）

8 步标准流程：
1. 环境检查（Node 18+），定位 `${SKILL_PATH}`
2. `bash ${SKILL_PATH}/scripts/init-artifact.sh _build` 脚手架
3. 注入 Block A → `src/index.css`，合并 Block B → `tailwind.config.js`，引入字体 `<link>`，`pnpm add` 视觉库
4. 实现页面：`App.tsx` + `src/components/`，按 Component Stylings 决定 shadcn 复用 / 自写
5. （可选）`pnpm dev` 本地跑通
6. `bash ${SKILL_PATH}/scripts/bundle-artifact.sh` 打包
7. `mv _build/bundle.html ../bundle.html && rm -rf _build`
8. 浏览器验收

禁止事项新增：Tailwind CDN、`tailwind.config = {}` 字面量、保留 `_build/` 在归档中、`// @ts-ignore`、默认 Inter 字体。

### engineering-guardrails.md 完全重写

旧版 9 节（CDN 配置顺序、`theme()` helper 限制、p5 实例模式、CDN 加载顺序等）全部作废。新版 10 节：

1. 环境前置（Node 18+ / pnpm / bash）
2. 初始化 + 打包标准动作
3. shadcn 主题系统（Block A/B 配合 + 裸 HSL 三元约束）
4. 路径别名 `@/`（parcel-resolver-tspaths）
5. shadcn 组件复用清单（常用 8-10 个）+ 何时不该用
6. React + 第三方视觉库标准挂载模式（`useEffect` + 清理函数）
7. parcel build 常见报错速查
8. bundle.html 体积控制（< 5MB）
9. 避免 AI slop（过度居中 / 紫蓝渐变 / 统一圆角 / 默认 Inter）
10. 禁止事项 + bundle 后自检清单

### output-structure.md 更新

新目录结构：
```
outputs/{case_id}@v8_{YYYYMMDD}/
├── meta.json
├── 01_pm/prdSpec.json
├── 02_designer/design_brief.md
└── 03_frontend/
    └── bundle.html         ← 唯一最终交付
```

`_build/` 仅在 Frontend Agent 执行期间存在，bundle 成功后必须删除。

### SKILL.md 顶层协议同步

- 核心原则：栈描述全替换
- 交付目标：Frontend 产物从 `index.html` 改为 `bundle.html`
- 技术栈选择原则：CDN 引入清单改为 `pnpm add` 包清单
- 总流程：第 4 步补充 Frontend Agent 自行 init/edit/bundle/cleanup；明确 SKILL 主流程必须传入 `${SKILL_PATH}`
- 参考文件：新增 web-artifacts-builder skill 的外部脚本依赖说明

### 保持不变

- pm-agent.md / prdSpec.json schema（11 字段）完全沿用
- design-guardrails.md（17 大类视觉/UX 红线 + 21 项自检清单）完全沿用
- 命名格式 `{case_id}@v{N}_{YYYYMMDD}` 沿用，N 升至 v8

### 版本对应目录

```
outputs/
├── v1-pipeline/   ← v1 历史存档
├── v2-pipeline/   ← v2 历史存档
├── v3-pipeline/   ← v3 历史存档
├── v4-pipeline/   ← v4 历史存档
├── {case}@v5_{date}/  ← v5
├── {case}@v6_{date}/  ← v6
├── {case}@v7_{date}/  ← v7
└── {case}@v8_{date}/  ← v8 起采用 bundle.html 单文件交付
```

---
## v7（2026-04-28）

**版本代号**：PM 产物 JSON 化

### 核心变更

- **PM Agent 产物从 `prd.md`（Markdown）改为 `prdSpec.json`（严格 Schema JSON）**
- 固定 11 个字段：`user_intent` / `target_user` / `usage_context` / `platform` / `page_type` / `primary_task` / `secondary_tasks` / `functional_requirements` / `visual_requirements` / `interaction_requirements` / `implicit_requirements`
- 字段名、键序固定，下游 Agent 按键名直接消费，不允许新增/重命名/省略
- 取消原 M/S/X 功能契约表格，统一以 `functional_requirements` 数组承载（每条可验证）
- 取消原内容意图地图（IA），由 Designer Agent 在风格探索阶段基于 `primary_task` + `secondary_tasks` 自行设计
- 增加“design-guardrails.md”对设计进行质控

### Designer Agent 改动

- STEP 1 字段映射表更新：从原 `情绪目标 / 信息密度 / 交互深度` 改为按 prdSpec 的 11 个字段映射设计语言
- 设计问题陈述模板改为引用 `target_user` / `usage_context` / `primary_task` / `visual_requirements` / `interaction_requirements`

### Frontend Agent 改动

- 验收红线从"`prd.md` 中每个 M 类契约"改为"`prdSpec.json` 中每条 `functional_requirements`"
- `implicit_requirements` 中的 loading / empty / error / responsive / a11y 必须落到代码

---
## v6（2026-04-27）
**版本代号**：rubrics要求加入

### 核心变更

在design agent要求中按设计美学规则进行规范限制


## v5（2026-04-02）

**版本代号**：极简归档 × 单文件前端

### 核心变更

本版本核心目标：**每个 Agent 只产出一份文件，前端交付为浏览器可直接打开的单文件 HTML**，彻底去掉构建工具和多文件 JSON 中间产物。

### 技术栈变更

- **前端交付从 TypeScript + 组件框架改为 HTML + Tailwind CDN + 原生 JS**
- Tailwind 通过 `<script src="https://cdn.tailwindcss.com"></script>` 引入，设计 Token 通过 `tailwind.config = { theme: { extend: {...} } }` 在 `<script>` 内配置
- 不再依赖 `@theme` 指令（V4 CLI 专属语法），不再依赖 `tailwind.config.js` 文件
- 第三方视觉库（p5.js、Three.js、GSAP、D3 等）按需通过 CDN 引入
- 删除 MagicUI / ReactBits / AnimateUI（均为 React 组件库，与新栈不兼容）
- `index.html` 浏览器直接双击打开运行，无需 `npm install`

### PM Agent 重构

- **产物从 3 份文件精简为 1 份**：`prd.md` + `requirement_spec.json` + `ia_structure.json` → **仅 `prd.md`**
- `prd.md` 整合全部内容：需求推理过程 + 功能契约 M/S/X 表格 + 内容意图地图（IA）
- 功能契约改为 Markdown 表格，人类可读性优先
- 下游 Designer 和 Frontend 均直接读 `prd.md`

### Designer Agent 重构

- **产物从 5 份文件精简为 1 份**：`style_research.md` + `design_system.json` + `component_specs.json` + `visual_effects.json` + `design_brief.md` → **仅 `design_brief.md`**
- `design_brief.md` 整合全部内容：风格方向 + 设计系统 Token（含具体 hex 值）+ 组件规范 + 视觉特效方案 + 完整 Tailwind 配置（可直接复制）
- 删除 `ui-ux-pro-max` Python 脚本调用（`search.py`），保留 WebSearch 趋势调研
- 视觉特效方案聚焦 CDN 可用的生成式视觉方式（Canvas / p5.js / Three.js / GSAP）

### Frontend Agent 重构

- **产物从 3 份文件精简为 2 份**：删除 `tech_decision.json`，保留 **`index.html`** + **`self_review.json`**
- 删除多文件项目结构要求（`package.json` / `tsconfig.json` / `src/` 目录）
- `self_review.json` 结构精简：新增 `cdn_libs_used`、`browser_runnable`，删除 `typescript_type_imports`、`delivery_mode: multi-file` 等 TS 相关字段
- 生成式视觉层通过 CDN 引入，使用实例模式（避免全局命名空间污染）

### output-structure.md 更新

新目录结构：

```
outputs/{case_id}@v5_{YYYYMMDD}/
├── meta.json
├── 01_pm/
│   └── prd.md
├── 02_designer/
│   └── design_brief.md
└── 03_frontend/
    ├── index.html
    └── self_review.json
```

- `meta.json` 中 `delivery_mode` 改为 `single-file`，`stack` 改为 `html-tailwind-js`

### engineering-guardrails.md 全面重写

- 删除 Vite / TypeScript / HMR 相关防坑
- 新增：Tailwind CDN 配置顺序、`tailwind.config` JS 对象规范、JS 执行时机、Canvas 初始化、p5.js 实例模式、原生 JS 状态管理、Intersection Observer 滚动动效
- 附常用 CDN 地址速查表（Tailwind / p5.js / Three.js / GSAP / D3 / Chart.js / Anime.js / Alpine.js）

### 版本对应目录

```
outputs/
├── v1-pipeline/   ← v1 历史存档
├── v2-pipeline/   ← v2 历史存档
├── v3-pipeline/   ← v3 历史存档
├── v4-pipeline/   ← v4 历史存档
└── {case}@v5_{date}/   ← v5 起采用新命名规范
```

---

## v5 补丁（2026-04-08）

**补丁代号**：美学导向强化 + 资产库配方扩充

### PM Agent（pm-agent.md）

- 思维链第一步「用户与场景」补充 **业务场景**、**页面类型**，与「谁在用、痛点、结果」并列，便于落地到具体页面形态。

### Designer Agent（designer-agent.md）

- 新增 **「美学设计」** 前置段落：明确强风格取向（极简/极繁、复古未来、编辑风等）、主色与强调色、差异化记忆点；鼓励情境化的非常规选择，避免多代输出趋同（如默认同一款展示字体）。
- STEP 1 措辞微调：「翻译设计语言」→「翻译成设计语言」。
- STEP 3（设计系统 Token）后补充 **版式与视觉纪律**：层次与分组、8pt 栅格、全局单一强调色策略、圆角一致性与连续曲率（Squircle 思路）、Major Third（1.25）字号阶梯与正文中性色等。
- 文末补充：**实现复杂度需与美学愿景匹配**（极繁需足够动效与层次；极简需克制、精度与留白）。

### Frontend Agent（frontend-agent.md）

- 验收清单补充：**Canvas** 等核心可视化区块需随 DOM / 内容比例自适应。

### uiux-asset-library

- 新增生成式配方：`generative-recipes/canvas-interior-atmosphere-time-driven.md`
- 新增风格配方：`style-recipes/dark-neumorphism-tech.md`、`soft-ops-canvas-devtools.md`、`temporal-architecture-luxury-property.md`

---

## v4 补丁（2026-03-15）

**补丁代号**：PM 重构 + 产品规格强化 + 表现力导向调整

本次为 v4 架构补丁，不升版本号，但涉及多个文件的系统性改动。

### PM Agent 重构（pm-agent.md）

**核心变更：从"输出文档"到"思维链驱动的产品规格生成"**

- **引入四步思维链工作流（STEP 1-4）**，取代原来的顺序输出模式：
  - STEP 1：需求压缩 + 思维链推导（用户场景分析 → 核心问题定义 → 实体/功能/数据交互/功能架构推导 → 非功能需求）
  - STEP 2：执行契约定义（取代 MoSCoW 标签）
  - STEP 3：内容意图地图（信息架构）
  - STEP 4：生成 prd.md（推理记录）

- **引入显性功能 + 隐性功能双轨推导**：隐性功能（加载态、空状态、错误恢复、动画编排、响应式、数据持久化）与显性功能同等地位，必须一起进入执行契约

- **`requirement_breakdown.json` 废弃**，新增 `requirement_spec.json`：
  - 结构更完整，含 `entities`（实体清单）、`functional_architecture`（功能模块架构）、`data_interactions`（数据交互清单）
  - `design_intent` 字段供 Designer Agent 直接读取，消除设计意图传递的歧义
  - `execution_contracts` 替代 MoSCoW，每个 M 类契约含 `acceptance_criteria` + `fail_condition` + `expression_goal`，S 类含 `ideal_form` + `acceptable_fallback`

- **MoSCoW 框架废弃，改为执行契约模型（M/S/X）**：
  - M 类（Must Deliver）：不做就验收失败，含具体可验证的验收条件和表现力目标
  - S 类（Should Deliver）：有弹性的实现范围，不再有"最低形态防止过度实现"的约束，改为追求 `ideal_form`，仅在技术受限时降级至 `acceptable_fallback`
  - X 类（Excluded）：明确排除，排除理由必须是"与产品目标无关"，不能是"实现复杂"
  - **M 类数量上限规则删除**：本管线追求完整实现，不人为压缩 M 类数量

- **`ia_structure.json` 职责精简**：只管"有什么、为什么有、优先级多高"，不再包含界面组件或布局建议
  - 新增 `designer_latitude` 字段：`structure-fixed` / `content-fixed-layout-free` / `fully-open`，PM 显式授权 Designer 的创作自由度
  - 新增 `linked_contracts` 字段，将区块与执行契约 id 关联

- **`prd.md` 定位变更**：从"下游 agent 主要输入"降级为"推理记录 + 人类可读摘要"，下游 agent 改为读 `requirement_spec.json`

- **判断规则更新**：删除"视觉效果不能喧宾夺主"的限制措辞，改为"视觉表现力始终是正向目标"

### Designer Agent 更新（designer-agent.md）

- **新增 PM→设计语言翻译层**（原"设计意图提炼"步骤扩展为四个子步骤）：
  - 1.1：从 `requirement_spec.json` 的 `design_intent` 字段逐字段翻译为色彩温度、节奏密度、视觉重量等设计判断
  - 1.2：从 `execution_contracts` 推导每个 M/S 功能的视觉优先级
  - 1.3：从 `ia_structure.json` 的 `designer_latitude` 明确创作权限边界
  - 1.4：输出综合设计问题陈述

- **输入文件调整**：主要输入改为 `requirement_spec.json`，`prd.md` 降为可选参考

- **资产库态度重写**：从"避免复刻"改为"资产库是经验索引，不是创作边界"；明确禁止"因为资产库里有这个方向所以选它"的推理逻辑

- **视觉特效判断章节重写**：
  - 定位从"决定是否推荐特效"改为"判断哪些特效层组合能最大化视觉体验目标"
  - 技术手法列表从 8 条扩展，新增：GLSL shader、reaction-diffusion、L-system、cellular-automata、spring-physics、SDF、Spline、scroll-driven animations、滚动叙事等
  - `type` / `algorithm_family` 字段从硬枚举改为自由描述，不再锁死技术选择
  - 删除"只在以下情况建议强特效"的前置限制条件
  - 明确：`generative_combination` 对任何案例均不允许留空或写 `"none"`

- **`generative_combination` schema 扩展**：
  - 新增 `implementation_notes` 字段（直接供 Frontend 参考的实现要点）
  - 新增 `interaction_with_primary` 字段（各层协同关系）
  - `component_library_selections` 旧结构废弃，整合进 `component_library_layer`，要求明确 `customization_intent`
  - 新增 `layering_strategy` 字段（各层 z-index / opacity / blend-mode 协同策略）

- **`visual_effects.json` schema 重构**：
  - `effect_type` 枚举字段废弃，改为 `effect_summary`（有观点的策略陈述）+ `effect_layers` 数组（每层自由描述）
  - 新增 `accessibility_notes` 字段

### Frontend Agent 更新（frontend-agent.md）

- **输入文件调整**：主要输入改为 `requirement_spec.json`，增加"实现前必须做的契约对齐"步骤（读取所有 M 类 `fail_condition`，确认不会触发）

- **`self_review.json` 新增 `contract_compliance` 字段**：逐条对照 `must_deliver` 的每个契约 id，记录：
  - `acceptance_criteria`（原始验收条件）
  - `expression_goal`（原始表现力目标）
  - `status`（met / partial / not_met）
  - `evidence`（实现证据）
  - `expression_achieved`（实际达到的表现力水准）
  - `fail_condition_triggered`（是否触发失败条件）

### SKILL.md / output-structure.md 同步

- PM Agent 产物列表：`requirement_breakdown.json` → `requirement_spec.json`
- Designer / Frontend Agent 调用协议中的输入字段更新，精确引用主要输入文件
- `output-structure.md` 目录树中 `requirement_breakdown.json` 更新为 `requirement_spec.json`

---

## v3 → v4（2026-03-15）

**版本代号**：增强版（Animation & MCP Era）

### 新增

- **动效组件库层（Mode D）**：将 MagicUI / ReactBits / AnimateUI 正式纳入 generative-ui skill，作为与 shadcn/ui 同层级的 React/Next.js 组件增强层
  - MagicUI：Globe、BentoGrid、TextAnimate 系列、BorderBeam、Particles、Marquee、OrbitingCircles 等
  - ReactBits：Dither / Aurora / FlowField 生成式背景；FadeContent / SplitText / TextPressure 文字动效
  - AnimateUI：基于 Radix + Framer Motion 的物理感交互组件（hoverScale / tapScale）
- **MCP 集成指引**：三个库均支持 Cursor MCP，可通过自然语言 prompt 安装组件；在 frontend-agent.md 和 generative-ui SKILL.md 中补充了完整的 MCP 安装命令和使用范例
- **资产库新增 3 个文件**：
  - `motion-patterns/animated-text-primitives.md`：20+ 文字动效原语分类速查
  - `trend-notes/component-library-mcp-era-2026.md`：MCP 驱动组件生成趋势分析
  - `stacks/animated-components.csv`：43 条 MagicUI/ReactBits/AnimateUI 规则
- **视觉特效选型原则更新**：按目标体验匹配选型，不再以成本梯度排序（本项目视觉品质优先）
- **designer-agent.md 更新**：`visual_effects.json` 新增 `component-library` effect_type 和 `component_library_selections` 字段
- **anti-patterns.md 更新**：新增 MagicUI 默认样式滥用、动效堆叠、文字动效过度使用三条反模式

### 修改

- **output-structure.md 框架结构参考**：从四个固定目录树改为"通用必须存在文件 + 各框架示例仅供参考"，不再限制框架选型自由度
- **output-structure.md 命名规范**：case 目录名引入管线版本号和生成日期，格式变更为 `{NNN}_{domain_slug}@v{N}_{YYYYMMDD}`
- **output-structure.md meta.json**：`stack_language` 字段从硬编码 `"typescript"` 改为 `"typescript|javascript"`
- **ui-ux-pro-max/SKILL.md**：Available Stacks 和 Stack 表格将动效组件层归入 shadcn 行注释，不单独成栈；`core.py` 注册 `animated-components` CSV 使 `--stack animated-components` 可用
- **animated-components 定位澄清**：明确这三个库不是独立框架，而是 React/Next.js 项目的组件层，与 shadcn/ui 同层级

### 版本对应目录

```
outputs/
├── v1-pipeline/   ← v1 生成物（历史存档）
├── v2-pipeline/   ← v2 生成物（历史存档）
├── v3-pipeline/   ← v3 生成物（历史存档）
└── {case}@v4_{date}/   ← v4 起采用新命名规范
```

---

## v2 → v3

**主要变更**：引入 generative-ui skill，强制多文件 TypeScript 交付，禁止纯静态 HTML，视觉品质纳入质量门槛，页面内部交互完整性成为硬性要求。

---

## v1 → v2

**主要变更**：建立三阶段流水线（PM → Designer → Frontend），引入 uiux-asset-library 资产沉淀机制，Designer Agent 独立化。

---

## v1

**初始版本**：基本流水线框架，单阶段生成，测试集批量跑通。
