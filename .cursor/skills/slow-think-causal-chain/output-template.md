# 因果链输出模板

以下为单条因果链训练样本的 Markdown 渲染格式。实际输出为 JSON（见 SKILL.md schema），此模板用于人工审核和示意。

---

## `<original_prompt>`

> {用户的原始需求描述}

---

## `<causal_chains>`

### Chain 1: {anchor_question}

**类型**: {chain_type} | **极性**: {polarity} | **深度**: {depth} | **置信度**: {confidence}

```
因为 [用户需求] {content}
  ↓ 来源: {source}
→ 所以 [PM 决策] {content}
  ↓ 来源: {source}
→ 所以 [设计决策] {content}
  ↓ 来源: {source}
→ 所以 [技术决策] {content}
  ↓ 来源: {source}
→ 所以 [代码实现] {content}
  ↓ 来源: {source}
```

**对应代码**:
```typescript
// {filepath}
{3-10 行关键代码}
```

**关联文件**: `{file1}`, `{file2}`

---

### Chain 2: {anchor_question}
...

---

## 因果链示例（基于 010_meeting-collab）

### Chain: 为什么会议结束时有粒子聚合过渡动效？

**类型**: interaction | **极性**: positive | **深度**: 5 | **置信度**: high

```
因为 [用户需求] 用户要求「会后纪要自动生成」，存在从「会议进行中」到「纪要页面」的状态切换
  ↓ 来源: meta.json → input_summary

→ 所以 [PM 决策] PRD 定义了 user_flow「会议结束→纪要生成流」：点击结束 → AI 整理 → 跳转纪要视图
  ↓ 来源: 01_pm/ia_structure.json → user_flows[1]

→ 所以 [设计决策] 设计 brief 将此过渡定为核心交互节点：「粒子聚合让等待变成期待，将技术处理转化为仪式感」，持续 1500ms
  ↓ 来源: 02_designer/design_brief.md → 交互重点 #4, visual_effects.json → narrative_role

→ 所以 [技术决策] tech_decision 选择原生 Canvas 2D 粒子系统，拒绝 Three.js（过重），定义 meetingStatus: generating 触发条件
  ↓ 来源: 03_frontend/tech_decision.json → frontier_candidates_considered, interaction_hooks

→ 所以 [代码实现] ParticleConverge 组件：100 个粒子从四角汇聚至中心，1500ms ease-in-out，完成后 callback 切换到 MinutesView
  ↓ 来源: 03_frontend/src/generative/ParticleConverge.tsx
```

**对应代码**:
```typescript
// src/generative/ParticleConverge.tsx
useEffect(() => {
  const particles = Array.from({ length: 100 }, () => ({
    x: Math.random() * width, y: Math.random() * height,
    targetX: width / 2, targetY: height / 2,
  }));
  // ... RAF loop with eased progress over 1500ms
  const timer = setTimeout(() => onComplete?.(), 1500);
  return () => { cancelAnimationFrame(rafId); clearTimeout(timer); };
}, []);
```

**关联文件**: `src/generative/ParticleConverge.tsx`, `src/store/index.ts`, `src/views/MeetingView.tsx`

---

### Chain: 为什么没有真实的 WebRTC 音视频通话？

**类型**: constraint | **极性**: negative | **深度**: 3 | **置信度**: high

```
因为 [用户需求] 需求描述侧重 AI 会议协作的 UI 原型演示，未提及需要真实通话能力
  ↓ 来源: meta.json → input_summary

→ 所以 [PM 决策] PRD 将「真实 WebRTC 音视频通话」列入 out_of_scope，聚焦 UI 层体验演示
  ↓ 来源: 01_pm/requirement_breakdown.json → out_of_scope

→ 所以 [代码实现] 所有语音转写用 mockData 中的预定义文本 + setInterval 模拟流式输出，无任何音视频 API 调用
  ↓ 来源: 03_frontend/src/utils/mockData.ts, 03_frontend/src/views/MeetingView.tsx
```

**对应代码**:
```typescript
// src/utils/mockData.ts
export const mockTranscripts = [
  { speaker: '张明', text: '我们先讨论一下 Q2 的产品路线图...',  time: '14:02' },
  { speaker: '李华', text: '上季度的用户反馈显示...', time: '14:03' },
  // ...
];
```

**关联文件**: `src/utils/mockData.ts`, `src/views/MeetingView.tsx`

---

### Chain: 为什么选用冰蓝 #38bdf8 作为唯一强调色？

**类型**: visual | **极性**: positive | **深度**: 4 | **置信度**: high

```
因为 [用户需求] 要求「极简商务风、低饱和配色」，暗示高纯度色彩应极度克制
  ↓ 来源: meta.json → input_summary

→ 所以 [PM 决策] PRD 非功能需求写明「低饱和度配色，贴合 2026 办公协作美学」
  ↓ 来源: 01_pm/prd.md → 非功能需求

→ 所以 [设计决策] 设计系统定义单一冰蓝强调色 #38bdf8，仅用于主 CTA / AI 状态 / 激活态；rationale 写明「不要引入第二个高饱和色」
  ↓ 来源: 02_designer/design_system.json → color_palette.rationale, 03_frontend/tech_decision.json → brand_experience_notes

→ 所以 [代码实现] Tailwind 配置和 CSS 变量中 accent 色系仅有 #38bdf8 一个值，所有交互高亮统一使用
  ↓ 来源: 03_frontend/tailwind.config.js, 03_frontend/src/styles/globals.css
```

**关联文件**: `tailwind.config.js`, `src/styles/globals.css`, `src/components/TopBar.tsx`
