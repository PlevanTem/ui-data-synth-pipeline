# DevTools 系统性能分析工具 Design Brief

## 设计问题陈述

这个产品需要让**后端/全栈工程师**在**紧张的故障排查和高信息密度操作状态**下快速建立系统掌控感。核心挑战是：大量时序数据在不降低认知负担的前提下，同时要提供丰富的联动交互维度。视觉上需要建立**专业工具级可信度**，像精密仪器而非消费品；交互上需要支撑**immersive 密度**的操作流——图表点击、筛选联动、表格响应必须无缝衔接，让用户感觉在操控一套精确仪器，而非浏览信息页面。

---

## 风格方向

### 主方向：Industrial Blueprint（工业蓝图）

**关键词**：schematic / amber-signal / monospace-dominant / grid-as-foreground / function-honest

**选择理由（基于真实调研结论）**：

- 2026 Awwwards 趋势已验证：开发者工具类产品在 "signal-over-noise" + raw structural 方向有明确的市场认可（Tubik Studio 的 2026 UI Trends 报告：*"function-forward design, grid as foreground, wireframe logic brought into final UI"*）
- Signal Dashboard（2026 DevOps 模板）已用 cyan/green neon + JetBrains Mono 方案成为新套路，Gemini 版本也在同一路径 → 本案要从 neon 颜色语义跳出来
- 以**工业蓝图/原理图**为隐喻：暗底 + **amber（暖琥珀）** 作为主信号色，而非 cyan/green，传达「精密仪器读数」而非「黑客终端」的差异化气质
- Neumorphism 局部应用：将 neumorph 的**内凹/浮凸光影**只用于**状态 widget（健康评分、指标卡）**，让它们像嵌入仪表盘的物理表盘，不做全页铺设（全铺在高密度暗色 UI 下可读性极差，这是已知反模式）

**规避的同质化套路**：
- ❌ cyan `#00F0FF` / neon-green `#39FF14` 配色（Gemini 版本 + Signal Dashboard 已用）
- ❌ Three.js 服务拓扑节点图（Gemini 版本已用）
- ❌ 粒子网络 / 星空背景（CodePen 滥用模式）
- ❌ 全页 Neumorphism（高密度场景下可读性灾难）
- ❌ 居中英雄区 + 三栏卡片布局（SaaS 营销页模式，不适合工具产品）

---

## 设计系统 Token

### 色彩

| 用途 | Token 名 | 值 |
|-----|---------|---|
| 页面背景 | bg-void | `#0A0A0C` |
| 表面层（卡片/面板） | bg-surface | `#111115` |
| 内凹层（表格背景/输入框） | bg-inset | `#0D0D10` |
| 网格线 / 分割线 | border-grid | `#1E1E28` |
| 微边框（高亮边框） | border-active | `#2A2A38` |
| 主信号色（amber） | signal-amber | `#F59E0B` |
| 信号色暗变体（hover）| signal-amber-dim | `#D97706` |
| 信号色极亮（异常高亮） | signal-amber-bright | `#FCD34D` |
| 次级数据色（蓝灰） | data-slate | `#64748B` |
| 次级数据高亮 | data-slate-light | `#94A3B8` |
| 危险 / 错误 | danger-red | `#EF4444` |
| 危险暗版（背景）| danger-bg | `rgba(239,68,68,0.08)` |
| 警告 | warn-yellow | `#EAB308` |
| 成功 / 正常 | ok-green | `#22C55E` |
| 主文字 | text-primary | `#E2E8F0` |
| 次要文字 | text-secondary | `#94A3B8` |
| 静默文字 | text-muted | `#475569` |
| Neumorph 凸起阴影亮侧 | neumorph-light | `rgba(255,255,255,0.03)` |
| Neumorph 凸起阴影暗侧 | neumorph-dark | `rgba(0,0,0,0.6)` |

### 排版

- **主字体**：JetBrains Mono（CDN: `https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap`）
- **辅助字体**：Inter（CDN: `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap`）
- h1: `32px / 700 / 1.2` JetBrains Mono
- h2: `20px / 600 / 1.3` JetBrains Mono
- h3: `14px / 500 / 1.4` JetBrains Mono uppercase letter-spacing 0.1em
- body: `14px / 400 / 1.6` Inter
- data-value: `28px / 700 / 1.0` JetBrains Mono（用于核心指标数字）
- caption: `11px / 400 / 1.4` JetBrains Mono text-muted letter-spacing 0.08em
- label-tag: `10px / 600 / 1.2` Inter uppercase

### 间距

| 名称 | 值 |
|-----|---|
| xs | 4px |
| sm | 8px |
| md | 12px |
| base | 16px |
| lg | 24px |
| xl | 32px |
| 2xl | 48px |
| 3xl | 64px |

### 圆角

| 名称 | 值 |
|-----|---|
| sm | 2px（极小，工程图感） |
| md | 4px（卡片默认） |
| lg | 6px（面板/弹窗） |
| full | 9999px（badge/tag） |

### 阴影

| 用途 | 值 |
|-----|---|
| 卡片层叠 | `0 1px 3px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.3)` |
| 面板提升 | `0 4px 24px rgba(0,0,0,0.6)` |
| Neumorph 浮凸（指标卡专用） | `6px 6px 12px rgba(0,0,0,0.6), -6px -6px 12px rgba(255,255,255,0.025)` |
| Neumorph 内凹（active 状态） | `inset 4px 4px 8px rgba(0,0,0,0.6), inset -4px -4px 8px rgba(255,255,255,0.02)` |
| amber glow（异常标注）| `0 0 12px rgba(245,158,11,0.3)` |
| danger glow | `0 0 10px rgba(239,68,68,0.25)` |

### 动效节奏

- **快速 (80-120ms)**：hover 颜色变化、badge 数字更新、tooltip 出现
- **正常 (200-280ms)**：展开/收起、状态切换、tab 切换
- **慢速 (400-600ms)**：视图切换淡入、图表 path draw-on 动画、首屏卡片入场
- **极慢 (800-1200ms)**：振荡波形 Canvas 绘制动画（一次性入场）
- **缓动函数**：`cubic-bezier(0.16, 1, 0.3, 1)`（快出慢结束，专业感）
- 状态脉冲（危险行）：`pulse 2s ease-in-out infinite`

---

## 组件规范

### 侧边导航栏

- **作用**：4 个主视图导航（总览/指标大盘/数据表格/查询控制台）+ 告警 badge + 主题切换
- **气质**：窄栏（56px 收起 / 220px 展开），深背景 `bg-inset`，左侧 amber 竖线标记 active 项
- **状态**：
  - default: icon + 文字，text-muted
  - hover: text-primary，左侧竖线淡入
  - active: text-amber，左侧 3px amber 竖线 + neumorph 内凹背景
  - collapsed: 仅 icon，tooltip hover 显示文字
- **联动**：点击导航项切换主内容视图（display 切换 + fade 动效）
- **移动端**：底部 tab bar，4 个 icon，与侧边栏共用状态管理

### 总览仪表板（Overview）

- **作用**：首屏 30 秒内建立系统健康全局感知
- **气质**：蓝图网格感，3 个核心 Neumorph 指标卡（健康评分/P99 延迟/错误率）+ 迷你趋势图 + 告警列表
- **指标卡状态**：
  - normal: amber 数字，neumorph 浮凸阴影
  - warning: warn-yellow 数字，轻微 glow
  - danger: danger-red 数字 + 脉冲 glow，border danger-bg
- **迷你趋势图**：SVG 折线，hover 时放大 tooltip；点击后跳转到指标大盘视图并聚焦该指标

### WebGL 指标大盘（Canvas 振荡波形面板）

- **作用**：时序大数据量可视化，发现峰值和异常
- **气质**：全宽黑底 Canvas，amber/slate 多线振荡波形（而非折线图）；暗底格线（`#1E1E28`）构成工业坐标纸背景
- **实现**：原生 Canvas 2D（非 Three.js）：requestAnimationFrame 绘制多条时序线，鼠标滚轮缩放时间轴，hover 时垂直十字准线 + 数据 tooltip
- **状态**：
  - 加载中：shimmer 占位矩形
  - 异常区段：amber 半透明矩形标注 + 标签
  - 联动触发：鼠标点击时间段 → 触发表格过滤（通过全局 state）

### 高性能数据表格

- **作用**：精确查看具体记录，高亮异常行
- **气质**：极简表格，`bg-inset` 背景，横向分割线 `border-grid`，monospace 数据字体
- **虚拟滚动**：自实现简单虚拟列表（窗口内只渲染可见行 ±10 行缓冲）
- **状态**：
  - normal row: text-secondary
  - hover row: bg-active 微高亮
  - danger row: danger-bg 背景 + 左侧 2px danger 竖线 + 脉冲动效
  - selected（图表联动）: amber-bg 背景 + 左侧 3px amber 竖线
  - empty: 中央空状态图标 + 文字
  - loading: 骨架屏（shimmer 横条）
- **排序**：列头点击，箭头动效，数据重排

### 自然语言查询控制台

- **作用**：用问题描述而非 PromQL 查询数据
- **气质**：大型暗色输入区，token 气泡解析视觉（把查询拆成高亮 tag），预设 query 快捷列表
- **状态**：
  - 输入中：border amber 高亮
  - token 解析后：关键词变成 amber 气泡 tag（`cubic 250ms`）
  - 查询执行中：loading spinner + 按钮 disabled
  - 结果展示：结果摘要 + 联动更新表格

### 告警浮层（Alert Panel）

- **作用**：不中断主流程地获知新告警
- **气质**：右侧抽屉式，逐张 slide-in，告警卡片用危险/警告色左边框区分级别
- **状态**：
  - 展开：右侧 320px 抽屉，overlay 遮罩
  - 收起：仅右上角 badge 数字（pulse 动效）
  - 空状态：中央绿色图标 + "All Clear" 文字

### Toast 通知系统

- **作用**：任意操作触发反馈（排序、查询、导出等）
- **气质**：右下角堆叠，最多 3 条，类型色左边框，auto-dismiss 4s
- **状态**：slide-in-right 入场，fade+slide-out 消失

---

## 页面交互清单
（Frontend 必须完整实现）

- [ ] 侧边导航点击：切换4个主视图（Overview/Metrics/Table/Query），有 fade 过渡
- [ ] 侧边导航收起/展开：宽度 transition 220ms
- [ ] 移动端底部 tab 切换：与桌面视图状态同步
- [ ] 指标卡点击：跳转到 Metrics 视图，Canvas 聚焦对应指标线
- [ ] Canvas 时间轴：鼠标滚轮缩放，拖拽平移
- [ ] Canvas 鼠标 hover：十字准线 + 浮动 tooltip 显示精确值
- [ ] Canvas 点击时间段：全局 state 更新 → 表格自动过滤到对应时间窗口
- [ ] 表格列头点击：排序（asc/desc），有重排动效
- [ ] 表格关键词搜索：实时过滤行
- [ ] 查询框输入：token 解析视觉（高亮 tag 化关键词）
- [ ] 查询预设 tag 点击：填充查询框并触发查询
- [ ] 查询执行：loading → 结果摘要 → 表格更新
- [ ] 告警 badge 点击：打开告警抽屉
- [ ] 告警卡片关闭：slide-out 动效，badge 数字更新
- [ ] 全局主题切换（暗/亮）：所有组件颜色同步切换，有 200ms transition
- [ ] 空状态显示：表格无数据时展示空状态视觉
- [ ] Toast 系统：各操作完成后触发对应 toast

---

## 视觉特效方案

### 生成式视觉层：Canvas 振荡波形引擎

- **技术**：原生 Canvas 2D（**不使用 Three.js/WebGL**，避免与 Gemini 版本重复；Canvas 2D 对此类场景帧率更稳定）
- **算法**：
  - 多通道时序振荡：用正弦波叠加 + Perlin/simplex 噪声模拟真实指标波动
  - 峰值检测：突破阈值的区段自动高亮（amber glow 矩形标注）
  - 坐标纸背景：canvas 绘制 `#1E1E28` 细格线，模拟工业图纸底板
  - 振荡线绘制：`lineTo` + `stroke`，多条线（amber / slate / green / red）各代表不同指标
  - 入场动画：path 从左向右 draw-on（1000ms，requestAnimationFrame 控制进度 0→1）
- **区域**：Metrics 视图全宽面板（高度约 300px）
- **参数范围**：
  - 振荡频率：0.02–0.08 Hz（视指标类型）
  - 噪声幅度：±15% 基准值
  - 线宽：主线 1.5px / 异常区 2px
  - glow 范围：`shadowBlur = 8, shadowColor = amber`（仅异常区段开启）
- **与内容层关系**：Canvas 在 Metrics 视图独占面板，不做全页背景，不遮挡任何文字
- **CDN**：无需额外 CDN，原生 Canvas 2D

### 动效方案

- **入场动画**：Intersection Observer 触发，卡片 `opacity:0 → 1 + translateY(16px → 0)`，交错延迟 50ms/个
- **交互动效**：纯 CSS transition（`cubic-bezier(0.16,1,0.3,1)`），无需 GSAP（保持轻量）
- **数字滚动**：指标卡数值变化时，用 requestAnimationFrame 实现数字计数动效（500ms）
- **视图切换**：`opacity:0 → 1`，200ms fade（transform 不移位，避免数据密集场景的位置混乱感）
- **危险行脉冲**：`box-shadow` CSS keyframe 循环（2s）

### 降级策略

- `prefers-reduced-motion: reduce`：关闭 Canvas 动画、入场动效、数字滚动，保留静态数据展示
- 旧设备：Canvas draw-on 入场改为瞬时显示（requestAnimationFrame 检测帧率，<20fps 时降级）

---

## Tailwind 配置（供 Frontend 直接使用）

```js
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        void: '#0A0A0C',
        surface: '#111115',
        inset: '#0D0D10',
        'border-grid': '#1E1E28',
        'border-active': '#2A2A38',
        amber: {
          signal: '#F59E0B',
          dim: '#D97706',
          bright: '#FCD34D',
          glow: 'rgba(245,158,11,0.15)',
        },
        slate: {
          data: '#64748B',
          light: '#94A3B8',
        },
        danger: {
          DEFAULT: '#EF4444',
          bg: 'rgba(239,68,68,0.08)',
          glow: 'rgba(239,68,68,0.2)',
        },
        warn: '#EAB308',
        ok: '#22C55E',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'neumorph-up': '6px 6px 12px rgba(0,0,0,0.6), -6px -6px 12px rgba(255,255,255,0.025)',
        'neumorph-down': 'inset 4px 4px 8px rgba(0,0,0,0.6), inset -4px -4px 8px rgba(255,255,255,0.02)',
        'amber-glow': '0 0 12px rgba(245,158,11,0.3)',
        'danger-glow': '0 0 10px rgba(239,68,68,0.25)',
        'panel': '0 4px 24px rgba(0,0,0,0.6)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      animation: {
        'pulse-danger': 'pulseDanger 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'slide-in-right': 'slideInRight 0.28s cubic-bezier(0.16,1,0.3,1) forwards',
        'count-up': 'none',
      },
      keyframes: {
        pulseDanger: {
          '0%, 100%': { boxShadow: '0 0 4px rgba(239,68,68,0.2)' },
          '50%': { boxShadow: '0 0 12px rgba(239,68,68,0.5)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(24px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    }
  }
}
```

---

## 禁止事项

- ❌ Three.js 节点图/拓扑图（已被 Gemini 版本用过，且与当前方向不符）
- ❌ cyan `#00F0FF` 或 neon-green `#39FF14`（常见 terminal 配色，已过度使用）
- ❌ 全页 Neumorphism（只允许指标卡 widget 局部使用）
- ❌ 粒子背景/星空（与内容方向无关，2026 已是滥用反模式）
- ❌ 玻璃拟态卡片（anti-Liquid Glass 趋势明确）
- ❌ 居中大标题 + 三栏等宽卡片（营销页模式）
- ❌ 在 CDN 模式下使用 `@theme`、`@import "tailwindcss"` 语法
