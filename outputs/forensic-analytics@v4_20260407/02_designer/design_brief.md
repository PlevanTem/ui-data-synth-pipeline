# ForensicAppraise Design Brief

## 设计问题陈述
帮助省级司法鉴定中心的主检法医师与管理者，实时监控不同法医学类别的受检者流量与案件所处阶段，从而精准调度专业医疗设备，防范案件积压，消除信息黑盒，最终缩短受检者20%的等待时间。

## 风格方向
**Ambient Forensic Precision (环境法医精工)**
- 关键词：Data Breathing（数据呼吸）、Deliberate Minimalism（刻意极简）、Typography-first（排版优先）、Spatial Depth（空间深度）、Utilitarian（实用主义）
- 选择理由：结合 2026 年 SaaS 与高级仪表盘最新设计趋势，摒弃 2022-2024 年那种满屏渐变色卡片和花哨圆环图的“过载感”。医疗司法场景需要极致的冷静与专业。我们采用 Typography-first 的极简排版保证高信噪比，同时引入“Ambient Data Visualization”（环境数据可视化），通过暗色深空背景上的 Canvas 粒子流引擎（流转管线）和微弱的呼吸光效来暗示系统的运行状态，既有前沿科技感又不干扰核心数据的读取。
- 规避套路：坚决规避“左侧宽大 Sidebar + 右侧白底灰边框卡片 + 蓝色渐变按钮 + 粗大圆角”的传统 B端套路；规避五颜六色的饼图；规避无意义的 3D 插画点缀。

## 设计系统 Token

### 色彩
| 用途 | Token 名 | 值 |
|-----|---------|---|
| 全局背景 | bg-base | #0B0E14 (深渊黑蓝，营造科技与医疗影像室的冷静感) |
| 卡片/面板底色 | bg-surface | rgba(15, 23, 42, 0.6) (带微弱背景模糊的深石板蓝) |
| 边框/分割线 | border-divider | #1E293B (暗弱的边框，弱化物理边界) |
| 核心主色 | color-primary | #38BDF8 (司法蓝/医疗蓝，用于核心数据和正常状态) |
| 文本主色 | text-primary | #F8FAFC (高对比度白，用于数据和标题) |
| 文本次要 | text-secondary | #94A3B8 (冷灰，用于标签和辅助说明) |
| 状态-警告(轻度) | color-warning | #FBBF24 (琥珀金，用于排队人数攀升) |
| 状态-危险(严重) | color-danger | #EF4444 (警示红，用于积压红线或设备瓶颈) |
| 状态-畅通 | color-success | #10B981 (医疗绿，极少使用，仅用于清空状态) |

### 排版
- 字体：Inter (主要 UI) 和 JetBrains Mono (数据展示)
- CDN: `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap`
- h1 (看板标题): 24px / weight 600 / tracking-tight / text-primary
- h2 (模块标题): 14px / weight 500 / uppercase / tracking-wider / text-secondary
- data-huge (核心指标): 48px / weight 500 / font-jetbrains / tabular-nums
- data-medium (图表轴/次级指标): 16px / weight 400 / font-jetbrains / tabular-nums
- body: 14px / weight 400 / line-height 1.5

### 间距 / 圆角 / 阴影
| 属性 | 值 | 说明 |
|-----|---|---|
| Card Padding | 24px (p-6) | 提供数据呼吸空间 |
| Element Gap | 16px (gap-4) | 内部元素编排 |
| 边框圆角 | 12px (rounded-xl) | 克制的微圆角，避免过度圆润 |
| Card Shadow | 0 4px 24px rgba(0,0,0,0.4) | 深色模式下的空间阴影，用于悬浮层叠 |
| Glass Blur | backdrop-blur-md | 毛玻璃效果叠加，制造深度 |

### 动效节奏
- 快速 (150ms): 数据 hover 态 (图表 tooltip、按钮高亮) / cubic-bezier(0.4, 0, 0.2, 1)
- 正常 (300ms): 预估器计算反馈数值滚动 / cubic-bezier(0.4, 0, 0.2, 1)
- 慢速 (2000ms+): 警报状态的呼吸灯效 / linear infinite
- 持续 (无尽): 案件流转管线 Canvas 粒子的缓动平移

## 组件规范

### 全局核心指标看板 (Global Metric Cards)
- 作用：顶部第一眼全局确认，展示总人数、平均等待估算。
- 气质：干净、极简的 Typography。数值占绝对主导。
- 状态：default / warning (触发积压时，数值颜色变为 color-warning 或 color-danger，并伴随背景微弱呼吸发光)。
- 联动：无。

### 案件状态流转管线 (Case Status Flow)
- 作用：监控三大节点（初审 -> 体检 -> 报告）。
- 气质：基于 WebGL/Canvas 的生成式流体，象征案件像血液/数据一样流过管线。
- 状态：畅通（粒子流速中等，颜色为 primary）、拥堵（该节点粒子堆积、流速减慢，发出 danger 颜色的红光）。

### 智能排班辅助区 (Timeline Estimator Tool)
- 作用：表单输入排队人数与复杂度，输出 AI 预估时长。
- 气质：表单弱化边框，像是在命令行或高精端仪器上输入。
- 状态：focus 时下划线高亮。计算时有数字滚动的 loading 状态，算完后结果用科技感弹跳呈现。

### 伤害类型分布地图 (Injury Distribution)
- 作用：不用传统饼图。使用矩形树图 (Treemap) 或基于原生 DOM 的网格阵列，体现严谨性。
- 气质：色块矩阵，深色底上的半透明色块组合。

## 页面交互清单
（Frontend 必须完整实现）

- [ ] 时间趋势图：鼠标悬浮 (hover) 时显示垂直十字准线 (Crosshair) 和跟随的极简 Tooltip。
- [ ] 流量分布图表：点击不同类别色块，对应高亮，其余类别透明度降至 30%。
- [ ] 智能排班辅助区：输入数字和调整滑块后，点击“Calculate”，下方预估时间执行数字滚动动效 (Count-up animation, 约 500ms) 后停在最终结果。
- [ ] 警报系统：若任何节点数据超过安全阈值（例如写死的 mock 数据体检人数 > 50），该卡片容器的 box-shadow 呈现红色的缓慢呼吸动效 (Pulse)。

## 视觉特效方案

### 生成式视觉层：案件流转管线仿真 (Pipeline Particle Simulation)
- 技术：Canvas 2D 原生实现（保持单文件干净，无须外挂重型 3D 库，2D 粒子足以表现流转）
- 算法：流场/粒子物理系统 (Particle Flow Simulation)。通过设定三个区域（初审、体检、报告）为“吸引子”或“容器”，粒子（代表案件）从左侧发射，向右侧移动并聚集在对应容器中。
- 区域：Dashboard 正中央的“流程管线监控区”。
- 参数范围：
  - 粒子大小：2px - 3px，带微弱发光 (shadowBlur)。
  - 正常区：粒子颜色 `#38BDF8`，速度 `vx = 2.0`。
  - 拥堵区：粒子颜色变为 `#EF4444`，速度降为 `vx = 0.2` 并产生布朗运动式的抖动，视觉上形成积压的高密度红斑。
- 与内容层关系：Canvas 作为卡片的 Background，其上方叠加绝对定位 (absolute) 的 HTML 节点标题和堆积的数字 (Typography)。
- CDN：无需，原生 Vanilla JS Canvas 2D API 即可实现。

### 数据可视化底座
- 图表技术：由于要求高信噪比与严谨，推荐使用原生的 SVG 或极简的 Chart.js 构建折线图。
- CDN: `https://cdn.jsdelivr.net/npm/chart.js` (如必须使用图表库)。但若是矩形树图或极简分布图，建议直接用 Tailwind + HTML div 动态渲染以配合整体极简审美。

### 动效方案
- 入场动画：页面加载时，各数据卡片自下而上进行交错淡入 (Staggered Fade-up, translateY 20px -> 0, opacity 0 -> 1)，间隔 100ms。
- 数字动画：所有大的 KPI 数字加载时执行跳动递增 (CountUp) 效果。

### 降级策略
- 若终端设备性能不足致使 Canvas 掉帧，在检测到帧率 < 30fps 时，自动隐藏 Canvas，降级为静态的进度条 (Progress Bar) 与百分比宽度。

## Tailwind 配置（供 Frontend 直接使用）

```js
tailwind.config = {
  theme: {
    extend: {
      colors: {
        base: '#0B0E14',
        surface: 'rgba(15, 23, 42, 0.6)',
        divider: '#1E293B',
        primary: '#38BDF8',
        danger: '#EF4444',
        warning: '#FBBF24',
        success: '#10B981'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-danger': '0 0 20px rgba(239, 68, 68, 0.4)',
        'glow-primary': '0 0 20px rgba(56, 189, 248, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    }
  }
}
```

## 禁止事项
- 绝不允许使用大面积的白色卡片配合浅灰色背景。
- 绝不允许使用带粗投影的拟物化或粘土风（Claymorphism）。
- 严禁引入不必要的装饰性插画或 3D 拟真物品小图标。
- 严禁在预估器中使用传统的蓝色实心 Submit 大按钮，必须重构为更有终端/控制台气质的文字命令交互或极简线条按钮。