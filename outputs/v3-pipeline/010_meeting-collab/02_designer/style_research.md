# Style Research: 鸿蒙 AI 会议协作应用

## 一、设计问题定义

**核心设计挑战**：如何在"信息密集型协作工具"的框架下，传达 AI 辅助的高效感、鸿蒙多设备流转的空间感，以及简洁有序的办公美学——而不落入普通企业软件的呆板模板或过度科技感的堆料陷阱。

关键张力：
- 信息密度高（转写流、摘要、任务列表）vs 视觉呼吸感
- 商务克制 vs 有辨识度的设计语言
- AI "智能感" vs 不打扰的工具性体验
- 鸿蒙分布式特色 vs Web 技术限制

---

## 二、趋势扫描结果

### 主轨道判断
本案属于**办公效率工具 + AI 智能应用**，主轨选用：**企业功能轨（Business Tool Track）**，辅以新视觉实验轨中的"轻量生成式增强"策略。

### 趋势信号提炼

**信号 1：去饱和度系统（2026 主流方向）**
- 低饱和度色系（Slate 蓝灰、暖石板灰、深炭黑）主导专业工具 UI
- 单一强调色（绿/琥珀/冰蓝）作为行动/状态信号
- 82.7% 桌面用户偏好暗色模式，需要出色的暗色方案
- 参考配色：`#1e293b` / `#0f172a` / `#38bdf8`（冰蓝强调）

**信号 2：面向 AI 工具的"实时流式"视觉语言**
- 文字逐字出现的打字机动效已成为 AI 工具标配
- "正在生成"状态需要非阻塞、低干扰的加载指示
- 内容边界的模糊渐淡（gradient fade）暗示"还在生成中"
- 侧边栏摘要面板：卡片+高亮段落+彩色标记是主流

**信号 3：鸿蒙 ArkUI 设计语言**
- 模块化卡片布局，边界清晰不模糊
- 系统级动效：弹性过渡（spring curve）优于线性 ease
- 多设备适配：折叠屏/平板/大屏采用"分栏-合并"响应式策略
- 布局偏向网格对齐，负空间克制但充足

**信号 4：数据可视化微型化趋势**
- Dashboard 中的数据不依赖大图表，而是用迷你 sparkline + 数字 + 状态色快速传递
- 会议参与者状态用头像网格 + 状态圈，而非全屏视频格
- 纪要结构化展示倾向"文档感"而非"PPT 感"

**信号 5：Canvas 细粒度动效增强**
- 办公工具不适合 WebGL 全屏 shader 特效，但"超轻量"的 canvas 纹理层有辨识度
- 例如：转写进行中的"声波可视化"；AI 生成时的"粒子汇聚"微动效
- 这些效果要服务功能叙事，而不是独立的艺术展示

---

## 三、Generative 视觉与代码艺术调研发现

### 适用于本案的 Generative 策略

**策略 A：声波可视化（Audio Waveform Canvas）**
- 会议转写面板底部或侧边栏的实时声波动效（SVG 或 Canvas）
- 算法：简化版 FFT 模拟或噪声驱动的平滑波形
- 美学参考：Otter.ai、Whisper 的波形 UI、Notchworkq.ai

**策略 B：AI 生成时的粒子聚合动效（Particle Convergence）**
- 纪要生成过程：粒子从转写面板"飞向"纪要标题区
- Canvas 粒子系统，生命周期约 1.5s
- 目的：让 AI 处理过程变得可感知、有趣、不焦虑

**策略 C：呼吸感脉冲圆（Breathing Pulse）**
- 当某人正在发言时，头像周围出现低频 SVG 脉冲环
- 算法：CSS keyframe / SVG animate，不需要 Canvas
- 效果：立体感 + 发言状态可视化

**策略 D：流式文字涌现（Streaming Text Effect）**
- 转写面板的逐字出现动效，带轻微的 opacity 渐变
- CSS animation + React state 驱动，性能轻量

### 组合方案决策
- 主视觉层：CSS 动效 + SVG 微交互（克制、服务功能）
- 增强层 A：Canvas 声波可视化（会议进行中视图）
- 增强层 B：粒子聚合动效（纪要生成过渡）
- 不使用 WebGL 全屏 shader（与产品定位不符、影响性能）

---

## 四、方向发散（三个方向）

### 方向 1：鸿蒙纯正派（保守高完成度）
**关键词**：模块卡片 / 系统蓝 / 线性图标 / 清爽留白
**视觉信号**：ArkUI 官方示例的清爽感，类 iOS 的精致系统感
**Generative 策略**：仅 CSS 微动效，声波用简单 SVG 绘制
**交互语言**：弹性过渡、模块展开收起、卡片悬停浮起
**适配原因**：风险最低，用户最易接受，贴合鸿蒙品牌
**潜在风险**：辨识度低，与竞品（钉钉/飞书/Teams）高度相似
**为什么可能不选**：同质化风险最高，设计价值输出有限

### 方向 2：极简暗夜工作流（主推方向）
**关键词**：深石板暗色 / 冰蓝强调 / 流式文字 / Canvas 声波 / 沉浸专注感
**视觉信号**：深 `#0f172a` 底色 + `#38bdf8` 冰蓝信号色 + 暖白字体
**Generative 策略**：Canvas 声波可视化 + 粒子聚合纪要生成动效 + SVG 脉冲发言状态
**交互语言**：流式文字动效、侧边抽屉、模态聚焦、渐进信息展开
**适配原因**：
  - 82%+ 用户偏暗色模式
  - 深底色更突出 AI 实时信息流（对比度自然形成焦点）
  - 声波/粒子动效与"AI 处理"叙事完美契合
  - Canvas 视觉增强服务于功能状态，不是纯装饰
**潜在风险**：亮色模式需要独立设计，工作量增加
**差异化**：转写中的声波层 + 纪要生成时的粒子聚合动效是独特 signature

### 方向 3：文档感 + 数据诗意（实验方向）
**关键词**：Notion 级文档美学 / 数据散点微图 / 温纸感色调 / 纪要第一视角
**视觉信号**：暖米白底色 + 深棕字 + 信息密度对齐文档级排版
**Generative 策略**：D3.js 微型数据可视化（会议时长分布/发言占比）
**交互语言**：块状编辑、拖拽重排、展开折叠
**适配原因**：差异化最大，纪要体验最突出
**潜在风险**：与"多设备协作"卖点结合感弱，在会议进行中视图较弱
**为什么可能不选**：不够体现鸿蒙分布式/多端特色

---

## 五、最终选型及原因

**选择：方向 2 —— 极简暗夜工作流**

选择原因：
1. **用户行为贴合**：会议通常在多屏、长时工作环境下，暗色模式减少眼部疲劳
2. **AI 感最强**：深底色 + 流式文字 + 声波可视化是"AI 正在工作"的最强视觉叙事
3. **多设备场景**：暗色更适合智慧屏投屏场景，屏幕上的效果更佳
4. **Generative 价值最高**：声波 Canvas + 粒子动效与产品功能深度绑定，不是装饰
5. **差异化最明确**：与飞书/钉钉的"亮色 + 蓝色系统"构成明确区隔

**同时提供亮色模式**，因为 PRD 中要求主题切换，两套主题共存。

---

## 六、动态交互策略

- **流式文字动效**：转写面板逐字出现，每字 delay 30-50ms，带微小 opacity 0→1
- **声波 Canvas**：会议进行中，实时绑定到 "发言人状态" mock 数据，波形随讲话起伏
- **粒子聚合动效**：会议结束→纪要生成过渡，Canvas 粒子从四角聚合至中心，持续 1.5s
- **弹性过渡**：侧边导航展开收起用 spring curve (stiffness: 300, damping: 30)
- **模态叠加层**：背景 blur + 渐入动效，移动端底部抽屉

---

## 七、为避免同质化规避的套路

| 禁止 | 原因 |
|------|------|
| 紫蓝渐变背景 | 过于科技模板化，与产品工具性不符 |
| 半透明玻璃卡片满铺 | 影响信息可读性，在会中视图尤其危险 |
| 居中大标题 + 3 卡片 | 这是 landing page 结构，不是 app shell |
| 过多发光 Glow 效果 | 分散注意力，在转写密集文字旁更显凌乱 |
| 只用粒子背景 | 单一视觉手法，与会议协作功能叙事脱节 |

---

## 八、可沉淀资产建议

1. **trend-notes/**：`ai-meeting-tool-design-2026.md` — AI 工具的"流式文字+声波可视化"视觉语言
2. **palette-strategies/**：`deep-slate-ice-blue-productivity.md` — 深石板暗色 + 冰蓝强调的生产力工具配色
3. **motion-patterns/**：`streaming-text-reveal.md` — 流式文字出现动效模式
4. **generative-recipes/**：`canvas-waveform-meeting.md` — 声波 Canvas 的参数化实现策略

---

## 九、视觉信号映射回结构化风格库

```
style_keywords: ["deep-slate", "ice-blue-accent", "ai-streaming", "minimal-dark", "harmonyos-inspired", "workflow-focused"]
interaction_level: "medium-high"
visual_primitives: ["depth", "glow-accent", "grid", "field"]
motion_primitives: ["stream", "pulse", "converge-particles", "spring-transition"]
generative_primitives: ["waveform-canvas", "particle-system", "noise-field"]
implementation_hints: ["Canvas 2D API", "CSS animation", "SVG animate", "React spring"]
uiuxmax_domains: ["style", "color", "ux", "stack"]
suitable_stacks: ["react+ts", "vue+ts"]
avoid_patterns: ["purple-blue-gradient", "glassmorphism-cards", "centered-hero-3card", "neon-glow"]
```
