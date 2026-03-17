---
name: slow-think-long-chain
description: 从 ui-data-synth-pipeline 的 case 产出（PM/Designer/Frontend 三阶段文档与代码）合成 LLM 可直接训练的慢思考 SFT 数据。输出为标准对话格式：用户 prompt + assistant 回复（含 <think> 自然推理过程 + 完整前端代码）。适用于训练 DeepSeek-R1 / o1 风格的慢思考推理能力。
---

# 长链推理慢思考 SFT 数据合成

将 `outputs/<case_id>/` 下的 PM → Designer → Frontend 全阶段产物，合成为**一条可直接用于 LLM SFT 训练的对话样本**。

## 核心理念

当前主流慢思考模型（DeepSeek-R1、OpenAI o1、QwQ）的训练数据核心格式是：

```
User: {自然语言需求}
Assistant: <think>{内心独白式推理过程}</think>

{最终代码实现}
```

`<think>` 块中的内容应当是**自然的心理独白**——像一个高级工程师在脑中思考问题的真实过程：有犹豫、有对比、有否定、有回溯、有渐进式细化。**不是**结构化报告、不是 Q&A、不是角色分工文档。

## 输入

一个 case 目录，包含：

| 路径 | 必需 | 说明 |
|------|------|------|
| `meta.json` | 是 | case 元信息 |
| `01_pm/prd.md` | 是 | 产品规格 |
| `01_pm/requirement_breakdown.json` 或 `requirement_spec.json` | 是 | 需求拆解 |
| `01_pm/ia_structure.json` | 是 | 信息架构 |
| `02_designer/design_brief.md` | 是 | 设计方向 |
| `02_designer/design_system.json` | 是 | 设计系统 token |
| `02_designer/component_specs.json` | 否 | 组件规格 |
| `02_designer/visual_effects.json` | 否 | 动效策略 |
| `02_designer/style_research.md` | 否 | 风格调研 |
| `03_frontend/tech_decision.json` | 是 | 技术选型 |
| `03_frontend/self_review.json` | 否 | 自检报告 |
| `03_frontend/src/` | 是 | 前端源码 |

## 输出格式

输出 `<case_id>_long_chain.json`，标准 SFT 对话格式：

```json
{
  "conversations": [
    {
      "role": "user",
      "content": "帮我设计并实现一个智能家居控制面板..."
    },
    {
      "role": "assistant",
      "content": "<think>\n{自然语言推理独白，3000-8000字}\n</think>\n\n好的，我来为你实现这个应用。\n\n```tsx\n// src/main.tsx\n...\n```\n\n```tsx\n// src/App.tsx\n...\n```\n\n..."
    }
  ],
  "metadata": {
    "case_id": "string",
    "domain": "string",
    "pipeline_version": "string",
    "source_case": "outputs/v3-pipeline/<case_id>",
    "synth_method": "long-chain-reasoning-v2",
    "token_estimate": 30000,
    "stage_files_used": ["meta.json", "01_pm/prd.md", "..."]
  }
}
```

## 执行步骤

### Step 1: 读取全部 case 文件

读取输入表中列出的所有文件，以及 `03_frontend/src/` 下的全部 `.tsx/.ts/.css/.vue` 源码文件。

### Step 2: 构造 user prompt

从 `meta.json` 提取 `input_summary` + `domain`，改写为**自然的用户请求**。

要求：
- 第一人称（"帮我..."、"我需要..."）
- 描述核心痛点和期望效果
- 包含风格/视觉偏好（如有）
- 不含内部术语（pipeline_version、case_id 等不出现）
- 长度 80-200 字

### Step 3: 撰写 `<think>` 推理独白（核心步骤）

这是整条数据最关键的部分。从 pipeline 各阶段文档中**提取决策和推理依据**，重新组织为一段连贯的内心独白。

#### 写作风格要求

1. **第一人称心理独白**：「让我想想...」「首先需要搞清楚...」「嗯，这里有个问题...」
2. **自然的思维流**：不按 PM→Design→Tech 严格分阶段；决策交织出现，就像真实思考过程
3. **犹豫与比较**：「React 还是 Vue？考虑到需要 Framer Motion...」「等等，Redux 是不是太重了？」
4. **明确的否定推理**：「不用 Three.js，因为...」「GSAP 虽然强大但...」「Next.js 的 SSR 对这个场景完全多余」
5. **回溯与自我纠正**：「刚才想用纯 Context，但仔细想了下场景触发的复杂度...还是加个状态管理库」
6. **渐进式细化**：先粗略方向，再逐步深入细节
7. **情感化标记词**：「嗯」「啊对了」「等等」「有意思」「关键来了」「差点忘了」
8. **连贯过渡**（不用 markdown 标题分段，用自然过渡句）：「想清楚了需求，接下来是设计方向...」「设计大致有了底，来想想技术栈...」

#### 内容编排指南（不是严格顺序，允许交织和跳跃）

**需求理解阶段**（来源：meta.json, prd.md, requirement_spec/breakdown, ia_structure）
- 解读用户核心诉求
- 识别关键实体/数据模型
- MoSCoW 分级并解释每一级的取舍逻辑（为什么做/不做）
- 信息架构思考：「几个页面？怎么导航？为什么这样分？」
- 关键用户流推演

**设计思考阶段**（来源：design_brief, design_system, visual_effects, component_specs）
- 视觉方向选择：列出 2-3 个候选，说明为什么选中一个、放弃其他
- 配色决策推理：不是列 hex 值，而是「为什么是暗色？因为智能家居晚上用得多...」
- 交互亮点挑选：「这 5 个交互赌注值得做，因为...」
- 动效策略：「Canvas 还是 WebGL？CSS 能不能搞定？降级怎么办？」

**技术选型阶段**（来源：tech_decision, 结合上游设计约束）
- 框架选择的完整比较过程（不是直接给结果，而是展示比较过程）
- 每个关键库的采纳/拒绝推理
- 状态管理方案对比
- 性能策略思考
- 降级兜底方案

**实现规划阶段**（来源：代码结构 + self_review）
- 文件组织思路
- 关键难点预判
- 已知不足的诚实陈述

#### 关键约束

- **至少 5 个明确的否定决策**（放弃 X 因为 Y），自然嵌入独白中
- **至少 3 次犹豫/比较**（A 还是 B？→ 分析 → 选择）
- **至少 2 次回溯**（「等等，刚才那个想法不对...」）
- **不使用 markdown 标题**（## 阶段一 之类），只用段落分隔
- **不要 JSON 字段名出现在文本中**（不说 `must_have`，说「核心功能」）
- **长度 3000-8000 中文字符**

### Step 4: 组装 assistant 回复中的代码部分

`</think>` 之后的内容是 assistant 的正式回答。格式：

```
好的，我来为你实现这个{产品名}。以下是完整的前端代码：

```tsx
// src/main.tsx
{完整内容}
```

```tsx
// src/App.tsx
{完整内容}
```

...（所有源码文件，每个用独立代码块，注释标明路径）
```

包含 `03_frontend/src/` 下的**全部**源码文件。

### Step 5: 写入 JSON 文件

将 conversations 和 metadata 组装为最终 JSON。

## 质量检查清单

- [ ] `user.content` 读起来像真实用户请求，80-200 字
- [ ] `<think>` 块是连贯自然的独白，无 markdown 标题
- [ ] 有 ≥5 个否定决策自然嵌入
- [ ] 有 ≥3 次明确的对比/犹豫
- [ ] 有 ≥2 次回溯/自我纠正
- [ ] 包含情感化标记词（嗯、等等、让我想想、有意思...）
- [ ] `</think>` 后有全部源码文件
- [ ] 全文无 JSON 字段名泄露
- [ ] 总 token 量 15k-40k

## `<think>` 独白示例（片段）

```
让我仔细分析一下这个需求。用户想要一个智能家居中控应用，核心痛点是设备分散、操控路径太深、场景联动配置复杂。

首先搞清楚要管理什么——设备、房间、场景、能耗，四个核心实体。设备和房间是多对一关系，设备和场景是多对多。嗯，这意味着状态管理不会太简单。

哪些功能必须做？全屋仪表盘、设备卡片控制、场景一键触发、语音控制——这四个是核心闭环，少了任何一个产品就不完整。能耗统计也很重要，但优先级可以稍低。至于设备固件升级、帐号系统之类的...不做，这是原型阶段，加这些只会分散注意力。

导航怎么设计？手机屏幕小，底部 Tab 是最高效的触达方式；平板有宽度，可以用侧边栏；大屏更是要全景三列布局。嗯，混合导航方案。

想清楚了需求，来考虑视觉方向。用户说要"极简、色彩柔和、融合鸿蒙"。我脑中有三个方向——白底明亮极简？太普通了，跟米家没区别。纯紫蓝渐变玻璃态？太 SaaS 感了，不像家居。直接照搬 HarmonyOS？没有差异化。

啊，有个想法——暗色环境控制风格。智能家居晚上用得最多，暗色主题天然合适。而且设备"亮了"的时候卡片也发光，这种认知映射特别有意思...

等等，背景效果用什么方案？WebGL 能做出很炫的效果，但太重了——一个家居控制 App 用 Three.js？完全 overkill。纯 CSS 渐变又太死板。让我想想... Canvas 2D 配合 simplex noise！可以做缓慢流动的环境光，性能可控，而且降级方案简单——不支持的设备直接显示纯色背景就行。

技术栈方面...React 还是 Vue？这个应用的状态管理比较复杂，6 种设备类型各有不同的控制参数，场景触发需要按时序批量更新多个设备。React 的组件化配合 TypeScript 的类型系统，对这种多变体设备卡片的建模很友好。而且我想用 Framer Motion 做动画，这在 Vue 生态里没有对等的库。好，就 React + TypeScript + Vite。

状态管理呢？先想到 Redux...不，太重了，样板代码太多。Zustand？轻量好用，但场景触发需要一个状态机——TRIGGER_SCENE_START → 逐设备 SCENE_DEVICE_START → UPDATE → DONE → 最后 TRIGGER_SCENE_COMPLETE，这种多步 action 序列用 useReducer 的 dispatch 更自然。

嗯，那就分两层：设备核心状态用 Context + useReducer（因为需要复杂的 reducer 逻辑），全局 UI 状态（Toast、导航标签）用 Zustand（因为简单直接）。
```
