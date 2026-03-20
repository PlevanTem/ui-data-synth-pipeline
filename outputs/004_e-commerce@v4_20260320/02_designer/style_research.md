# CrossBorder Graph Commerce - Style Research

## 设计问题定义
这个产品需要让跨境购物用户在“高信息密度 + 移动端小屏”的压力下，仍能快速完成可信决策。设计核心挑战是：在 premium 质感与高可读性之间保持平衡，并把图谱探索、筛选联动、结账反馈做成同一套连贯的交互语言，而非分裂的功能块。

## 设计语言翻译（PM -> Design）
- `emotional_goal`: 冷静、精致、可信 -> 低饱和冷色底 + 玻璃材质 + 明确层级对比。
- `information_density=high`: 使用可折叠信息层和语义分组，避免卡片堆砌。
- `interaction_depth=immersive`: 必须有真实状态通信（图谱<->筛选<->结果<->结账）。
- `visual_trust_level=premium`: 视觉细节强调材质精度与动效节奏，而非高饱和炫光。
- `trust_signals_needed=true`: 关键风险信息以文字+图标双编码，不能只用颜色提示。

## 实时趋势检索证据（WebSearch）
### 主流方向（UI/UX 数字产品轨）
1. Awwwards Annual Awards 2025：高分作品普遍使用 WebGL、微交互和节奏化动效，电商获奖案例强调“交互驱动内容理解”而非静态陈列。
2. CSS Design Awards 互动类案例：3D showroom、动效型 Shopify 站点（Three.js + 滚动编排）成为“高质感电商体验”的常见路径。
3. Framer Commerce 2025-2026 更新：设计驱动型电商强调内容与交互同构，适合高辨识度品牌体验。

### 新兴信号（跨轨补充）
1. OpenProcessing Flow Field 相关案例：流场粒子被广泛用于“可感知但不抢内容”的氛围层。
2. Observable D3 Force Graph：关系图的可交互节点拖拽、聚焦和时间演化是图谱可读性的关键模式。

## Generative 视觉与代码艺术调研发现
- 可用算法族群：flow-field（背景气流）、particle-system（焦点扩散）、force-directed graph（关系探索）、noise perturbation（玻璃噪声纹理）。
- 可迁移美学：低对比玻璃折射 + 局部高亮节点脉冲；用运动方向表达“搜索收敛”而非随机炫动。
- 交互映射建议：
  - 搜索词输入 -> 背景流场速度短时增大后归稳；
  - 节点 hover/click -> 粒子朝目标节点汇聚并显示关系标签；
  - 筛选变更 -> 图谱边透明度和列表卡片重排同步动画。
- 组合策略优先级：Canvas 流场背景 + WebGL 图谱主层 + CSS/Framer 微交互前景。

## 三个探索方向
### A. 保守高完成度：Crisp Commerce Glass
- 关键词：clear glass, dense cards, trust labels, structured motion
- 视觉信号：系统化磨砂卡片 + 高可读文本层
- generative 策略：仅轻量流场背景
- 风险：差异化不足，容易接近通用 SaaS 模板
- 不选主因：无法充分体现图谱与叙事优势

### B. 主推方向：Graph Frost Navigator（最终选择）
- 关键词：frosted depth, graph focus, semantic motion, trust overlays
- 视觉信号：中景图谱 + 前景结果卡 + 背景流场
- generative 策略：WebGL 图谱主层 + Canvas 流场副层 + SVG 关系高亮
- 交互语言：筛选与图谱双向联动，节点聚焦驱动详情变化
- 风险：移动端性能压力
- 选型理由：最匹配 M01/M02/M05 的交互红线和 premium 目标

### C. 实验高识别：Iridescent Commerce Atlas
- 关键词：chromatic blur, 3D tilt, narrative scroll, liquid transitions
- 视觉信号：强材质与叙事滚动
- generative 策略：shader 主导 + 滚动章节
- 风险：可读性与可访问性风险高
- 不选主因：对交易流程有干扰，不利于高密度信息扫描

## 最终选型与去同质化策略
- 最终方向：`Graph Frost Navigator`
- 刻意规避：紫蓝渐变铺满、居中大标题+三卡模板、过度发光玻璃拟态。
- 差异化点：把“图谱关系探索”作为核心 UI 骨架，而非装饰模块；将信任信号与筛选行为绑定到同一交互回路。

## 动态交互策略
- 节奏层级：背景慢速（氛围）< 中景中速（图谱响应）< 前景快速（表单/按钮反馈）。
- 转场规则：所有关键状态切换 180-320ms；图谱聚焦 420-560ms；遵循 `prefers-reduced-motion`。
- 状态统一：loading/error/empty 同样使用玻璃材质与图标语义，不降级为默认浏览器视觉。

## 可沉淀资产建议
- 建议沉淀到 `generative-recipes/`：`ecommerce-graph-frost-flowfield.md`
- 结构化映射：
  - style_keywords: frosted-depth, semantic-graph, trust-layered-commerce
  - interaction_level: immersive
  - visual_primitives: glass, field, depth, graph, glow
  - motion_primitives: pulse, flow, scroll-sync, focus-zoom
  - implementation_hints: React + TS, canvas flowfield, WebGL graph, Framer Motion
