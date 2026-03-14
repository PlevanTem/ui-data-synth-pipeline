# UI Data Synth Pipeline

这是一个用于 **UI 数据合成、批量案例生成与设计能力沉淀** 的仓库，不是一个“根目录直接运行”的单体前端项目。

它的核心目标是：从一句需求或测试集 JSON 出发，经 PM → Designer → Frontend 三阶段，生成 **业务理解深入、风格明确、视觉优秀、交互完整、可运行** 的高品质前端界面，并把前端当成一个“可编排的体验系统”而不是“套壳页面系统”。

## 仓库定位

这个仓库同时承担三件事：

- **Pipeline 编排层**：定义如何从输入一路走到前端交付
- **Skill 工具层**：沉淀可复用的设计、前端、生成式视觉能力
- **Case 样本库**：保存 v1 / v2 / v3 不同阶段的真实输出，作为评估样本和演进证据

换句话说，它更接近“**工作流 + 资产库 + 样例归档**”，而不是“一个产品应用源码仓库”。

## 项目目标

这个项目要解决的不是一次性做出一个网页，而是把网站/应用原型生成过程做成流水线：

- **输入可批量化**：接受单条 `query` 或测试 JSON
- **过程可追溯**：保留业务 spec、设计系统、交互规范、技术决策、自检等核心证据
- **输出可运行**：前端交付不是截图，而是可以启动和交互的项目
- **风格可沉淀**：把趋势、配色、动效、风格 recipe 沉淀为资产库
- **版本可对比**：同一批 case 可以跨 v1 / v2 / v3 比较生成质量和架构演进

## 核心流程

标准链路如下：

1. **输入阶段**
   - 输入一条自然语言需求，或一个测试 JSON 文件
2. **PM 阶段**
   - 深入理解行业、业务任务、用户场景和功能优先级
   - 产出 `experience_spec.json`
3. **Designer 阶段**
   - 先定义北极星体验、惊艳点和项目专属视觉语法
   - 再做设计系统收敛、组件与交互合同定义
   - 产出 `experience_blueprint.json`、`design_system.json`、`interaction_spec.json`
4. **Frontend 阶段**
   - 先把体验拆成内容层 / 交互层 / 动画层 / 渲染层 / 系统层
   - 再做技术选型并实现可运行前端
   - 产出 `tech_decision.json`、`self_review.json` 和多文件前端源码
5. **归档与沉淀**
   - 把每个 case 写入 `outputs/`
   - 把可复用设计结论沉淀到 `uiux-asset-library/`

## 当前主规范

当前仓库的“最新主规范”已经不是早期的单文件 HTML 输出，而是：

- `03_frontend/` 默认应为 **TypeScript + 组件化 + 多文件项目**
- 前端应可通过 `npm install && npm run dev` 启动
- 页面内部交互必须完整实现，而不只是静态视觉稿
- PM 必须深度理解行业和业务场景，但不再输出多份重复 PRD 文档
- 设计资产要能回流到 `ui-ux-pro-max` 的结构化检索体系

同时，当前主规范也不再鼓励“同一意图写 5 份近义文档”。主产物收敛为：

- `01_product/experience_spec.json`
- `02_design/experience_blueprint.json`
- `02_design/design_system.json`
- `02_design/interaction_spec.json`
- `03_frontend/tech_decision.json`
- `03_frontend/self_review.json`
- `03_frontend/` 可运行项目

这意味着：

- 根目录 **没有统一的 `package.json` 或 `src/` 入口**
- 实际运行入口通常在某个 case 的 `03_frontend/`
- README 和架构理解要以 `web-design-pipeline` 的最新约束为准，而不是只看最早期样例

## 分层结构

仓库里最重要的是两层 skill 结构：

### 1. 独立可复用 Skill

放在 `.agents/skills/` 顶层子目录下，可单独调用：

- `designer/design-inspiration-ai`
- `designer/ui-ux-pro-max`
- `frontend/generative-ui`
- `skill-creator`

### 2. Pipeline 编排层

放在 `.agents/skills/web-design-pipeline/`，只在这条流水线里有意义：

- `SKILL.md`：总入口
- `agents/pm-agent.md`
- `agents/designer-agent.md`
- `agents/frontend-agent.md`
- `references/output-structure.md`
- `references/uiux-asset-library/`

这里的关键区别是：

- 顶层 skill 是“工具能力”
- `web-design-pipeline` 是“把这些能力串起来的编排协议”

## 目录结构

```text
ui-data-synth-pipeline/
├── .agents/
│   └── skills/
│       ├── README.md
│       ├── designer/
│       │   ├── design-inspiration-ai/
│       │   └── ui-ux-pro-max/
│       ├── frontend/
│       │   └── generative-ui/
│       ├── skill-creator/
│       └── web-design-pipeline/
│           ├── SKILL.md
│           ├── agents/
│           └── references/
├── outputs/
│   ├── v1-pipeline/
│   ├── v2-pipeline/
│   └── v3-pipeline/
├── test_data/
├── ARCHITECTURE.md
└── README.md
```

## 输出结构

最新规范以 `web-design-pipeline/references/output-structure.md` 为准。当前推荐的 case 结构是：

```text
outputs/v3-pipeline/<case-id>/
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
```

其中：

- `meta.json` 记录 case 元信息、栈选择、视觉效果和 pipeline 版本
- `01_product/experience_spec.json` 保存业务理解、功能优先级、IA 和选型信号
- `02_design/experience_blueprint.json` 保存北极星体验、惊艳点和视觉母语
- `02_design/design_system.json` 保存视觉系统
- `02_design/interaction_spec.json` 保存组件、联动、动效和视觉层策略
- `03_frontend/` 保存真正可运行的前端项目

## 新的职责分工

### PM

PM 不是被削弱，而是从“多文档转述层”变成“强理解层”：

- 理解行业知识、业务语义、关键任务流
- 定义哪些功能和流程必须真实存在
- 明确边界情况与优先级
- 为设计和技术选型提供结构化信号

### Designer

Designer 负责：

- 北极星体验
- 视觉母语
- 风格探索
- 设计系统
- 组件状态与交互合同
- 动效语言
- generative / code-art 视觉策略

### Frontend

Frontend 负责：

- 分层体验架构
- 技术栈决策
- 工程结构
- 状态管理与组件通信
- 真实交互实现
- 性能与降级策略

## 版本演进

仓库里同时存在 v1 / v2 / v3，是因为它本身就在记录 pipeline 的演进，而不是只有当前状态。

### v1

- 以 case 归档完整产物为主
- 前端交付常见为 `html-tailwind` 单文件 `index.html`
- 更强调“先把流程跑通”

### v2

- 加强了设计探索与趋势调研
- 开始更明确记录技术与模型信息
- 前端仍有较多单文件 HTML，但视觉层更复杂

### v3

- 以 **TypeScript / 组件框架 / 多文件项目** 为主规范
- 强调真实交互、状态管理、组件通信和运行能力
- 更接近“可继续开发的前端原型”，而不是一次性静态成品

### vNext

- 保留 `PM / Designer / Frontend` 三层外形
- PM 改为“强理解、轻文档”
- Designer 升级为“体验北极星 + 视觉母语定义层”
- Frontend 升级为“分层体验架构 + 技术映射层”
- 主输出从多份近义文档收敛为少量强规范文件
- 技术选型规则收口到单一真源

目前你看到的迁移迹象主要有两类：

- **路径迁移**：从早期 `outputs/<case-id>/` 迁到 `outputs/v1-pipeline/`、`outputs/v2-pipeline/`、`outputs/v3-pipeline/`
- **交付迁移**：从单文件 HTML 迁到多文件 TypeScript 项目

## 如何阅读这个仓库

如果你是第一次接手这个项目，建议按这个顺序读：

1. `README.md`
2. `ARCHITECTURE.md`
3. `.agents/skills/README.md`
4. `.agents/skills/web-design-pipeline/SKILL.md`
5. `.agents/skills/web-design-pipeline/references/output-structure.md`
6. `.agents/skills/web-design-pipeline/references/stack-selection-policy.md`
7. `test_data/example_inputs_5.json`
8. 任意一个 `outputs/v3-pipeline/<case-id>/03_frontend/README.md`

## 如何使用

### 理解流程

如果你是要继续迭代 pipeline，本质上应该修改的是：

- skill 描述与编排规则
- 输出结构规范
- 资产沉淀策略

而不是只盯着某一个 case 的最终前端。

### 查看样例

如果你是要看“当前效果做到了什么程度”，直接看 `outputs/` 下的 case：

- 读 `meta.json` 了解这个 case 属于哪个 pipeline 版本
- 历史 case 可读 `01_pm/`、`02_designer/` 看旧版中间过程
- 新规范下重点看 `01_product/experience_spec.json` 和 `02_design/`
- 进入 `03_frontend/` 看最终实现与启动方式

### 运行前端

仓库根目录通常不作为运行入口。请进入具体 case 的 `03_frontend/`，再执行：

```bash
npm install
npm run dev
```

例如可参考：

- `outputs/v3-pipeline/002_travel/03_frontend/`
- `outputs/v3-pipeline/004_ecommerce/03_frontend/`
- `outputs/v3-pipeline/005_saas/03_frontend/`

## 关键技能包

| 技能包 | 角色 |
|--------|------|
| `web-design-pipeline` | 顶层编排：定义 PM → Designer → Frontend 的完整工作流 |
| `design-inspiration-ai` | 外部优秀网站与趋势搜寻、概念发散、审美信号判断 |
| `ui-ux-pro-max` | 配色、排版、风格库、反模式、设计系统检索与收敛底座 |
| `generative-ui` | Canvas / WebGL / p5.js / 交互式视觉层；在 pipeline 中主要作为嵌入式视觉模块使用 |
| `skill-creator` | skill 的创建、优化与评估 |

## 资产库

`web-design-pipeline/references/uiux-asset-library/` 不是案例成品区，而是知识沉淀区。

它的作用是把 case 中可泛化的结论沉淀为：

- `trend-notes/`
- `style-recipes/`
- `palette-strategies/`
- `motion-patterns/`
- `anti-patterns.md`

这些资产不仅给人看，也要尽可能能映射回 `ui-ux-pro-max` 的结构化字段，成为真正可检索的风格知识库。

## 仓库说明

- GitHub：<https://github.com/PlevanTem/ui-data-synth-pipeline>
- 更详细的结构说明见 [`ARCHITECTURE.md`](./ARCHITECTURE.md)

## 维护建议

当你修改这个项目时，建议遵循下面的顺序：

1. 先改 pipeline 规范或 skill 文档
2. 再改输出结构与资产沉淀规则
3. 最后再更新 case 或补跑样例

如果只是改了某个前端样例，却没有同步更新上游规范，这个仓库的“可复盘”价值会很快失真。
