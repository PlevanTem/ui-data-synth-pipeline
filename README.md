# UI Data Synth Pipeline

端到端 **网站设计与前端生成流水线**：从一句需求或测试 JSON 出发，经 PM → 设计师 → 前端，产出可运行的单页应用，并保存完整过程产物，便于批量测试与 UI 数据合成。

## 能做什么

- **输入**：自然语言需求（query）或测试集 JSON（每条含 `domain`、`user_req` 等）
- **流程**：PM 产出 `prd.md` → 设计师产出 `design_brief.md` → 前端产出 `index.html`
- **输出**：每个 case 独立目录，**单文件 `index.html` + Tailwind CDN + 原生 JS**，浏览器直接打开即可运行，无需 npm install

适用于：落地页、Dashboard、开发者工具、SaaS 工作台等需要「需求 → 设计 → 实现」全链路的场景，以及需要沉淀设计资产、做批量 case 测试或合成训练数据的场景。

## 目录结构

```
ui-data-synth-0402/
├── .agents/skills/              # 前端生成技能包
│   ├── web-design-pipeline/     # 主流水线（含 agents/ 和 references/）
│   ├── designer/                # 设计灵感调研、UI/UX 设计系统
│   ├── frontend/                # 生成式 UI + 算法艺术
│   └── ...
├── .cursor/skills/              # SFT 数据合成技能包
│   ├── slow-think-long-chain/   # 长链推理合成（一条样本覆盖完整设计思维）
│   └── slow-think-causal-chain/ # 因果链合成（多条样本各聚焦单一设计决策）
├── outputs/                     # 按 case 归档的产出（v5 格式）
│   └── {case_id}@v5_{YYYYMMDD}/
│       ├── meta.json
│       ├── 01_pm/
│       │   └── prd.md           # 需求推理 + 功能契约 + IA
│       ├── 02_designer/
│       │   └── design_brief.md  # 设计系统 + 组件规范 + 视觉特效
│       └── 03_frontend/
│           ├── index.html       # 单文件交付，浏览器直接打开
│           └── self_review.json
└── test_data/                   # 测试输入（如 example_inputs_5.json）
```

## 输入格式

**单条 query**：直接给一句产品描述或需求。

**测试集 JSON**：每项建议包含 `id`、`domain`、`user_req`，可选 `original_example_text`。示例见 `test_data/example_inputs_5.json`。

## 示例 Case

- **poetry-slam-ticket**：诗歌之夜购票页面，深色氛围、手写字体、Canvas 粒子动效，技术栈 HTML + Tailwind CDN + 原生 JS。  
  产出：`outputs/poetry-slam-ticket@v5_20260402/03_frontend/index.html`

## 使用方式

1. 提供 **一条 query** 或 **测试 JSON 文件路径**。
2. 依次执行：**PM Agent**（输出 `prd.md`）→ **Designer Agent**（输出 `design_brief.md`）→ **Frontend Agent**（输出 `index.html` + `self_review.json`）。
3. 直接在浏览器中打开 `03_frontend/index.html`，无需任何构建步骤。

## 技能包说明

| 技能包 | 路径 | 用途 |
|--------|------|------|
| `web-design-pipeline` | `.agents/skills/` | 主流水线：需求 → 设计 → 前端实现与归档（v5） |
| `design-inspiration-ai` | `.agents/skills/` | 设计灵感与概念发散 |
| `ui-ux-pro-max` | `.agents/skills/` | UI/UX 设计智能（风格、配色、图表参考） |
| `generative-ui` | `.agents/skills/` | Canvas / WebGL / p5.js 生成式视觉实现指南 |
| `skill-creator` | `.agents/skills/` | 技能包的创建、评估与优化 |
| `slow-think-long-chain` | `.cursor/skills/` | SFT 合成：长链推理，一条样本完整覆盖四阶段设计思维（v2） |
| `slow-think-causal-chain` | `.cursor/skills/` | SFT 合成：因果链，多条样本各聚焦单一设计决策点（v2） |

### SFT 合成技能说明

两个 `.cursor/skills/` 下的技能包用于将 pipeline 产出的 case（`prd.md` + `design_brief.md` + `index.html`）合成为 LLM 训练数据：

- **slow-think-long-chain**（v2）：每个 case 输出一条长样本，`<think>` 独白覆盖四阶段设计思维（需求解构 → 多路发散 → 约束验证 → 综合决断），代码输出为完整 `index.html`。适合训练 DeepSeek-R1 / o1 风格的慢思考推理能力与设计审美。

- **slow-think-causal-chain**（v2）：每个 case 输出 8-15 条短样本，每条聚焦一个具体设计决策点（视觉方向、配色、版式、字体、特效等），代码输出为相关代码片段。适合训练模型在设计决策点上的深度推理与审美感知，以及 PRM step-level 标注。

## 管线版本

当前版本：**v5**（2026-04-02）— 极简归档 × 单文件前端

SFT 合成技能：**slow-think-long-chain v2 / slow-think-causal-chain v2**（2026-04-03）— 四阶段设计思维重构

变更历史见 [`.agents/skills/web-design-pipeline/CHANGELOG.md`](.agents/skills/web-design-pipeline/CHANGELOG.md)。

## 仓库

- **GitHub**：<https://github.com/PlevanTem/ui-data-synth-pipeline>

## 许可与贡献

当前为项目内部流水线与示例仓库。修改需求或扩展 case 时，建议先更新对应 `prd.md` / `design_brief.md` 再改前端代码，以保持可追溯性。
