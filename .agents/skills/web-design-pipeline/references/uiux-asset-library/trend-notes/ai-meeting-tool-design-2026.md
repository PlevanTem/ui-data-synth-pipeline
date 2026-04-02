# AI 会议工具视觉语言 2026

**来源 Case**：010_meeting-collab  
**适用场景**：AI 驱动的生产力工具，会议协作、语音记录、智能整理类产品

---

## 核心趋势观察

### 1. "流式文字"成为 AI 工具视觉标配
- 文字逐字出现的打字机效果（charDelay: 30-50ms）已成为 AI 实时处理的强信号
- 与普通滚动文字的区别：每字携带微小 opacity + translateY 动效，暗示"正在生成"而非"已加载"
- 场景：实时转写、AI 摘要、文本生成类产品均适用

### 2. 声波可视化是"AI 正在监听"的首选隐喻
- Canvas 条形声波（32-48条），绑定"是否有人在说话"状态，振幅差异 3-5倍
- 颜色：与品牌强调色统一，opacity 动态变化提升感知深度
- 替代方案：SVG 路径波形（轻量但可控性差）；最小版本：3-5个跳动小圆点

### 3. 低饱和度系统色 + 单一强调色
- 2026 趋势：去掉"渐变科技色"，转向单色强调（冰蓝/翡翠绿/琥珀）
- 深石板暗色（#0a0f1e / #111827）+ 冰蓝 (#38bdf8) 是成熟度最高的组合
- 双主题需求：暗色优先设计，亮色作为辅助

### 4. AI 处理过渡需要"仪式感"
- 会议结束→纪要生成：用户等待 1-3 秒，需要视觉填充
- 粒子聚合（汇聚至中心）是传达"信息正在凝聚"的有效隐喻
- 对比普通 spinner：粒子动效更有情感张力，不焦虑

---

## 不适用场景

- 消费品品牌（暗色系可能过于冷峻）
- 儿童或娱乐产品（缺少温暖感）
- 需要极高信息密度的财务/法律工具（声波会分散注意力）

---

## 结构化标签

```
style_keywords: ["deep-slate", "ice-blue-accent", "ai-streaming", "minimal-dark", "workflow-focused", "harmonyos-inspired"]
interaction_level: "medium-high"
visual_primitives: ["depth", "glow-accent", "grid", "wave"]
motion_primitives: ["stream", "pulse", "converge", "spring-transition", "stagger"]
uiuxmax_domains: ["style", "color", "ux", "stack"]
suitable_products: ["AI assistant", "meeting tool", "voice recorder", "productivity SaaS"]
avoid_patterns: ["purple-blue-gradient", "glassmorphism", "neon-glow", "centered-hero-3card"]
```
