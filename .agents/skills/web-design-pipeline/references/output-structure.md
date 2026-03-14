# Output Structure

这个文件定义 `web-design-pipeline` 的主输出结构。

目标是减少重复文档，保留真正会被下游消费的规范文件。执行时优先遵守这里，而不是临时增加摘要型中间件。

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

## 主输出目录

```text
outputs/
└── <case-id>/
    ├── meta.json
    ├── 01_product/
    │   └── experience_spec.json
    ├── 02_design/
    │   ├── experience_blueprint.json
    │   ├── design_system.json
    │   └── interaction_spec.json
    └── 03_frontend/
        ├── package.json
        ├── tsconfig.json
        ├── README.md
        ├── tech_decision.json
        ├── self_review.json
        └── src/
            ├── components/
            ├── hooks/ or composables/
            ├── types/
            ├── styles/
            ├── utils/
            ├── generative/
            └── ...
```

## 主产物定义

### `01_product/experience_spec.json`

这是 PM 阶段的唯一主文件，负责承载：

- 行业理解
- 业务目标
- 用户角色
- 核心场景
- 功能优先级
- IA 骨架
- 关键用户流
- 边界情况
- 影响技术选型的结构化信号

建议字段：

```json
{
  "project_name": "",
  "domain": "",
  "core_problem": "",
  "domain_model": [],
  "user_roles": [],
  "core_jobs_to_be_done": [],
  "business_scenarios": [],
  "must_have_workflows": [],
  "functional_priorities": {
    "must_have": [],
    "should_have": [],
    "nice_to_have": [],
    "out_of_scope": []
  },
  "page_type": "",
  "navigation_model": "",
  "sections": [],
  "user_flows": [],
  "edge_cases": [],
  "industry_constraints": [],
  "interaction_density": "low|medium|high",
  "visual_expressiveness": "low|medium|high|immersive",
  "seo_priority": "low|medium|high",
  "motion_intensity": "low|medium|high",
  "device_priority": "desktop|mobile|balanced",
  "performance_sensitivity": "low|medium|high",
  "delivery_constraints": []
}
```

### `02_design/design_system.json`

这是 Designer 阶段的视觉系统真源，负责承载：

- 设计方向
- 色彩、排版、间距、阴影、圆角
- 动效节奏
- 视觉母题
- 深度与层级策略
- 响应式规则
- 可访问性底线

### `02_design/experience_blueprint.json`

这是 Designer 阶段的体验蓝图真源，负责承载：

- 北极星体验
- 惊艳点与关键时刻
- 项目专属视觉语法
- 哪些体验模块是核心押注
- 哪些交互必须是真实发生的
- 哪些模块必须保留，哪些可以降级

建议结构：

```json
{
  "north_star_experience": "",
  "wow_moments": [],
  "signature_feeling": [],
  "experience_pillars": [],
  "visual_grammar": {
    "composition_language": [],
    "material_language": [],
    "motion_language": [],
    "icon_illustration_language": [],
    "transition_language": []
  },
  "signature_modules": [],
  "must_be_real_interactions": [],
  "allowed_degradations": [],
  "decorative_only_modules": [],
  "anti_template_rules": []
}
```

### `02_design/interaction_spec.json`

这是 Designer 阶段的体验规范真源，负责承载：

- 组件清单与变体
- 所有关键状态
- 组件间联动
- 表单、筛选、标签、导航等交互合同
- 动画与转场规则
- generative / Canvas / WebGL / 3D 策略
- fallback 与性能提醒
- 真实交互优先级
- 各模块与体验蓝图的映射关系

建议结构：

```json
{
  "interaction_principles": [],
  "components": [],
  "interaction_flows": [],
  "animation_rules": [],
  "overlay_rules": [],
  "data_linkage_rules": [],
  "generative_strategy": {
    "use_generative_layer": false,
    "primary_layer": {},
    "secondary_layers": [],
    "interaction_hooks": [],
    "fallback_strategy": []
  }
}
```

### `03_frontend/tech_decision.json`

这是 Frontend 阶段的实现策略真源，负责承载：

- 框架与语言选择
- 为什么选它
- 为什么不选其他候选
- 状态管理与视图组织
- 动画与渲染方案
- generative 层如何与组件框架集成
- 性能边界与降级策略

技术选型规则统一参考：

- `references/stack-selection-policy.md`

### `03_frontend/self_review.json`

这是实现后的诚实自检，负责承载：

- 哪些已完成
- 哪些做了降级
- 页面内部交互是否完整实现
- a11y / responsive / performance 风险
- 后续修复建议

## 通用工程要求

- `03_frontend/` 必须是一个可通过 `npm install && npm run dev` 启动的项目
- 所有前端默认采用 TypeScript / 组件框架 / 多文件组织
- `src/generative/` 用于独立封装 Canvas / WebGL / p5.js / shader 模块
- 不再使用单文件 `index.html` 作为默认交付形式
- 如出现极特殊的静态交付，必须在 `tech_decision.json` 中说明理由

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
  "stack_language": "typescript",
  "delivery_mode": "multi-file",
  "uses_visual_effects": false,
  "generative_modes": [],
  "interaction_completeness": "full|partial",
  "created_at": "",
  "pipeline_version": "vNext"
}
```

## 兼容说明

仓库中历史样例仍可能保留旧结构，例如：

- `01_pm/`
- `02_designer/`
- 单独的 `style_research.md`、`design_brief.md`、`visual_effects.json`

这些是历史演进证据，不代表当前主规范。

## 资产沉淀

除 case 目录外，还要维护：

```text
references/uiux-asset-library/
├── catalog.json
├── asset-schema.md
├── templates/
│   └── asset-template.md
├── trend-notes/
├── style-recipes/
├── palette-strategies/
├── motion-patterns/
├── generative-recipes/
└── anti-patterns.md
```

用于保存可复用结论，而不是某个 case 的最终成品。

其中：

- `catalog.json` 是资产库统一索引
- `asset-schema.md` 定义统一字段模型
- 每条 Markdown 资产都应带 YAML frontmatter，便于后续建库和脚本处理

推荐维护方式：

- 不把资产沉淀当作每次生成都同步执行的硬步骤
- 更适合在 case 完成后手动整理，或在批量跑完后统一处理
- 使用 `references/uiux-asset-library/scripts/generate_catalog.py` 自动生成或校验 `catalog.json`

## 不要做的事

- 不要用多个文件重复转述同一份需求或同一套交互
- 不要缺失 `experience_blueprint.json`，否则 Frontend 会失去体验北极星输入
- 不要为了“可读”再额外生成没有新增约束的摘要文件
- 不要把所有产物混在根目录
- 不要把最终交付退化成单文件 HTML
- 不要省略 `package.json`、`tsconfig.json`、`tech_decision.json`、`self_review.json`
