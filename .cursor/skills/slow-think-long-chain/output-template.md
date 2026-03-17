# 长链推理输出模板

以下为单条慢思考训练样本的 Markdown 渲染格式。实际输出为 JSON（见 SKILL.md schema），此模板用于人工审核和示意。

---

## `<original_prompt>`

> {用户的原始需求描述，纯自然语言。}
> 例：「创建一个鸿蒙原生 AI 会议协作应用，支持多设备一键入会、实时语音转写、多语言翻译、会后纪要自动生成、任务待办同步。界面风格为极简商务风，低饱和配色。」

---

## `<reasoning_chain>`

### 阶段一：需求分析与问题定义

**核心问题**
{1-2 句话概括这个产品要解决什么问题。}

**目标用户**
{列出用户类型及其核心诉求，不超过 3 类。}

**功能优先级划分**
我需要对功能做 MoSCoW 分级——
- **必须做（P0）**：
  - {功能1}——{为什么是 P0 的 1 句话理由}
  - {功能2}——{理由}
  - ...
- **应该做（P1）**：
  - {功能}——{理由}
- **锦上添花（P2）**：
  - {功能}——{理由}
- **明确不做**：
  - {排除项}——{为什么排除}

**信息架构决策**
基于上述需求，导航采用 {navigation_model}，理由是 {reason}。
核心页面划分：
- {section.id}：{section.purpose}（{section.priority}）
- ...

关键用户流：
1. {user_flow.name}：{steps 摘要}
2. ...

**风险与开放问题**
- {risk/question}

---

### 阶段二：设计决策

**视觉方向选择**
用户要求「{用户原文中的风格关键词}」，因此视觉方向定为 {design_direction}——
- 主色调：{color} 理由：{rationale}
- 强调色：{color} 理由：{rationale}
- 字体：{font}
- 整体气质：{keywords}

**布局策略**
考虑到 {产品场景/多端需求}：
- 桌面端：{layout}
- 平板端：{layout}
- 手机端：{layout}

**核心交互设计**
以下交互是体验的关键赌注：
1. {交互1}——值得做因为 {reason}
2. {交互2}——值得做因为 {reason}
3. ...

**动效与生成式视觉**
{为什么用/不用某类动效的推理}。
采用的视觉模块：
- {effect_name}：用于 {purpose}，技术方案 {tech}
- ...

组合逻辑：{combination_rationale}

降级策略：
- {effect} 不可用时 → {fallback}

---

### 阶段三：技术选型与实现策略

**技术栈选择**
选用 {selected_stack}，主要考虑：
- {reasoning_point_1}
- {reasoning_point_2}

考虑过但放弃的方案：
- {alternative_1}：放弃因为 {reason}
- {alternative_2}：放弃因为 {reason}

**关键库选择**
| 库 | 采纳/拒绝 | 理由 |
|----|-----------|------|
| {lib_name} | 采纳 | {reason} |
| {lib_name} | 拒绝 | {reason} |

**状态管理与数据流**
{state_management 方案}。原因：{reason}。
数据流：{data_flow 摘要}。

**性能红线**
- {guardrail_1}
- {guardrail_2}

**降级兜底**
- {fallback_1}
- {fallback_2}

---

### 阶段四：实现自检与反思

**完成度**
- 已完成：{completed_items 摘要}
- 交互完整性：{interaction_completeness 各维度}

**已知不足**
- {gap_1}
- {gap_2}

**如果有更多时间，下一步应该**：
- {next_fix_1}
- {next_fix_2}

---

## `<final_code>`

```
// --- filepath: src/main.tsx ---
{main.tsx 完整内容}

// --- filepath: src/App.tsx ---
{App.tsx 完整内容}

// --- filepath: src/views/DashboardView.tsx ---
{DashboardView.tsx 完整内容}

// ... 其余核心文件 ...
```
