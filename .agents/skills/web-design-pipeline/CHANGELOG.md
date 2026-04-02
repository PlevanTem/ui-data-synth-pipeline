# Web Design Pipeline — CHANGELOG

每次管线规则发生重要更新时在此记录。版本号格式：`vN`，只升整数，小修补不升版本。

---

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
