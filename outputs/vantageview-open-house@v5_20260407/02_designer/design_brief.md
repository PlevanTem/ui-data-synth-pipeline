# VantageView Design Brief

## 设计问题陈述

这个产品需要让 Sarah（奢侈物业经纪人）在「掌控感 + 精致仪式感」的情绪状态下，完成主题开放日排期、预览空间氛围、分析买家参与趋势三项核心任务。核心挑战是：工具类产品（日历/仪表盘）天然有SaaS工具感，但本产品的服务对象是奢侈地产，必须建立「建筑事务所数字报告」级别的视觉信任。交互上需要支撑 immersive 密度的操作流，特别是 Atmosphere Slider 必须带来真实的光色感官体验。

---

## 风格方向

### 主方向：Temporal Architecture（时间建筑）

**关键词**：Editorial Luxury / Chromatic Time / Ambient Intelligence / Architectural Restraint / Warm Darkness

**选择理由**：
- 2026年Behance奢侈地产最新案例（Veloria Estates, Feb 2026）证实「暗底+金色+电影感+编辑排版」是高端买家心智认同的视觉语言
- Awwwards Living Canvas项目直接验证了「时间驱动的Canvas动态光效」作为主视觉是可行且被认可的设计语言
- Woodlight (Awwwards HM Jun 2025) 的 `#09101E` 深色底+响应式shader证明了沉浸暗色UI在2025-26年的前沿位置
- 「时间」是本产品的核心维度（Atmosphere Slider = 6AM→10PM），将时间轴作为全局设计语言，使工具功能与视觉体验高度融合

**核心视觉理念**：
> UI本身是一扇随时间变化的落地大窗。不同时刻，窗内光线温度不同，映射不同主题的情绪频率。

**刻意规避的套路**：
- ❌ 紫蓝渐变 + 玻璃拟态卡片（SaaS通病）
- ❌ 居中大标题 + 三栏等高卡片（模板化）
- ❌ Space Grotesk / Inter 等科技字体（SaaS感强）
- ❌ 亮白底色（失去空间沉浸感）
- ❌ 霓虹发光效果（破坏奢侈克制感）

---

## 设计系统 Token

### 色彩

| 用途 | Token 名 | 值 |
|-----|---------|---|
| 全局背景 | bg-void | #0A0907 |
| 表面层 | bg-surface | #14120E |
| 卡片/面板 | bg-panel | #1C1914 |
| 卡片悬停 | bg-panel-hover | #242018 |
| 边框微妙 | border-subtle | #2C2820 |
| 边框明显 | border-muted | #3E3830 |
| 主文字 | text-primary | #F2EADB |
| 次要文字 | text-secondary | #9E9080 |
| 辅助文字 | text-tertiary | #5E5548 |
| 金色强调 | accent-gold | #C8924A |
| 金色亮面 | accent-gold-bright | #E5B870 |
| 金色暗面 | accent-gold-dim | #7A5830 |

**主题动态色**（随选中主题联动全局氛围）：

| 主题 | 主色调 | 光晕色 |
|------|--------|--------|
| Golden Hour | #F4A32A | rgba(244,163,42,0.08) |
| Midnight Modern | #3B5998 | rgba(59,89,152,0.10) |
| Festive | #C8252D | rgba(200,37,45,0.08) |
| Sunset Soirée | #E8622A | rgba(232,98,42,0.08) |
| Holiday Home | #2E7D4F | rgba(46,125,79,0.08) |

### 排版

- **主字体**：Cormorant Garamond（Google Fonts CDN）— 衬线体，高对比度，建筑事务所官网感
- **辅字体**：DM Mono（Google Fonts CDN）— 等宽数据字体，用于数字/时间/标签

```
h1: Cormorant Garamond 56px / 700 / lh 1.1 / ls -0.02em
h2: Cormorant Garamond 36px / 600 / lh 1.2 / ls -0.01em
h3: Cormorant Garamond 24px / 500 / lh 1.3
body: Cormorant Garamond 16px / 400 / lh 1.6
label/caption: DM Mono 12px / 400 / lh 1.4 / ls 0.08em / uppercase
data: DM Mono 20px / 500
```

**Type Scale**：Major Third × 1.25，最多3种字号同时出现于同一区块

### 间距 / 圆角 / 阴影

| 名称 | 值 |
|-----|---|
| 基准单位 | 8px |
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 40px |
| 2xl | 64px |
| 3xl | 96px |
| 圆角 sm | 4px |
| 圆角 md | 8px |
| 圆角 lg | 12px |
| 圆角 full | 9999px |
| shadow-card | 0 1px 3px rgba(0,0,0,0.4), 0 8px 32px rgba(0,0,0,0.3) |
| shadow-modal | 0 24px 80px rgba(0,0,0,0.7) |

### 动效节奏

- **快速 (80-120ms)**：hover color change, button focus, icon state
- **正常 (250-350ms)**：卡片展开/收起, 筛选联动, toast in/out
- **慢速 (500-700ms)**：视图切换 fade, 主题全局色切换, 入场动画
- **缓动**：
  - UI交互：`cubic-bezier(0.25, 0.46, 0.45, 0.94)` (easeOutQuad)
  - 入场：`cubic-bezier(0.16, 1, 0.3, 1)` (easeOutExpo)
  - 主题切换：`cubic-bezier(0.4, 0, 0.2, 1)` (standardEase)

---

## 组件规范

### 顶部导航
- **作用**：品牌锚点 + 三视图入口
- **气质**：极简横条，深色底，金色细线分隔，logo用Cormorant Garamond小帽
- **状态**：default（文字 text-secondary）/ active（文字 text-primary + accent-gold 细底线）/ hover（text-primary 过渡150ms）
- **联动**：点击切换 `activeView` 状态，内容区淡入淡出

### Atmosphere Canvas 区（首屏主视觉）
- **作用**：Atmosphere Slider的视觉输出，是产品的感官核心
- **气质**：接近3:1宽高比的全宽Canvas区，内部渲染光感氛围
- **Canvas实现**：
  - 用Canvas 2D绘制多层渐变场模拟室内空间光感
  - 底层：深色地板/墙壁暗部（固定）
  - 中层：随时间变化的光柱（模拟侧窗投影角度）
  - 顶层：空气散射光（噪声颗粒叠加，透明度低）
  - 时间映射：[0=6AM, 1=22PM] → 色温从 #B8CCE8(晨) → #F9D78C(正午) → #F4A32A(黄金) → #E8622A(落日) → #3B4F8A(暮) → #1A2040(深夜)
- **状态**：随 Slider 实时更新（requestAnimationFrame）
- **联动**：当前时段自动推荐最接近的主题

### 时间滑块（Atmosphere Slider）
- **作用**：用户拖拽预览6AM-10PM的空间氛围
- **气质**：细轨迹 + 金色圆形拖把手，时间刻度用DM Mono显示
- **状态**：idle（轨迹色 border-muted）/ dragging（轨迹色 accent-gold + 光晕）
- **联动**：实时触发Canvas重绘 + 当前时间标签更新 + 主题推荐更新

### 主题卡片（Theme Cards）
- **作用**：展示5种主题，让用户选择活跃主题
- **气质**：横向排列卡片，每张有色块预览（模拟光感swatch）+ 主题名 + 3个氛围关键词
- **状态**：default / hover（微上移 -2px + shadow增强）/ selected（金色细边框 + 主题色微渐变背景）
- **联动**：选中后触发全局主题色切换（CSS变量更新）+ Canvas色调更新

### 月历（Calendar）
- **作用**：Sarah选择日期并绑定主题
- **气质**：紧凑月历格，日期格用bg-panel，已排期日期有主题色小圆点标记
- **状态**：default（bg-surface）/ hover（bg-panel）/ selected（accent-gold细边框）/ scheduled（主题色小圆标注）
- **联动**：点击日期打开右侧排期面板

### 排期面板（Scheduling Panel）
- **作用**：为选定日期分配主题
- **气质**：右侧滑入抽屉或右列固定面板
- **状态**：empty（空状态：「选择日期开始排期」）/ editing（主题下拉 + 时间段选择 + 保存按钮）/ saved（green tick + toast）
- **联动**：保存后日历对应格更新圆点 + toast弹出

### 分析图表（Analytics Charts）
- **作用**：展示主题参与热度趋势
- **气质**：深色底Chart.js，细线图，柱状图，颜色映射主题色
- **状态**：loading（骨架屏）/ loaded（动效入场）/ filtered（筛选后重新渲染）
- **联动**：主题筛选器影响图表数据 + KPI数字更新

### Toast 通知
- **作用**：操作反馈
- **气质**：右下角滑入，深色底，金色边框细线，DM Mono文字
- **状态**：success（绿色指示）/ error（红色）/ 3秒自动消失

---

## 页面交互清单

（Frontend 必须完整实现）

- [x] 导航点击：切换 Schedule / Preview / Analytics 三个视图，有淡入淡出过渡
- [x] Atmosphere Slider 拖拽：实时更新Canvas渲染 + 时间标签 + 推荐主题
- [x] 主题卡片点击：选中高亮 + 全局主题色CSS变量切换 + Canvas氛围跟随更新
- [x] 日历日期点击：高亮选中 + 展示右侧排期面板
- [x] 日历主题分配：下拉选择主题 + 保存按钮 → 日历格圆点更新 + Toast通知
- [x] Analytics 主题筛选器：点击标签实时更新趋势图和柱状图
- [x] Intersection Observer：内容区块滚入时触发入场动画
- [x] 移动端 Hamburger Menu：打开/关闭动画

---

## 视觉特效方案

### 生成式视觉层 — Atmosphere Canvas

- **技术**：Canvas 2D（原生 API，无需额外CDN）
- **算法**：
  - 多层径向渐变模拟光源（主光：侧窗光柱；次光：反射漫射）
  - 时间映射的色温曲线（6AM冷蓝 → 正午暖白 → 黄金时段琥珀 → 日落橙红 → 深夜深蓝）
  - 细颗粒噪声层（`Math.random()` 点阵，透明度3-8%，模拟空气感）
  - 光晕过渡：线性插值（lerp）在不同时段色彩之间平滑过渡
- **区域**：Preview 视图首屏 full-width Canvas（约 60vh 高）
- **参数范围**：
  - 光柱透明度：0.08–0.28（随时间变化）
  - 颗粒密度：600–1000点
  - Canvas framerate：只在滑动时rerender（非持续requestAnimationFrame，节省性能）
- **与内容层关系**：Canvas在背景层，时间标签和主题推荐文字在Canvas前景叠加层（z-index区分）
- **CDN**：无需额外CDN，原生Canvas 2D

### 数据可视化层

- **技术**：Chart.js CDN
- **CDN**：`https://cdn.jsdelivr.net/npm/chart.js`
- **图表**：
  1. Line Chart：30天参与趋势（按日期）
  2. Bar Chart：5个主题参与人次对比
- **配色**：主题色映射（Golden Hour=#F4A32A, Midnight=#3B5998, Festive=#C8252D, Sunset=#E8622A, Holiday=#2E7D4F）
- **入场动效**：Chart.js 内置 animation: { duration: 600, easing: 'easeOutQuart' }

### 动效方案

- **入场动画**：`IntersectionObserver` + CSS `opacity: 0 → 1` + `translateY(20px → 0)`，delay 错开（0/100/200ms）
- **主题色切换**：CSS custom properties (`--theme-accent`, `--theme-glow`) 通过 JS 设置到 `:root`，transition 600ms
- **视图切换**：`opacity` + `transform: translateY(8px→0)` 500ms easeOutExpo
- **Toast**：`translateX(120% → 0)` 滑入，3秒后 `translateX(120%)` 滑出
- **日历格标记**：选中时小圆点 scale(0→1) 弹入，240ms

### 降级策略

- Canvas不可用时：用纯CSS渐变背景模拟氛围色块
- Chart.js加载失败时：显示静态数据表格
- 动效：`prefers-reduced-motion` 媒体查询下关闭所有过渡

---

## Tailwind 配置（供 Frontend 直接使用）

```js
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'void': '#0A0907',
        'surface': '#14120E',
        'panel': '#1C1914',
        'panel-hover': '#242018',
        'border-s': '#2C2820',
        'border-m': '#3E3830',
        'text-p': '#F2EADB',
        'text-s': '#9E9080',
        'text-t': '#5E5548',
        'gold': '#C8924A',
        'gold-bright': '#E5B870',
        'gold-dim': '#7A5830',
      },
      fontFamily: {
        'display': ['"Cormorant Garamond"', 'Georgia', 'serif'],
        'mono': ['"DM Mono"', '"Courier New"', 'monospace'],
      },
      letterSpacing: {
        'widest2': '0.12em',
      }
    }
  }
}
```

---

## 禁止事项

- 禁止：紫蓝渐变背景、半透明玻璃卡片（glassmorphism）
- 禁止：Space Grotesk / Inter / Roboto 等无衬线科技字体作为标题
- 禁止：霓虹发光色（#FF00FF, #00FFFF类）
- 禁止：亮白色大面积底色
- 禁止：居中布局三等分卡片 hero 区域
- 禁止：仅外观无交互的组件
