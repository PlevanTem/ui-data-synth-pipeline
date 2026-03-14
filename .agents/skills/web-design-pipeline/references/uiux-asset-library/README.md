# UI/UX Asset Library

这里不是案例成品仓库，而是一套面向未来知识库化的 UI/UX 资产层。

## 目标

把每次 case 中可泛化的 UI/UX 结论沉淀下来，减少重复思考，同时避免输出越来越像同一套模板。

这套资产库现在不仅服务 `web-design-pipeline`，也要和 `ui-ux-pro-max` 的 CSV 检索体系互通。目标不是堆参考，而是形成一套可检索、可复用、可扩展的风格知识库。

## 与 `data/` 的关系

这个资产库不是和 `ui-ux-pro-max/data/` 平行竞争的第二套系统，而是同一知识库的“高阶叙事层”。

分工建议：

- `ui-ux-pro-max/data/`
  - 结构化、可检索、低歧义
  - 适合颜色、排版、产品类型、图表、栈提示、可访问性规则

- `references/uiux-asset-library/`
  - 上下文丰富、可解释、可承载取舍和风险
  - 适合趋势脉络、风格 recipe、动效语言、generative 组合策略、反模式

目标不是合成一个巨大的混合库，而是形成：

- **data 负责召回**
- **references 负责判断**

每次沉淀后，都尽量把能结构化的部分映射回 `data` 可识别的标签。

## 当前结构

```text
uiux-asset-library/
├── catalog.json
├── asset-schema.md
├── scripts/
│   └── generate_catalog.py
│   └── generate_uiuxmax_sync_candidates.py
├── templates/
│   └── asset-template.md
├── trend-notes/
├── style-recipes/
├── palette-strategies/
├── motion-patterns/
├── generative-recipes/
└── anti-patterns.md
```

## 根文件职责

- `catalog.json`
  - 资产库机器索引
  - 供脚本、后续建库、筛选和统计使用
- `asset-schema.md`
  - 统一字段说明和录入约束
- `scripts/generate_catalog.py`
  - 从 Markdown frontmatter 自动生成或校验 `catalog.json`
- `scripts/generate_uiuxmax_sync_candidates.py`
  - 从资产库索引生成可审阅的 UI/UX Pro Max CSV 反哺候选
- `templates/asset-template.md`
  - 新增资产时的标准模板

Markdown 文件本身负责承载可读内容，`catalog.json` 负责承载统一入口和目录级检索。

## 子目录说明

- `trend-notes/`
  - 记录某类领域、情绪或交互趋势
- `style-recipes/`
  - 记录可复用风格配方
- `palette-strategies/`
  - 记录配色体系和适用语境
- `motion-patterns/`
  - 记录动效模式、适用场景和性能风险
- `generative-recipes/`
  - 记录生成式视觉与代码艺术的组合方式、触发条件和降级策略
- `anti-patterns.md`
  - 记录常见同质化问题和设计误区

## 沉淀规则

- 只沉淀“可复用规律”，不直接复制某个 case 的最终文案
- 每条资产都写清楚：
  - 适用场景
  - 不适用场景
  - 风险与反模式
- 如果某条经验还不足以泛化，不要入库
- 每条资产必须带统一 frontmatter，便于和 `ui-ux-pro-max` 的 CSV 维度互相映射
- 每新增或修改一条资产后，运行脚本更新 `catalog.json`

## 双索引原则

同一条资产最好同时满足两种阅读方式：

- 作为 Markdown，被设计师快速理解其脉络、场景和风险
- 作为 frontmatter + `catalog.json`，被检索系统映射到 style/color/typography/ux/prompt/stack 等维度

建议每条资产至少补齐以下元信息字段：

- `asset_id`
- `asset_type`
- `title`
- `summary`
- `domains`
- `style_keywords`
- `interaction_level`: `low|medium|high|immersive`
- `visual_primitives`
- `motion_primitives`
- `implementation_hints`
- `uiuxmax_domains`
- `suitable_stacks`
- `avoid_patterns`
- `component_primitives`
- `motion_stack`
- `data_stack`
- `rendering_stack`

如果一条资产很难被抽象成这些字段，说明它还偏案例描述，不够稳定，暂时不应视为成熟资产。

## 资产类型补充说明

- `trend-notes/`
  - 除趋势描述外，要尽量提炼“正在上升的视觉信号”和“可迁移到网页中的实现方向”
- `style-recipes/`
  - 不只写静态版式，还应包含交互语言、动画编排、插图/3D 使用边界
- `palette-strategies/`
  - 颜色不只描述审美，也要描述可读性、层级对比和动态媒介中的使用限制
- `motion-patterns/`
  - 必须说明叙事作用、触发条件、性能风险和降级方案
- `generative-recipes/`
  - 除了视觉组合本身，还要说明与状态层、内容层、动效层的耦合方式

## 元数据格式

统一使用 YAML frontmatter，而不是自由格式的 metadata 段落：

```md
---
asset_id: style-interactive-frontend-system-baseline
asset_type: style-recipe
title: Interactive Frontend System Baseline
summary: 面向高品质互动产品界面的当前技术与体验基线。
domains:
  - saas
  - dashboard
  - premium-webapp
style_keywords:
  - interactive
  - premium
  - immersive
interaction_level: high
visual_primitives:
  - depth
  - glow
motion_primitives:
  - spring
  - reveal
implementation_hints:
  - nextjs15
  - react19
uiuxmax_domains:
  - style
  - ux
  - stack
suitable_stacks:
  - nextjs
  - react
avoid_patterns:
  - decorative-3d-only
component_primitives:
  - shadcn-ui
motion_stack:
  - motion
  - gsap
data_stack:
  - tanstack-query
  - zustand
rendering_stack:
  - d3
  - r3f
---
```

## 命名建议

使用短英文 slug：

- `b2b-dashboard-density.md`
- `warm-editorial-commerce.md`
- `soft-tech-motion-patterns.md`

`asset_id` 建议与 slug 对齐，但加上类型前缀，例如：

- `style-devtools-precision-console`
- `motion-ar-wayfinding-pulses`
- `trend-ios26-liquid-glass-web-adaptation`
- `palette-ice-blue-amber-ecommerce`

## 当前交互型前端基线

对于高品质、互动丰富、沉浸式前端界面，资产库现在应默认认识这一组当前主流能力：

- `Next.js 15` / `React 19`
- `Tailwind CSS 4`
- `shadcn/ui` + `Radix UI`，必要时 `React Aria`
- `motion` (`motion/react`) 作为核心组件动效层
- `GSAP` 作为高价值滚动与时间线层
- `TanStack Query` + `Zustand`
- `React Hook Form` + `Zod`
- `Sonner`
- `Recharts` / `D3`
- `Three.js` / `@react-three/fiber` / `Spline`
- `pnpm`

这些不意味着每个项目都要全上，而是意味着：

- 资产在写 `suitable_stacks`、`implementation_hints`、`motion_stack`、`rendering_stack` 时，应知道这些已经是当前可用且主流的能力层

## 维护要求

- 不要只新增 Markdown，不更新 `catalog.json`
- 不要让同一条资产在标题、slug、`asset_id` 上各写一套名字
- 不要在 frontmatter 里塞长段说明，把解释留在正文
- 不要把一次性 case 结论直接当成熟资产入库

## 索引生成

在资产有变更后运行：

```bash
python3 .agents/skills/web-design-pipeline/references/uiux-asset-library/scripts/generate_catalog.py
```

## 反哺 CSV 候选生成

如果你要把稳定资产反哺回 `ui-ux-pro-max/data/`，先生成候选而不是直接改 CSV：

```bash
python3 .agents/skills/web-design-pipeline/references/uiux-asset-library/scripts/generate_uiuxmax_sync_candidates.py
```

它会生成：

- `uiuxmax-sync-candidates.json`

用途：

- 为 `styles.csv` 生成中等置信度候选
- 为 `palette-strategy` 生成 `colors.csv` 候选
- 为 `products.csv` 生成低置信度提示项
- 汇总 `suitable_stacks`、`motion_stack`、`data_stack`、`rendering_stack`

注意：

- 这一步是半自动桥接，不会直接改写 CSV
- `products.csv` 候选天然更粗，需要人工筛选
