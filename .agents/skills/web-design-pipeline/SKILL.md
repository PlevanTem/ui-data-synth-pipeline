---
name: web-design-pipeline
description: 端到端网站设计与前端生成工作流。适用于用户想根据一句 query、产品想法、测试 JSON、需求描述或案例批量生成高质量网站、landing page、dashboard、营销页或 web app 原型时。遇到网站设计、前端生成、UI 风格探索、技术栈选型、批量测试网站生成、沉淀设计资产、为 UI 数据合成保存中间过程等任务时，应优先使用此 skill，而不是直接一次性写代码。
---

# Web Design Pipeline

这个 skill 的目标不是“快速吐一份页面代码”，而是把一次网站生成任务拆成可复盘、可重跑、可批量化的流水线。

核心原则：

- 先澄清需求和范围，再设计和实现
- 参考现有 skill 的方法，但不要照搬它们的结构和措辞
- 对每个 case 保存过程证据，便于后续批量测试和数据合成
- 设计要兼顾前沿感、多样性与可实现性，避免模板化同质输出

## 何时使用

在这些场景使用本 skill：

- 用户要“生成一个网站”“做一个 landing page”“根据需求产出前端页面”
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

- PM 产物：`prd.md`、`requirement_breakdown.json`、`ia_structure.json`
- Designer 产物：`style_research.md`、`design_system.json`、`component_specs.json`、`design_brief.md`、`visual_effects.json`
- Frontend 产物：可运行前端源码、`tech_decision.json`、`self_review.json`
- 元数据：`meta.json`

## 总流程

按这个顺序执行，不要跳步：

1. 解析输入并创建 case 目录
2. 调用 PM Agent 产出需求和信息架构
3. 调用 Designer Agent 做前沿风格探索、设计系统收敛和特效建议
4. 调用 Frontend Agent 做技术栈决策并实现网站
5. 归档所有结果，并把可复用设计结论沉淀到资产库

## 目录与归档

先读取 `references/output-structure.md`，严格按其中规则归档。

如果是单条 query：

- 目录命名：`YYYYMMDD_HHMMSS_{slug}`

如果来自测试文件且有 `id`：

- 目录命名：`{NNN}_{domain_slug}`

把每个 case 的结果放在：

- `outputs/<case-id>/01_pm/`
- `outputs/<case-id>/02_designer/`
- `outputs/<case-id>/03_frontend/`

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
- `01_pm/requirement_breakdown.json`
- `01_pm/ia_structure.json`

### Designer Agent

调用 `agents/designer-agent.md`，输入：

- `01_pm/` 下全部产物
- 资产库路径 `references/uiux-asset-library/`

Designer Agent 必须先探索再收敛：

- 用 `design-inspiration-ai` 的方法做风格探索和趋势判断
- 用 `ui-ux-pro-max` 做设计系统、排版、配色、动效和可访问性收敛

产出必须写入：

- `02_designer/style_research.md`
- `02_designer/design_brief.md`
- `02_designer/design_system.json`
- `02_designer/component_specs.json`
- `02_designer/visual_effects.json`

### Frontend Agent

调用 `agents/frontend-agent.md`，输入：

- `01_pm/` 和 `02_designer/` 下全部产物

Frontend Agent 需要先做 `tech_decision.json`，再实现。

栈选择不固定，必须根据场景判断：

- `html-tailwind`
- `react`
- `nextjs`
- `vue`
- `svelte`
- 其他仅在用户明确要求时使用

如果 `visual_effects.json` 建议加入 WebGL、p5.js 或数字艺术动效，Frontend Agent 可参考：

- `.agents/skills/frontend/generative-ui/SKILL.md`

但只借用其算法艺术方法，不要把整个任务变成艺术作品生成器。

## 设计资产沉淀

每次完成 Designer 阶段后，审查哪些结论可以泛化为资产：

- 趋势观察放入 `trend-notes/`
- 可复用风格定义放入 `style-recipes/`
- 配色策略放入 `palette-strategies/`
- 动效模式放入 `motion-patterns/`
- 常见同质化风险更新到 `anti-patterns.md`

沉淀原则：

- 提炼为“可复用规则”，不要粘贴当前 case 的最终文案
- 明确适用场景和不适用场景
- 如果只是一次性偶然选择，不要强行入库

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

如果你发现当前产出明显像“套模板”，返回 Designer 阶段重做风格探索。

## 技术栈选择原则

默认根据目标选型，而不是固定一个框架：

- 展示型网站、作品集、快速验证：优先 `html-tailwind`
- 复杂状态交互、SaaS、仪表盘：优先 `react`
- 有 SEO/SSR 明确诉求：优先 `nextjs`
- 强交互且追求轻量：可用 `svelte`

技术选型要在 `tech_decision.json` 中解释：

- 为什么选这个栈
- 为什么不选其他候选
- 是否需要 WebGL / p5.js / Canvas
- 是否需要多文件源码结构

## 质量门槛

最终交付必须满足：

- 页面可运行
- 结构完整，非半成品
- 有明确设计方向和层级
- 有基本交互反馈
- 响应式可用
- 无明显可访问性硬伤
- 产物归档完整

如果无法全部满足，明确记录在 `self_review.json` 中，不要伪装成完成。

## 输出风格

对用户汇报时，优先给这些信息：

- 本次选择的技术栈
- 设计方向与差异化点
- 主要交付物路径
- 若未完成，缺什么、为什么

不要只汇报“已生成完成”，没有验证的完成是谎言。

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
- `.agents/skills/frontend/generative-ui/SKILL.md`

这些参考用于吸收方法，不用于复制结构。
