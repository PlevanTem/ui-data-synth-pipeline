# 开发者性能分析工具 (DevTools) Design Brief

## 设计问题陈述
这个产品需要让前端与全栈开发者在排查性能瓶颈状态下通过直观反馈和极速查询快速调优应用性能。核心挑战是传统性能面板数据密集且枯燥，难以直观关联数据与渲染层，跨维度查询操作繁琐。视觉上需要建立专业与沉浸的高级科技信任感，交互上需要支撑高密度数据展示和复杂的多维度操作流。

## 风格方向
主方向：**暗夜新拟态 (Dark Neumorphism) + WebGL 生成式拓扑**
关键词：沉浸科技 (Immersive Tech)、深邃层级 (Deep Depth)、荧光点缀 (Neon Accents)、流体过渡 (Fluid Transitions)
选择理由：传统的新拟态多用于浅色背景并容易显得油腻，但在暗色模式下，通过极致克制的极细发光高光（inner shadow）与深色软阴影结合，能打造出一种犹如高端硬件设备或航天仪表盘的“实体科技感”。结合 WebGL 渲染的大数据拓扑星系图，既能承载海量性能数据的可视化需求，又能彻底打破枯燥的表格堆砌感。
规避套路：刻意规避了烂大街的“大面积紫蓝渐变背景+玻璃拟态卡片”，转而采用几乎纯黑或极深灰（#09090B）的实体材质感，仅靠交互触发时的局部荧光色发光来引导视觉。

## 设计系统 Token

### 色彩
| 用途 | Token 名 | 值 |
|-----|---------|---|
| 全局极暗背景 | bg-base | #09090B |
| 面板底色(新拟态凸起) | bg-surface | #121215 |
| 凹陷输入框/图表底色 | bg-sunken | #050506 |
| 主色(荧光蓝) | color-primary | #00F0FF |
| 强调色(霓虹绿) | color-accent | #39FF14 |
| 告警色(镭射红) | color-danger | #FF003C |
| 主文本 | text-primary | #F3F4F6 |
| 次文本 | text-secondary | #9CA3AF |
| 暗纹/极细边框 | border-subtle | rgba(255, 255, 255, 0.05) |

### 排版
- 字体：Inter (CDN: `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap`) 和 Fira Code (CDN: `https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap`) 用于数据和代码
- h1: 32px / 700 / 1.2
- h2: 24px / 600 / 1.3
- h3: 18px / 500 / 1.4
- body: 14px / 400 / 1.5
- data-mono: 13px / Fira Code / 400 / 1.5
- caption: 12px / 400 / 1.4

### 间距 / 圆角 / 阴影
| 变量 | 关键值 | 用途 |
|-----|-------|------|
| 间距 base | 4px | 基础网格 |
| 间距常用 | 8, 16, 24, 32, 64px | 组件内距、区块间距 |
| 圆角 sm | 6px | 小标签、输入框 |
| 圆角 md | 12px | 数据卡片、小面板 |
| 圆角 lg | 24px | 核心图表大面板 |
| 圆角 full | 9999px | 胶囊按钮、头像 |
| 阴影 neumorph-up | `8px 8px 16px #000000, -8px -8px 16px rgba(255,255,255,0.03)` | 凸起面板 |
| 阴影 neumorph-down | `inset 6px 6px 12px #000000, inset -6px -6px 12px rgba(255,255,255,0.03)` | 凹陷输入/表格区 |
| 阴影 glow | `0 0 15px rgba(0, 240, 255, 0.4)` | 主色强调发光 |

### 动效节奏
- 快速 (150ms): 微交互 hover/focus，按钮按压反馈
- 正常 (300ms): 模态框展开、状态切换、图表 tooltip 出现
- 慢速 (800ms): 页面初始入场、WebGL 视角切换
- 缓动：`cubic-bezier(0.16, 1, 0.3, 1)` (极致平滑的出场/入场)

## 组件规范

### 1. 自然语言搜索框 (全局导航区)
- 作用：接收用户的自然语言或语音指令，是系统的核心交互入口
- 气质：深邃、精密、随时响应
- 状态：
  - default: 凹陷新拟态底色 (neumorph-down) + 极简暗文 placeholder
  - focus/active: 边缘泛起 color-primary 的微光 (glow)，并有光标闪烁
  - loading: 输入完成后，框内出现流光扫描动效，表示 AI 正在解析指令
- 联动：提交指令后，触发 WebGL 性能全景图的视角聚焦，或过滤底部明细数据表格。

### 2. 性能全景图卡片 (WebGL 区)
- 作用：展示系统性能拓扑结构与实时节点健康度
- 气质：硬核科技、三维空间感
- 状态：
  - default: 新拟态凸起面板 (neumorph-up) 承载 Canvas
  - hover: 鼠标移入画布内，悬停节点高亮并显示微型 tooltip
- 联动：点击某一节点，高亮该节点并将其数据同步至下方的指标趋势图和明细数据表格。

### 3. 指标趋势图表 (SVG 区)
- 作用：呈现 CPU/内存 等性能指标的时间序列
- 气质：流畅、精准
- 状态：
  - default: 极简坐标轴，柔和的面积渐变（主色到透明）
  - hover: 竖线光标跟随鼠标，交点出现荧光绿(color-accent)高亮圆点，展示详细数值
- 联动：拖拽时间轴范围可联动过滤右侧的明细数据表格。

### 4. 明细数据面板 (数据表格)
- 作用：海量数据的最终落脚点
- 气质：紧凑、高效、扫视极快
- 状态：
  - default: 表头固定，内部滚动；采用等宽字体(Fira Code)对齐数据
  - hover: 行 hover 时具有极淡的 #121215 纯色高亮（不破坏暗黑氛围）
  - error/warning 单元格：使用 color-danger 文字或柔和红底警示
- 联动：响应全局搜索框和 WebGL 选中的节点数据过滤。

## 页面交互清单
（Frontend 必须完整实现）

- [ ] 全局搜索交互：在搜索框输入文字并回车（或模拟语音输入完成），模拟加载 1 秒后，更新 WebGL 视角和下方表格数据（使用前端模拟过滤逻辑）。
- [ ] WebGL 节点悬停与点击：鼠标在 Three.js 画布中 hover 节点出现信息，点击节点后页面其他面板（SVG 图表、数据表格）的数据标题或内容更新为该节点的数据。
- [ ] SVG 图表 Hover：鼠标在折线图上移动时，出现定制 tooltip 并在折线上有跟随的焦点。
- [ ] 数据表格筛选联动：点击表格头的“耗时”或“内存”可模拟排序，搜索框的内容也可模糊匹配表格行。
- [ ] 按钮新拟态反馈：所有操作按钮点击（:active）时，从 `neumorph-up` 阴影平滑过渡到 `neumorph-down` 阴影。

## 视觉特效方案

### 生成式视觉层
- 技术：Three.js (CDN 引入)
- 算法：3D 粒子系统星系 (Particle System)
- 区域：页面核心视觉中心（性能全景图卡片内）
- 参数范围：黑色深空背景，节点基础颜色白色半透明，根据模拟的性能数据（如耗时）将部分节点映射为红色 (color-danger) 或黄色；整体具有极缓慢的自转。
- 与内容层关系：作为独立面板呈现，不遮挡外部 UI，支持鼠标拖拽旋转缩放。
- CDN：`https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`

### 动效方案
- 入场动画：页面加载时，各面板自下而上 staggered 淡入 (CSS animation + transition delay)。
- 交互动效：按钮点击新拟态阴影切换采用纯 CSS `transition: box-shadow 0.15s ease`。
- 搜索反馈：搜索框 loading 态使用 CSS 线性渐变动画（background-position 移动）模拟扫光。
- 图表动画：可使用 Chart.js (CDN) 实现带顺滑入场过渡的面积图。

### 降级策略
- 低性能设备检测到帧率过低时，Three.js 画布停止自转，禁用抗锯齿；如果 WebGL 初始化失败，降级为一张静态的高科技拓扑暗色纹理图。

## Tailwind 配置（供 Frontend 直接使用）

```js
tailwind.config = {
  theme: {
    extend: {
      colors: {
        base: '#09090B',
        surface: '#121215',
        sunken: '#050506',
        primary: '#00F0FF',
        accent: '#39FF14',
        danger: '#FF003C',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"Fira Code"', 'monospace'],
      },
      boxShadow: {
        'neumorph-up': '8px 8px 16px #000000, -8px -8px 16px rgba(255,255,255,0.03)',
        'neumorph-down': 'inset 6px 6px 12px #000000, inset -6px -6px 12px rgba(255,255,255,0.03)',
        'glow': '0 0 15px rgba(0, 240, 255, 0.4)',
        'glow-danger': '0 0 15px rgba(255, 0, 60, 0.4)'
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
      }
    }
  }
}
```

## 禁止事项
- 坚决避免大面积的高饱和度紫蓝色渐变背景，保持极黑/深灰的底色克制。
- 禁止使用全白色的高光阴影，在暗模式下新拟态的高光部分必须极其微弱（例如 rgba(255,255,255,0.03)），否则界面会显“脏”且充满廉价感。
- 禁止“只有图表没有联动”的死板数据呈现，必须实现点击拓扑节点或搜索联动数据的交互。