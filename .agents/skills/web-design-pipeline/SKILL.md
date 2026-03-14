---
name: web-design-pipeline
description: 端到端网站设计与前端生成工作流。适用于根据 query、测试 JSON、产品想法或需求描述，生成高品质、真实可交互、风格明确、可运行的前端界面，并保留必要但不过度冗余的过程规范。
---

# Web Design Pipeline

这个 skill 的目标不是快速吐一份页面代码，而是用最少但足够强的中间规范，把一次前端生成任务拆成可复盘、可批量化、可继续迭代的体验系统流程。

## 核心原则

- 先理解行业、业务场景与用户真实任务，再谈风格和实现
- 文档要少，但每一份都必须能被下游真实消费
- 前端交付默认必须是真实可运行、可交互、可扩展的多文件项目
- 视觉品质、交互品质和业务贴合度同等重要
- 生成式视觉层是系统的一部分，不是脱离内容的炫技层
- 页面内部联动必须完整实现，不能只做静态外壳
- 特色来自体验分层、技术组合和项目专属视觉语法，不来自框架名本身

## 何时使用

在这些场景使用本 skill：

- 用户要生成网站、landing page、dashboard、营销页或 web app 前端
- 用户给一条 query 或测试 JSON，希望端到端产出高质量前端
- 用户强调视觉表达、交互品质、前沿感、生成式视觉或沉浸体验
- 用户需要保存必要过程规范，便于批量测试、回放或数据合成

不要把它用于：

- 只改一个已有组件的小样式
- 不涉及前端交付的任务
- 纯后端任务

## 输入形式

接受两类输入：

1. `query`
   - 一句自然语言需求
   - 一个较完整的产品描述

2. `test file`
   - 一个 JSON 文件路径
   - 每条记录至少包含需求文本，若存在 `id`、`domain`、`user_req`、`original_example_text`，优先用于命名和补全上下文

## 主输出集合

当前主规范只保留这些核心产物：

- `01_product/experience_spec.json`
- `02_design/experience_blueprint.json`
- `02_design/design_system.json`
- `02_design/interaction_spec.json`
- `03_frontend/tech_decision.json`
- `03_frontend/self_review.json`
- `03_frontend/` 可运行前端源码
- `meta.json`

详细目录与字段规则统一参考：

- `references/output-structure.md`

技术选型统一参考：

- `references/stack-selection-policy.md`

## 总流程

按这个顺序执行，不要跳步：

1. 解析输入并创建 case 目录
2. 调用 PM Agent，产出 `experience_spec.json`
3. 调用 Designer Agent，产出 `experience_blueprint.json`、`design_system.json` 和 `interaction_spec.json`
4. 调用 Frontend Agent，产出 `tech_decision.json`、可运行前端和 `self_review.json`
5. 如有需要，在交付后把可复用设计结论整理并沉淀到资产库

## Agent 边界

### PM Agent

PM 不是弱化，而是“轻文档、重理解”。

它负责：

- 行业理解
- 业务目标与用户角色
- 真实需求与功能优先级
- 页面类型与 IA 骨架
- 核心用户流
- 边界情况
- 影响技术选型的结构化信号

它不负责：

- 长篇重复 narrative PRD
- 视觉风格裁决
- 技术栈拍板

### Designer Agent

Designer 负责体验和审美主导。

它负责：

- 北极星体验定义
- 项目专属视觉语法
- 风格探索与趋势判断
- 设计系统收敛
- 组件状态与交互合同
- 动效节奏
- generative / code-art 视觉策略
- 可复用设计资产候选整理

它不负责：

- 最终技术栈拍板
- 重复写一份仅做摘要的设计 brief

### Frontend Agent

Frontend 负责实现与技术选型。

它负责：

- 根据 `experience_spec.json`、`experience_blueprint.json`、`design_system.json`、`interaction_spec.json` 做技术决策
- 把体验蓝图拆成内容层、交互层、动画层、渲染层和系统层
- 选择最能支撑目标体验的技术栈
- 实现真实可用的组件、状态和联动
- 集成生成式视觉层
- 做诚实自审与降级说明

它不负责：

- 重新定义业务需求
- 重新设计一套体验规范

## 技术选型原则

这里不再维护重复的栈对比清单。统一规则只看：

- `references/stack-selection-policy.md`

但顶层硬约束保持不变：

- 默认前端交付必须使用 TypeScript / 组件框架
- 默认交付必须是多文件项目
- 默认不接受纯静态 HTML

## 页面内部交互完整性要求

这是 PM、Designer、Frontend 共同遵守的硬要求：

- 导航和视图切换必须真实可用
- 筛选、搜索、排序必须联动内容
- 表单必须有验证、反馈和状态流转
- 卡片、列表、详情、图表之间的联动必须实现
- 动画和转场必须响应真实操作
- 模态、抽屉、toast 等叠加层必须闭环
- 空态、加载态、错误态必须明确
- 尽量让惊艳点绑定到真实用户操作，而不是只绑定到背景装饰层

## 资产沉淀

这一步默认不阻塞主生成链路。

更推荐在这些时机执行：

- 单 case 交付完成后手动整理
- 一批 case 跑完后统一批处理
- 确认确实有可复用结论时再执行

沉淀目标位置：

- `references/uiux-asset-library/`

优先沉淀：

- 趋势观察到 `trend-notes/`
- 风格方法到 `style-recipes/`
- 配色体系到 `palette-strategies/`
- 动效语言到 `motion-patterns/`
- generative 组合策略到 `generative-recipes/`
- 同质化风险到 `anti-patterns.md`

资产库维护要求：

- 统一遵守 `references/uiux-asset-library/asset-schema.md`
- 每条资产使用统一 YAML frontmatter
- 新增或修改资产后同步更新 `references/uiux-asset-library/catalog.json`
- 优先使用 `references/uiux-asset-library/scripts/generate_catalog.py` 生成或校验索引，而不是手工维护

## 输出风格

对用户汇报时，优先给这些信息：

- 对业务与场景的理解
- 设计方向与差异化点
- 技术栈和理由
- 页面内部交互覆盖情况
- 主要交付物路径
- 已知缺口和降级说明

## 参考文件

- `agents/pm-agent.md`
- `agents/designer-agent.md`
- `agents/frontend-agent.md`
- `references/output-structure.md`
- `references/stack-selection-policy.md`
- `references/uiux-asset-library/anti-patterns.md`

外部参考 skill：

- `.agents/skills/designer/design-inspiration-ai/SKILL.md`
- `.agents/skills/designer/ui-ux-pro-max/SKILL.md`
- `.agents/skills/frontend/generative-ui/SKILL.md`
