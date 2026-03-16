# Output Structure

这个文件定义 `web-design-pipeline` 的目录、命名和归档规范。执行时优先遵守这里，而不是临时自由发挥。

**当前管线版本**：`v4`（2026-03-15 增强版）— 版本历史见 `CHANGELOG.md`

---

## Case 命名

Case 目录名由三个信息段组成：**case 标识 + 管线版本 + 生成日期**。

格式：

```text
{case_id}@v{N}_{YYYYMMDD}
```

其中：
- `{case_id}` = case 标识，见下方两种来源规则
- `@v{N}` = 当前管线版本号（当前为 `@v4`），用于追溯生成时使用的规则版本
- `_{YYYYMMDD}` = 生成日期，用于区分同一 case 的不同时间重跑

### 来自测试集

若输入项包含 `id` 和 `domain`，`case_id` 为：

```text
{NNN}_{domain_slug}
```

完整目录名示例：

```text
001_devtools@v4_20260315
010_meeting-collab@v4_20260315
```

规则：
- `NNN` 为三位补零编号
- `domain_slug` 用英文小写短词，以连字符分隔，不保留括号和空格
- 同一 case 在不同日期重跑，生成新目录，不覆盖旧目录

### 来自单条 query

若没有可用 id，`case_id` 为精简 slug（不含时间戳，时间戳移到 `@v{N}` 之后）：

```text
{slug}@v{N}_{YYYYMMDD}
```

完整目录名示例：

```text
habit-tracker@v4_20260315
saas-landing-ai@v4_20260315
```

规则：
- `slug` 用 2-4 个英文小写词，以连字符分隔，描述 case 主题
- 不再在 slug 前加 `HHMMSS`，时间精度到日期即可；如果同一天同一 slug 跑了多次，在末尾加 `-2`、`-3` 区分

## 目录结构

所有前端交付使用 TypeScript / 组件框架的多文件项目结构。

历史管线版本的输出存放在 `outputs/v{N}-pipeline/` 下（只读存档）；**v4 起采用新命名规范，直接放在 `outputs/` 下**：

```text
outputs/
├── v1-pipeline/          ← v1 历史存档（只读）
├── v2-pipeline/          ← v2 历史存档（只读）
├── v3-pipeline/          ← v3 历史存档（只读）
└── {case_id}@v4_{YYYYMMDD}/   ← v4 及以后的 case，直接在此
    ├── meta.json
    ├── 01_pm/
    │   ├── prd.md
    │   ├── requirement_spec.json
    │   └── ia_structure.json
    ├── 02_designer/
    │   ├── style_research.md
    │   ├── design_brief.md
    │   ├── design_system.json
    │   ├── component_specs.json
    │   └── visual_effects.json
    └── 03_frontend/
        ├── package.json
        ├── tsconfig.json        (使用 TypeScript 时)
        ├── README.md
        ├── tech_decision.json
        ├── self_review.json
        └── src/
            ├── components/
            ├── hooks/           (或 composables/、stores/ 等框架惯用名)
            ├── types/
            ├── styles/
            ├── generative/      (Canvas/WebGL/p5.js/Three.js 模块)
            └── ...
```

说明：

- `03_frontend/` 下必须是一个可通过 `npm install && npm run dev` 启动正常运行的项目
- `src/` 为多文件项目源码目录，组件、hooks、类型、样式分文件组织
- `generative/` 目录（或等效名称）存放 Canvas / WebGL / p5.js / Three.js 等生成式视觉模块，作为独立组件封装，不要内联进页面组件
- `package.json` 是必须存在的项目配置文件；`tsconfig.json` 在使用 TypeScript 时必须存在
- `README.md` 简要说明启动方式和项目结构
- 不再使用单文件 `index.html` 作为默认交付形式
- 框架选型不限于以下示例，Nuxt / SolidStart / 完全自定义结构均可——按所选框架的惯用方式组织即可

### 框架特定结构参考

以下为示例性参考，不是必须套用的模板。Frontend Agent 应按照所选框架的惯用结构自由组织，只要满足下方的**通用必须存在条件**即可。

**通用必须存在的文件（无论选哪个框架）**：

```text
03_frontend/
├── package.json         # 依赖声明，npm install 必须可用
├── tsconfig.json        # TypeScript 配置（使用 TS 时必须）
├── README.md            # 启动方式说明
├── tech_decision.json   # 技术决策记录
└── self_review.json     # 自审结果
```

**核心原则**：

- `src/generative/` 或等效目录：Canvas / WebGL / p5.js / Three.js 等生成式视觉模块应独立封装，不要内联进页面组件
- 状态管理、路由、动画编排模块应独立文件，不要堆在单个文件里
- 选了什么栈就用那个栈的惯用结构——React 项目用 React 的方式，Nuxt 项目用 Nuxt 的方式，不必强行套以下任何一个示例

**示例结构（仅供参考，不是约束）**：

React + TypeScript (Vite)：

```text
03_frontend/
├── package.json / tsconfig.json / vite.config.ts / index.html
└── src/
    ├── main.tsx / App.tsx
    ├── components/ hooks/ types/ styles/ generative/ utils/
```

Vue + TypeScript (Vite)：

```text
03_frontend/
├── package.json / tsconfig.json / vite.config.ts / index.html
└── src/
    ├── main.ts / App.vue
    ├── components/ composables/ types/ styles/ generative/ utils/
```

Svelte + TypeScript (SvelteKit)：

```text
03_frontend/
├── package.json / svelte.config.js / tsconfig.json
└── src/
    ├── routes/
    └── lib/ → components/ stores/ types/ generative/ utils/
```

Astro + TypeScript：

```text
03_frontend/
├── package.json / tsconfig.json / astro.config.mjs
└── src/
    ├── pages/ components/ layouts/ styles/ generative/ types/
```

Nuxt / SolidStart / 其他栈：

```text
03_frontend/
├── package.json / tsconfig.json / [框架配置文件]
└── [按该框架惯用结构自由组织，generative/ 模块单独封装]
```

## `meta.json`

建议字段：

```json
{
  "case_id": "",
  "pipeline_version": "v4",
  "generated_date": "YYYYMMDD",
  "source_type": "query|test_file",
  "source_file": "",
  "input_summary": "",
  "domain": "",
  "selected_stack": "",
  "stack_language": "typescript|javascript",
  "delivery_mode": "multi-file",
  "uses_visual_effects": false,
  "effect_type": "none",
  "generative_modes": [],
  "component_library_used": [],
  "interaction_completeness": "full|partial",
  "created_at": ""
}
```

字段说明：
- `pipeline_version`：生成本 case 时使用的管线版本，与目录名 `@v{N}` 保持一致
- `generated_date`：生成日期 `YYYYMMDD`，与目录名末尾日期保持一致
- `component_library_used`：记录本 case 实际引入的动效组件库，如 `["magicui", "reactbits"]`

## 文件写作约束

- JSON 尽量结构化，避免混入大段散文
- Markdown 面向下游 agent，优先清晰可执行
- 所有路径使用相对 case 根目录的清晰语义
- TypeScript 文件使用 `.ts` / `.tsx` / `.vue` / `.svelte` 扩展名

## 资产沉淀

除 case 目录外，还要维护：

```text
references/uiux-asset-library/
├── trend-notes/
├── style-recipes/
├── palette-strategies/
├── motion-patterns/
├── generative-recipes/
└── anti-patterns.md
```

用于保存可复用结论，而不是某个 case 的最终成品。

`generative-recipes/` 是新增目录，专门沉淀 generative 视觉和代码艺术的组合策略。

## 不要做的事

- 不要把所有产物混在根目录
- 不要只保留最终代码，丢掉中间过程
- 不要给文件起模糊名字如 `result.json`、`final.md`、`new2.html`
- 不要用单文件 `index.html` 作为最终交付（除非有极端特殊的归档约束）
- 不要省略 `package.json` 和 `tsconfig.json`
