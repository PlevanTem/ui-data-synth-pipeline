# Output Structure

这个文件定义 `web-design-pipeline` 的目录、命名和归档规范。执行时优先遵守这里，而不是临时自由发挥。

## Case 命名

### 来自测试集

若输入项包含 `id` 和 `domain`，命名为：

```text
{NNN}_{domain_slug}
```

示例：

```text
001_devtools
005_saas
```

规则：

- `NNN` 为三位补零编号
- `domain_slug` 用英文小写短词，不保留括号和空格

### 来自单条 query

若没有可用 id，命名为：

```text
YYYYMMDD_HHMMSS_{slug}
```

示例：

```text
20260312_143022_habit-tracker
```

## 目录结构

```text
outputs/
└── <case-id>/
    ├── meta.json
    ├── 01_pm/
    │   ├── prd.md
    │   ├── requirement_breakdown.json
    │   └── ia_structure.json
    ├── 02_designer/
    │   ├── style_research.md
    │   ├── design_brief.md
    │   ├── design_system.json
    │   ├── component_specs.json
    │   └── visual_effects.json
    └── 03_frontend/
        ├── index.html
        ├── src/
        ├── tech_decision.json
        └── self_review.json
```

说明：

- `index.html` 用于单文件交付
- `src/` 用于 React / Next.js / Vue / Svelte 多文件交付
- 如果某个栈不需要 `index.html`，可留空不创建，但必须有明确入口文件

## `meta.json`

建议字段：

```json
{
  "case_id": "",
  "source_type": "query|test_file",
  "source_file": "",
  "input_summary": "",
  "domain": "",
  "selected_stack": "",
  "uses_visual_effects": false,
  "effect_type": "none",
  "created_at": "",
  "pipeline_version": "v1"
}
```

## 文件写作约束

- JSON 尽量结构化，避免混入大段散文
- Markdown 面向下游 agent，优先清晰可执行
- 所有路径使用相对 case 根目录的清晰语义

## 资产沉淀

除 case 目录外，还要维护：

```text
references/uiux-asset-library/
```

用于保存可复用结论，而不是某个 case 的最终成品。

## 不要做的事

- 不要把所有产物混在根目录
- 不要只保留最终代码，丢掉中间过程
- 不要给文件起模糊名字如 `result.json`、`final.md`、`new2.html`
