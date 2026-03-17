---
name: slow-think-causal-chain
description: 从 ui-data-synth-pipeline 的 case 产出（PM/Designer/Frontend 三阶段文档与代码）合成「因果链约束传递」慢思考训练数据。强调上游决策如何约束下游产物，输出格式为 original_prompt + causal_chains + final_code。适用于训练模型学习「写代码前先追溯 PRD/设计约束」的推理习惯，或用于过程奖励模型和推理蒸馏。
---

# 因果链约束传递慢思考数据合成

将 `outputs/<case_id>/` 下的全阶段产物，提取为**多条因果推理链**，每条链展示一个需求/决策如何从 PM 层逐级传导到最终代码。

## 核心理念

与「长链推理」不同，因果链数据不是线性叙事，而是**网状约束图的线性展开**。每条链回答一个问题：「代码中的某个实现细节，为什么是这样的？」答案是一条从用户需求出发、经过 PRD → IA → 设计 → 技术选型 → 代码的因果链。

## 输入

与 `slow-think-long-chain` 相同的 case 目录结构。

## 执行步骤

### Step 1: 识别因果链锚点

从 `03_frontend/tech_decision.json` 和 `03_frontend/self_review.json` 出发，**反向**识别可追溯的决策点。

每个锚点需满足：**代码中存在对应实现** + **上游文档中存在对应约束**。

典型锚点类别：

| 类别 | 示例锚点 | 上游来源 |
|------|----------|----------|
| 技术栈选择 | 「为什么用 React 而非 Vue」 | tech_decision.selected_stack / why_not_others |
| 库采纳/拒绝 | 「为什么用 Zustand 不用 Redux」 | tech_decision.frontier_candidates_considered |
| 页面/视图存在 | 「为什么有 MinutesView」 | ia_structure.sections → prd.must_have |
| 组件设计 | 「WaveformCanvas 为什么存在」 | visual_effects → design_brief → prd 场景 |
| 布局方案 | 「为什么用 sidebar + top-bar」 | ia_structure.navigation_model → prd 多端需求 |
| 状态管理 | 「为什么分 3 个 store」 | tech_decision.internal_interaction_plan → component_specs.linkage |
| 动效策略 | 「粒子聚合为什么是 1500ms」 | visual_effects.generative_combination → design_system.motion |
| 配色方案 | 「为什么是冰蓝强调色」 | design_system.color_palette.rationale → prd 风格要求 |
| 性能约束 | 「为什么 Canvas unmount 时 cancel RAF」 | tech_decision.performance_guardrails → visual_effects.performance_notes |
| 功能边界 | 「为什么没有真实 WebRTC」 | requirement_breakdown.out_of_scope → prd.out_of_scope |
| 响应式策略 | 「手机端为什么用底部 Tab」 | ia_structure.responsive_priorities → design_brief 布局策略 |

**目标**：每个 case 抽取 **8-15 条**因果链。

### Step 2: 为每个锚点构建因果链

每条链按以下格式构建（最多 5 个因果节点）：

```
因为 [用户需求/PRD 约束]
  → 所以 [PM 做了某个架构/分级决策]
    → 所以 [设计师做了某个视觉/交互决策]
      → 所以 [前端做了某个技术/实现决策]
        → 所以 [代码中存在具体实现 X]
```

**构建规则**：

1. **每个节点必须引用具体文件和字段**（便于验证）
2. **允许跳层**：不是每条链都需要经过全部四阶段（如「配色」可能只有 PRD → 设计 → 代码）
3. **节点文字要自然**：不是 JSON 字段的复制，而是用人类推理语言改写
4. **最终节点必须指向具体代码**：文件路径 + 关键代码片段（3-10 行）
5. **反面因果也算**：「因为 X 不在范围内 → 所以设计没有做 Y → 所以代码中没有 Z」

### Step 3: 对因果链分类打标

每条链打上标签：

- **chain_type**: `selection`（选型）| `structure`（结构）| `visual`（视觉）| `interaction`（交互）| `constraint`（约束/边界）| `performance`（性能）
- **depth**: 链中节点数（2-5）
- **polarity**: `positive`（做了什么）| `negative`（没做什么/排除了什么）
- **confidence**: `high`（链中每个节点都有直接文档依据）| `medium`（部分节点需推理补充）

### Step 4: 提取 final_code

与 `slow-think-long-chain` 策略一致，但额外做一件事：**为每条因果链标注它对应的代码文件列表**（`related_files`），便于训练时做 code grounding。

### Step 5: 组装最终输出

参照 [output-template.md](output-template.md) 组装。

## 输出格式

输出一个 JSON 文件（`<case_id>_causal_chains.json`），schema：

```json
{
  "case_id": "string",
  "domain": "string",
  "pipeline_version": "string",
  "original_prompt": "用户原始需求",
  "causal_chains": [
    {
      "id": "chain_01",
      "anchor_question": "为什么使用 Zustand 而非 Redux 管理状态？",
      "chain_type": "selection",
      "polarity": "positive",
      "depth": 4,
      "confidence": "high",
      "nodes": [
        {
          "stage": "user_need",
          "content": "应用需要管理 meetingStatus、transcriptStream、taskList 等多个独立但联动的状态",
          "source": "01_pm/requirement_breakdown.json → must_have"
        },
        {
          "stage": "pm_decision",
          "content": "信息架构中 4 个视图共享会议状态，需要跨视图状态同步",
          "source": "01_pm/ia_structure.json → sections[*].purpose"
        },
        {
          "stage": "tech_decision",
          "content": "选择 Zustand：轻量、无 Provider 包裹、任意组件直接订阅；放弃 Redux 因为过重，放弃纯 Context 因为易导致 prop drilling",
          "source": "03_frontend/tech_decision.json → frontier_candidates_considered"
        },
        {
          "stage": "code_impl",
          "content": "实现 3 个独立 store：meetingStore、taskStore、uiStore，分别管理会议数据、任务列表、UI 状态",
          "source": "03_frontend/src/store/index.ts"
        }
      ],
      "code_snippet": "// src/store/index.ts\nimport { create } from 'zustand'\n\nexport const useMeetingStore = create((set) => ({\n  meetingStatus: 'idle',\n  ...\n}))",
      "related_files": ["src/store/index.ts", "src/App.tsx"]
    }
  ],
  "chain_summary": {
    "total_chains": 12,
    "by_type": { "selection": 3, "structure": 2, "visual": 3, "interaction": 2, "constraint": 1, "performance": 1 },
    "by_polarity": { "positive": 10, "negative": 2 },
    "avg_depth": 3.5
  },
  "final_code": {
    "stack": "string",
    "files": { "src/App.tsx": "...", "...": "..." }
  },
  "metadata": {
    "source_case": "outputs/v3-pipeline/<case_id>",
    "synth_method": "causal-chain-v1",
    "stage_files_used": ["meta.json", "01_pm/prd.md", "..."]
  }
}
```

## 因果链抽取策略细则

### 从 tech_decision.json 反向追溯

对 `tech_decision.json` 中的每个关键字段，尝试回答「为什么」：

| tech_decision 字段 | 向上追溯路径 |
|-------------------|-------------|
| `selected_stack.reasoning[i]` | → requirement_breakdown.must_have 中对应的功能需求 |
| `why_not_others[i]` | → 该替代方案无法满足的具体 PRD/设计需求 |
| `frontier_candidates_considered[i]` | → design_brief 或 visual_effects 中对应的交互需求 |
| `interaction_bets[i]` | → design_brief.交互重点 → prd 中的场景描述 |
| `performance_guardrails[i]` | → visual_effects.performance_notes → 对应的动效组件 |
| `fallback_plan[i]` | → visual_effects.fallback_strategy → 对应的 must_keep 模块 |

### 从 ia_structure.json 正向传导

对 `ia_structure.sections` 中的每个 section，追踪到下游：

```
section.purpose 
  → design_brief 中对应的布局/交互设计 
    → component_specs 中对应的组件 
      → 代码中对应的 View/Component 文件
```

### 从 visual_effects.json 双向连接

每个 placement 条目：
- 向上：为什么这个位置需要这个动效？→ design_brief 交互重点 → prd 场景
- 向下：具体怎么实现？→ tech_decision.generative_art_strategy → 代码文件

### 负面因果链（out_of_scope 传导）

从 `requirement_breakdown.out_of_scope` 或 `requirement_spec.explicitly_excluded` 出发：
```
因为 [明确排除了 X]
  → 所以 [设计中没有 X 相关的界面/组件]
    → 所以 [代码中用 mock 数据代替真实 API / 没有对应模块]
```

## 质量检查清单

- [ ] 至少 8 条因果链
- [ ] 至少 2 条 `negative` 极性链（排除/不做的推理）
- [ ] 至少 3 种 `chain_type` 覆盖
- [ ] 每条链的最终节点都有 `code_snippet`（3-10 行真实代码）
- [ ] `source` 字段引用的文件和字段确实存在
- [ ] 不同链之间无大段重复内容
- [ ] `anchor_question` 写成自然语言疑问句
- [ ] 链中间节点不是 JSON 字段名的简单罗列，而是自然语言推理
