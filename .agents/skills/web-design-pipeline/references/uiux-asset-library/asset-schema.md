# Asset Schema

这份文件定义 `uiux-asset-library` 的统一资产模型。

目标不是把所有设计知识压成僵硬表格，而是给 Markdown 资产提供稳定的机器可读外壳，方便未来：

- 建索引
- 做筛选
- 回写到 `ui-ux-pro-max/data/`
- 同步到数据库或 CMS

实际索引生成统一使用：

- `scripts/generate_catalog.py`

## 必填字段

每条资产都必须在文件顶部使用 YAML frontmatter，并至少包含：

- `asset_id`
- `asset_type`
- `title`
- `summary`
- `domains`
- `style_keywords`
- `interaction_level`
- `uiuxmax_domains`
- `suitable_stacks`

## 推荐字段

如适用，补齐：

- `visual_primitives`
- `motion_primitives`
- `implementation_hints`
- `avoid_patterns`
- `component_primitives`
- `motion_stack`
- `data_stack`
- `rendering_stack`

## 字段定义

### `asset_id`

- 类型：string
- 规则：全库唯一
- 建议格式：`<type>-<slug>`
- 示例：`style-devtools-precision-console`

### `asset_type`

- 类型：enum
- 可选值：
  - `trend-note`
  - `style-recipe`
  - `palette-strategy`
  - `motion-pattern`
  - `generative-recipe`
  - `anti-patterns`

### `title`

- 类型：string
- 规则：给人读的标题

### `summary`

- 类型：string
- 规则：1 句话概括资产的核心价值

### `domains`

- 类型：string[]
- 作用：描述适用业务领域或产品语境
- 示例：`["travel", "navigation", "mobility"]`

### `style_keywords`

- 类型：string[]
- 作用：描述视觉/体验关键词

### `interaction_level`

- 类型：enum
- 可选值：`low` `medium` `high` `immersive`

### `visual_primitives`

- 类型：string[]
- 作用：描述关键视觉构件

### `motion_primitives`

- 类型：string[]
- 作用：描述关键动态语言

### `implementation_hints`

- 类型：string[]
- 作用：描述实现关键词，不写长句

### `uiuxmax_domains`

- 类型：string[]
- 推荐值：`product` `style` `typography` `color` `landing` `chart` `ux` `web` `stack`

### `suitable_stacks`

- 类型：string[]
- 推荐值：`react` `nextjs` `vue` `svelte` `astro` `shadcn`

### `avoid_patterns`

- 类型：string[]
- 作用：描述最容易落入的反模式

### `component_primitives`

- 类型：string[]
- 作用：记录适合承载该资产的组件原语

### `motion_stack`

- 类型：string[]
- 作用：记录推荐动效栈

### `data_stack`

- 类型：string[]
- 作用：记录推荐状态、表单、数据交互栈

### `rendering_stack`

- 类型：string[]
- 作用：记录推荐渲染、图表、3D 栈

## `catalog.json` 条目要求

`catalog.json` 中每条记录应至少镜像这些字段：

- `asset_id`
- `asset_type`
- `title`
- `summary`
- `path`
- `domains`
- `style_keywords`
- `interaction_level`
- `uiuxmax_domains`
- `suitable_stacks`

可选补充：

- `visual_primitives`
- `motion_primitives`
- `implementation_hints`
- `avoid_patterns`

## 正文要求

frontmatter 只负责结构化元信息，正文仍应保留：

- 适用场景
- 不适用场景
- 风险点
- 推荐做法或实现边界

不要把所有知识都塞进 metadata。
