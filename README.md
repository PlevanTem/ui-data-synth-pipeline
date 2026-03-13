# UI Data Synth Pipeline

端到端 **网站设计与前端生成流水线**：从一句需求或测试 JSON 出发，经 PM → 设计师 → 前端，产出可复用的 PRD、设计系统与可运行前端，并保存完整过程产物，便于批量测试与 UI 数据合成。

## 能做什么

- **输入**：自然语言需求（query）或测试集 JSON（每条含 `domain`、`user_req` 等）
- **流程**：解析输入 → PM 产出 PRD/需求拆解/信息架构 → 设计师产出风格研究/设计系统/组件规格/动效 → 前端产出可运行页面与技术决策/自检
- **输出**：每个 case 独立目录，包含文档与前端代码，支持单文件 HTML 或多文件 React/Vue 等

适用于：落地页、Dashboard、开发者工具、SaaS 工作台等需要「需求 → 设计 → 实现」全链路的场景，以及需要沉淀设计资产、做批量 case 测试或合成训练数据的场景。

## 目录结构

```
ui-data-synth-pipeline/
├── .agents/skills/          # 技能包（PM / 设计师 / 前端 / 生成式 UI 等）
│   ├── web-design-pipeline/ # 主流水线：端到端网站生成
│   ├── designer/            # 设计灵感调研、UI/UX 设计系统
│   ├── frontend/            # 生成式 UI + 算法艺术
│   └── ...
├── outputs/                 # 按 case 归档的流水线产出
│   └── <case_id>/
│       ├── meta.json
│       ├── 01_pm/           # prd.md, requirement_breakdown.json, ia_structure.json
│       ├── 02_designer/     # style_research, design_system, component_specs, visual_effects
│       └── 03_frontend/     # index.html 或 src/, tech_decision.json, self_review.json
├── test_data/               # 测试输入（如 example_inputs_5.json）
├── docs/
└── user_background/
```

## 输入格式

**单条 query**：直接给一句产品描述或需求。

**测试集 JSON**：每项建议包含 `id`、`domain`、`user_req`，可选 `original_example_text`。示例见 `test_data/example_inputs_5.json`。

## 示例 Case

- **001_devtools**：PerfScope —— 面向工程师的性能分析工作台（高密度数据、时间线、瓶颈列表、自然语言查询等），技术栈 HTML+Tailwind，含 Canvas 动效。  
  产出位置：`outputs/001_devtools/`，前端入口 `outputs/001_devtools/03_frontend/index.html`。

## 使用方式

1. 在支持本流水线的环境中，提供 **一条 query** 或 **测试 JSON 文件路径**。
2. 按顺序执行：PM Agent → Designer Agent → Frontend Agent，产出会写入 `outputs/<case_id>/`。
3. 前端产物可直接在浏览器中打开或接入现有项目。

## 技能包说明

| 技能包 | 用途 |
|--------|------|
| `web-design-pipeline` | 主流水线：需求澄清、设计规范、前端实现与归档 |
| `design-inspiration-ai` | 设计灵感与概念发散 |
| `ui-ux-pro-max` | UI/UX 设计智能（风格、配色、图表、技术栈） |
| `generative-ui` | 生成式 UI + 算法艺术（Mode A 背景层 / Mode B 交互组件 / Mode C 独立艺术） |
| `skill-creator` | 技能包的创建、评估与优化 |

## 仓库

- **GitHub**：<https://github.com/PlevanTem/ui-data-synth-pipeline>

## 架构文档

完整架构图（流水线总览、Skill 层级、Agent 数据流、目录结构）见 [`ARCHITECTURE.md`](./ARCHITECTURE.md)。

## 许可与贡献

当前为项目内部流水线与示例仓库。修改需求或扩展 case 时，建议先更新对应 PRD/设计文档再改代码，以保持可追溯性。
