---
name: slow-think-long-chain
description: 从 ui-data-synth-pipeline 的 case 产出（PM/Designer/Frontend 三阶段文档与代码）合成「长链推理」慢思考训练数据。输出格式为 original_prompt + reasoning_chain + final_code。适用于需要将流水线产物转化为大模型 SFT 训练样本、长上下文推理数据或慢思考 CoT 数据时使用。
---

# 长链推理慢思考数据合成

将 `outputs/<case_id>/` 下的 PM → Designer → Frontend 全阶段产物，合成为一份**单样本长链推理文档**，格式为 `(original_prompt, reasoning_chain, final_code)`。

## 输入

一个 case 目录，包含：

| 路径 | 必需 | 说明 |
|------|------|------|
| `meta.json` | 是 | case 元信息，提取 `input_summary` / `domain` 作为原始 prompt |
| `01_pm/prd.md` | 是 | 产品规格 |
| `01_pm/requirement_breakdown.json` 或 `requirement_spec.json` | 是 | 需求拆解（两种 schema 均兼容） |
| `01_pm/ia_structure.json` | 是 | 信息架构 |
| `02_designer/design_brief.md` | 是 | 设计方向摘要 |
| `02_designer/design_system.json` | 是 | 设计系统 token |
| `02_designer/component_specs.json` | 否 | 组件规格 |
| `02_designer/visual_effects.json` | 否 | 动效策略 |
| `02_designer/style_research.md` | 否 | 风格调研 |
| `03_frontend/tech_decision.json` | 是 | 技术选型与推理 |
| `03_frontend/self_review.json` | 否 | 自检报告 |
| `03_frontend/src/` | 是 | 前端源码 |

## 执行步骤

### Step 1: 读取 & 规范化原始 prompt

从 `meta.json` 提取：
- `input_summary` → 作为 `<original_prompt>` 的主体
- 若 `meta.json` 中有 `original_example_text`（来自 test_data），优先使用它
- 否则用 `input_summary` + `domain` 拼接

输出字段：`original_prompt`（纯自然语言，用户视角的需求描述）

### Step 2: 合成 reasoning_chain

按以下四阶段结构，从各文档**抽取关键推理内容**（非原文复制，提炼核心逻辑链）。

#### 阶段一：需求分析与问题定义

从 `requirement_breakdown.json`（或 `requirement_spec.json`）提取：

**requirement_breakdown 格式**：
- `core_problem` → 一段话说清解决什么问题
- `target_users` → 列出用户类型
- `must_have` / `should_have` / `nice_to_have` → 保留分级列表，每项**附上 1 句分级理由**（推理补充，非原文自带）
- `out_of_scope` → 明确说「不做什么、为什么不做」
- `risk_notes` / `open_questions` → 保留

**requirement_spec 格式**：
- `core_problem` + `design_intent` → 同上
- `execution_contracts.must_deliver` / `should_deliver` / `explicitly_excluded` → 映射为 must/should/out_of_scope
- `entities` → 用 1-2 句描述核心数据模型关系
- `functional_architecture` → 简述模块依赖

从 `ia_structure.json` 提取：
- `navigation_model` → 说明选择理由
- `sections` → 每个 section 的 `purpose` 和 `priority`，串成「因为…所以…」逻辑
- `user_flows` → 摘要关键流程（不超过 3 条）
- `responsive_priorities` → 简述适配策略

**要求**：这一阶段的文字必须体现「先界定问题边界，再决定做什么」的推理顺序。

#### 阶段二：设计决策

从 `design_brief.md` 提取：
- 核心视觉方向 → 与用户需求中的关键词对应（如「极简商务风」→ 选了暗夜工作流）
- 布局策略 → 列出各视图的布局方案，附理由
- 交互重点 → 列出 wow 级别交互（不超过 5 条），说明每条**为什么值得做**

从 `design_system.json` 提取（精简）：
- `color_palette` 的 rationale
- `motion` 的 orchestration_rules
- `generative_aesthetics`（如有）的核心参数

从 `visual_effects.json`（如有）提取：
- `reasoning` → 为什么用/不用某种动效
- `generative_combination.combination_rationale` → 多种动效的组合逻辑
- `performance_notes` + `fallback_strategy` → 降级策略

从 `component_specs.json`（如有）提取：
- 关键组件的 `linkage`（状态共享关系）和 `motion_notes`

**要求**：这一阶段的文字必须体现「设计是被 PRD 约束的，每个视觉/交互决策都对应一个产品目标」。

#### 阶段三：技术选型与实现策略

从 `tech_decision.json` 提取：

- `selected_stack` + `reasoning` → 选栈理由
- `why_not_others` → **必须保留**，写成「考虑过 X，放弃因为…」
- `frontier_candidates_considered` → 每项按「考虑→采纳/拒绝→理由」三段式
- `interaction_bets` → 关键交互赌注
- `generative_art_strategy` → 生成式模块策略（如有）
- `internal_interaction_plan` → 状态管理与数据流方案
- `performance_guardrails` → 性能红线
- `fallback_plan` → 降级兜底

**要求**：这一阶段必须体现「在设计约束下选技术方案」，而非孤立讨论技术。

#### 阶段四：实现自检与反思（如有 self_review.json）

从 `self_review.json` 提取：
- `completed_items` → 列出已完成项
- `interaction_completeness` → 各维度完成度
- `known_gaps` → 已知不足
- `performance_notes` → 性能注意事项

**要求**：写成「我检查了…发现…需要改进…」的反思语气。

### Step 3: 提取 final_code

从 `03_frontend/src/` 提取关键源码文件。策略：

1. **入口文件**：`main.tsx` / `main.ts` + `App.tsx` / `App.vue`（必须）
2. **核心视图**：所有 `views/` 或 `pages/` 下的文件（必须）
3. **状态管理**：`store/` 下文件（如有）
4. **生成式模块**：`generative/` 或 `hooks/use*.ts` 中与 Canvas/动效相关的（如有）
5. **工具/数据**：`utils/mockData.ts`、`types/index.ts`（如有）
6. **跳过**：`package-lock.json`、`node_modules/`、纯配置文件（`tsconfig.json`、`postcss.config.js` 等）

每个文件以 `// --- filepath: src/xxx.tsx ---` 注释分隔。

### Step 4: 组装最终输出

参照 [output-template.md](output-template.md) 组装为最终的 JSON 或 Markdown 文档。

## 输出格式

输出一个 JSON 文件（`<case_id>_long_chain.json`），schema：

```json
{
  "case_id": "string",
  "domain": "string",
  "pipeline_version": "string",
  "original_prompt": "用户原始需求（自然语言）",
  "reasoning_chain": "长链推理文本（Markdown 格式，含四阶段结构化标题）",
  "final_code": {
    "stack": "React 18 + TypeScript + Vite",
    "entry_file": "src/main.tsx 的完整内容",
    "files": {
      "src/App.tsx": "...",
      "src/views/DashboardView.tsx": "...",
      "...": "..."
    }
  },
  "metadata": {
    "source_case": "outputs/v3-pipeline/<case_id>",
    "synth_method": "long-chain-reasoning-v1",
    "stage_files_used": ["meta.json", "01_pm/prd.md", "..."]
  }
}
```

## 质量检查清单

- [ ] `original_prompt` 不含内部术语，读起来像真实用户的需求
- [ ] `reasoning_chain` 四阶段齐全，每阶段有明确标题
- [ ] 阶段之间有因果连接词（因此/基于上述/考虑到…）
- [ ] 包含至少 3 处「放弃 X 的理由」（负面决策）
- [ ] `final_code` 至少包含入口 + 核心视图 + 状态管理
- [ ] 不含重复的大段 JSON 原文直接粘贴（应提炼为自然语言推理）
- [ ] 总 token 量控制在 15k-40k 之间（适合长上下文训练）
