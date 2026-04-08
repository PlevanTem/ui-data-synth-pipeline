# PsychePath CME Navigator Design Brief

## 设计问题陈述
帮助高级临床心理学家 Dr. Aris Thorne 规划年度 CME（继续医学教育）时，通过个性化的技能雷达图和 3D 神经交互，直观地发现其在前沿人格理论与认证标准之间的知识缺口。该设计旨在将枯燥的“凑学分”流程，转化为充满科技感、沉浸感与定制掌控权的专属学术探索体验。

## 风格方向
Neon-Neural Scientific Dark Mode (深邃科研与霓虹神经高亮)
关键词：Premium (尊贵专业) / Clinical Tech (医疗科技) / Immersive (沉浸探索) / High-Contrast (高对比度聚焦)
选择理由：2026 年医疗科技 UI 趋势强调深色模式的专注力与专业性。为契合高级临床心理学家的学术权威身份，我们采用 `#09090B` 级别的偏暖黑锌色（Zinc-tinted near-black）作为底色，这种“Off-Black”能有效减少 OLED 屏幕上的眼睛疲劳。同时，采用高纯度的霓虹青（Cyan）与霓虹紫（Violet）作为特定脑区或图表的交互反馈色，使得界面具备强烈的未来科技感和探索深度。
为避免同质化刻意规避了什么套路：
- 拒绝纯黑背景（`#000000`），避免强烈的视觉断层感。
- 拒绝随处可见的大面积玻璃拟态（Glassmorphism），因为医疗数据密集型界面需要极高的可读性，过多的模糊处理会增加视觉噪音（Visual Noise）。
- 拒绝将霓虹色用于正文内容，仅作为点缀和交互状态的高亮（Contrast as Currency），避免“光污染”造成的视觉疲劳。

## 设计系统 Token

### 色彩
| 用途 | Token 名 | 值 |
|-----|---------|---|
| 最底层背景 | bg-base | `#09090B` (Zinc-tinted Near-Black) |
| 卡片/面板层 | bg-surface | `#18181B` (Zinc 900) |
| 悬浮/凸起层 | bg-elevated | `#27272A` (Zinc 800) |
| 边框与分割线 | border-subtle | `#3F3F46` (Zinc 700) |
| 主文本 | text-primary | `#F5F5F7` (Off-white，减少 Halation 晕影) |
| 次要文本 | text-secondary | `#A1A1AA` (Zinc 400) |
| 主品牌色/核心交互 | color-primary | `#00FCED` (Neon Cyan) |
| 次要高亮 (雷达/课程) | color-secondary | `#8B5CF6` (Neon Violet) |
| 成功/进度满 | color-success | `#e3fc02` (Neon Lime) |

### 排版
- 字体：`Space Grotesk`（提供前沿科技感，用于大标题与关键数值）, `Inter`（确保繁杂医疗数据的极致可读性，用于正文）
  （CDN: `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap`）
- h1 (Dashboard Title): `Space Grotesk`, 32px, Bold, tracking-tight
- h2 (Section/Card Title): `Space Grotesk`, 20px, SemiBold
- body (Content/Description): `Inter`, 14px, Regular, leading-relaxed (1.5)
- caption (CME hours, Labels): `Inter`, 12px, Medium, text-secondary

### 间距 / 圆角 / 阴影
| 属性 | Token / 像素值 | 说明 |
|-----|---------------|-----|
| 模块间距 | gap-8 (32px) | 保证高密度数据的呼吸感 |
| 内部留白 | p-6 (24px) | 卡片内部舒适的安全边距 |
| 圆角 | rounded-2xl (16px) | 现代温润感，削弱纯科技界面的冰冷感 |
| 交互阴影 | shadow-glow | `0 0 20px rgba(0, 252, 237, 0.15)`，用于 Hover 或 Focus 的霓虹呼吸发光 |

### 动效节奏
- 快速 (150ms): 微交互（Button Hover、拖拽抓手浮现），确保清脆的响应感。
- 正常 (300ms): 状态切换、Tooltip 浮出、课程列表淡入淡出更新。
- 慢速 (600-800ms): 页面入场（Staggered entrance）、雷达图生长渲染、总学时数字滚动。
- 缓动：`cubic-bezier(0.16, 1, 0.3, 1)`（平滑且干脆的科技感缓动曲线）。

## 组件规范

### 1. Skill-Gap Radar Chart (技能缺口雷达图)
- 作用：展示用户当前人格特质能力与认证目标的差距。
- 气质：精密、数据驱动。
- 状态：
  - default：当前分数为低透明度多边形（如 `color-primary` at 20% opacity），认证目标为描边高亮线条（`color-secondary`）。
  - hover (轴/数据点)：高亮当前轴的 Label，Tooltip 带有深色磨砂背景且数值颜色高亮。
  - loading：从中心点丝滑向外扩大的生长动画。
- 联动：独立展示全局状态，不直接被其他模块操作。

### 2. Interactive 3D Brain/Neural Model (3D 神经人格资源探索器)
- 作用：3D 交互点击触发，将不同人格特质领域映射至三维节点模型，直观呈现选课方向。
- 气质：前沿科技、赛博朋克医疗。
- 状态：
  - default：低亮度发光的深色网格模型，缓慢自转（0.002 rad/s）。
  - hover：脑区或节点产生 `color-primary` 的柔和光晕（Bloom）。
  - active/click：选中节点亮度增强，触发右侧课程列表更新。
- 联动：点击不同节点，触发数据过滤，右侧“课程列表”发生淡入淡出更新。

### 3. Draggable Course Card (拖拽式课程卡片)
- 作用：呈现课程信息池并允许拖拽入学习计划。
- 气质：轻盈、层次分明。
- 状态：
  - default：背景 `bg-surface`，边框颜色 `border-subtle`。
  - hover：边框变为 `color-primary` (低透明度)，略微上浮（`-translate-y-1`），右上角出现明确的拖拽把手图标（Grabber）。
  - dragging：缩放至 95%，阴影变为 `shadow-glow`，整体透明度降至 80%。
- 联动：拖入底部追踪器后，实时增加“总学时”。

### 4. Annual Learning Plan Tracker (年度学分追踪器 & 进度条)
- 作用：汇总已选课程，反馈学分累积进度（目标 50 小时）。
- 气质：成就感驱动、清晰明确。
- 状态：
  - default (未满)：进度条底色 `bg-elevated`，进度色 `color-primary`。
  - drop-zone hover：拖拽经过区域时，边框变为虚线并发光提示吸附。
  - filled (>= 50h)：进度条满时，颜色突变为 `color-success` (`#e3fc02`)，触发脉冲光晕特效（Pulse Glow）。底部的 CTA 生成按钮从 Disabled 态变为发光可点击态。
- 联动：跟随课程卡片的 Drop 事件，数字产生 Count-up 滚动增加动画。

## 页面交互清单
（Frontend 必须完整实现）

- [ ] 3D节点交互与内容联动：点击 3D 场景中的球体/脑区节点，右侧课程列表必须实现平滑的淡出后加载新数据的淡入效果。
- [ ] HTML5 原生拖拽（Drag and Drop）：左侧（或上方）课程池内的卡片必须可拖拽，当拖入底部的“年度计划区”并释放后，卡片在计划区内生成/追加。
- [ ] 动态学时累加与数字滚动：成功 Drop 课程后，读取卡片上的学时数据，触发总学时数字滚动动画（如 0 -> 15 -> 28），同时进度条宽度平滑增长。
- [ ] 目标达成状态与 CTA 解锁：当总学分达到或超过 50 时，触发庆祝视觉动效（进度条变色为 Neon Lime 并发光），“提交年度计划”按钮激活。
- [ ] 视差与节奏入场动效：页面加载时，Header、雷达图、3D 模型、课程列表、追踪器呈现带有时间差的依次渐显（Staggered entrance），避免全部瞬间生硬出现。

## 视觉特效方案

### 生成式视觉层 (3D Interactive Network)
- 技术：Three.js（CDN 引入，无需 npm）。
- 算法：3D Force-Directed Graph 视觉风格或粒子互联结构（Nodes and Edges），模拟神经突触网络。
- 区域：位于核心的“神经人格课程探索区”左侧占主导地位。
- 参数范围：节点数量 5-8 个核心区块，节点采用发光材质（MeshBasicMaterial 配合纯色），边缘连线透明度 0.3，自带缓慢的全局旋转。
- 与内容层关系：嵌入在独立的区块容器内，支持鼠标的 OrbitControls（拖拽旋转、缩放），不可遮挡右侧的文本列表层。
- CDN：
  - `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`
  - `https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js`

### 图表动效方案
- 雷达图：使用 Chart.js（或 ECharts CDN）。需开启初始化动画：`animation.duration: 1500`，`easing: 'easeOutQuart'`，确保其加载时由中心向外丝滑扩张。

### 降级策略
- 移动端/低性能设备：移除 Three.js 的 3D 模型渲染，直接降级为一组带有霓虹边框的 2D 互动标签云（Chips）；拖拽 API 交互由于在移动端体验差，需降级为卡片上的“+ 添加”按钮操作，点击直接将课程推入底部追踪器。

## Tailwind 配置（供 Frontend 直接使用）

```js
tailwind.config = {
  darkMode: 'class', // 强制开启暗黑模式配置
  theme: {
    extend: {
      colors: {
        base: '#09090B',
        surface: '#18181B',
        elevated: '#27272A',
        subtle: '#3F3F46',
        primary: '#00FCED', 
        secondary: '#8B5CF6', 
        success: '#e3fc02', 
        textPrimary: '#F5F5F7',
        textSecondary: '#A1A1AA'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif']
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(0, 252, 237, 0.15)',
        'glow-success': '0 0 25px rgba(227, 252, 2, 0.25)',
      },
      transitionTimingFunction: {
        'tech': 'cubic-bezier(0.16, 1, 0.3, 1)',
      }
    }
  }
}
```

## 禁止事项
- 严禁使用纯黑背景（`#000000`）和无意义的全局发光，避免丧失医疗工具的专业严谨性。
- 严禁对正文段落使用霓虹色，Paragraph/Body 文本必须保持 `#F5F5F7` 或 `#A1A1AA` 以确保长时间阅读的可用性。
- 严禁大面积滥用 Glassmorphism（毛玻璃效果），在数据密度 high 的场景会严重干扰用户注意力。
- 严禁依赖任何 React/Vue 等现代前端框架构建最终组件。本案管线必须由纯 HTML + 内部 `<style>` + 原生 `<script>` + Tailwind CDN + 第三方功能库 CDN 拼装组成单文件交付。
