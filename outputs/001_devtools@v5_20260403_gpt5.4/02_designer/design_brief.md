# 性能透视（DevTools）Design Brief

## 设计问题陈述
这个产品需要让性能工程师、SRE 与技术负责人在高压排障情境下，依然能带着掌控感完成大规模遥测数据的定位、下钻与沟通。核心挑战是把高密度数据、自然语言入口、可交互画布和证据表格收敛到同一工作区里，同时避免 DevTools 常见的“纯理性但难用”与新拟态常见的“好看但失焦”。视觉上需要建立克制、可信、耐久盯屏的专业感，交互上需要支撑 rich 级别的联动、反馈和状态恢复。

## 风格方向
### 探索过的 3 个方向
1. **Precision Console**
   - 关键词：graphite, console, utilitarian, dense, precise
   - 证据：开发者工具与可观测性产品在 2026 仍然强调 code-like typography、深石墨底色和证据优先的信息布局；`ui-ux-pro-max` 也回收到了 JetBrains Mono + IBM Plex Sans 的工程气质组合。
   - 不选原因：过于克制，难以承接本案的 WebGL 大数据态势层与“值得截图分享”的表现要求。
2. **Soft Infra Dashboard**
   - 关键词：soft depth, slate, cyan pulse, tactile, diagnostics
   - 证据：暗色新拟态在 2026 已从“全页软 UI”退回到“局部触觉反馈”，强调只把软阴影用于控件与状态确认；同时可观测性产品开始采用画布式 investigation workspace，例如 Honeycomb Canvas 与 Observable Canvases，把自然语言、探索路径和可视化放在同一工作区。
   - 风险：如果阴影铺得太满，会变成低对比度摆件，损伤可读性。
3. **Generative Ops Theater**
   - 关键词：glow field, immersive, canvas, cinematic, reactive
   - 证据：2026 的数据交互趋势明显向“可刷选、可联动、可画布协作”的体验靠拢，生成式背景与实时点云可以强化“系统正在流动”的知觉。
   - 不选原因：如果把整页做成沉浸式视觉装置，会让排障效率下降，也不符合 professional 信任感。

### 主方向
**Soft Ops Canvas**

关键词：`dark-slate` `soft-depth` `cyan-signal` `precision-grid` `investigation-canvas`

选择理由：
- Honeycomb Canvas 证明“自然语言 + 交互式工作区”已经成为可观测性产品的重要叙事方式，适合本案的查询入口与联动视图。
- Observable Canvases 的信号说明：下游图表随着上游刷选实时过滤，是 2026 数据工具里最值得借鉴的交互范式。
- Grafana 的 SVG 可视化生态说明，SVG 仍适合表达精确趋势与可映射的诊断部件，而不必把所有视觉都丢给 WebGL。
- 关于暗色新拟态的实时资料明确提示：必须“选择性使用”，只在按钮、输入、切换器、浅层浮块上使用软压感，不把主数据容器做成低对比度凹凸雕塑。

为避免同质化，本案明确规避：
- 默认紫蓝科技渐变铺底
- 居中大标题 + 三张 KPI 卡模板
- 整页玻璃拟态
- 每个区块都发光或同时抢戏的动效
- 把自然语言入口做成聊天机器人主界面

## 设计系统 Token
### 色彩
| 用途 | Token 名 | 值 |
|-----|---------|---|
| 页面最深背景 | bg-base | #07111f |
| 工作台背景 | bg-shell | #0c1728 |
| 一级表面 | bg-surface | #101d31 |
| 二级表面 | bg-elevated | #16253d |
| 浮层表面 | bg-overlay | #1b2d47 |
| 细边框 | border-subtle | #21324c |
| 默认边框 | border-default | #2b4260 |
| 激活边框 | border-strong | #4d87c7 |
| 主文字 | text-primary | #e8f1ff |
| 次文字 | text-secondary | #9bb0cc |
| 弱文字 | text-muted | #6e85a7 |
| 主强调 | color-primary | #6fd3ff |
| 次强调 | color-secondary | #7a8cff |
| 成功 | color-success | #4ade80 |
| 警告 | color-warning | #fbbf24 |
| 危险 | color-danger | #fb7185 |
| WebGL 点云冷亮点 | chart-cyan | #8ae6ff |
| WebGL 热区高亮 | chart-hot | #8b5cf6 |
| 严重信号 | chart-critical | #ff6b8a |

### 排版
- 字体：`IBM Plex Sans`（CDN: `https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap`）
- h1: `40px / 700 / 1.08`
- h2: `26px / 600 / 1.2`
- h3: `18px / 600 / 1.3`
- body: `15px / 400 / 1.6`
- caption: `12px / 500 / 1.5`
- 数值与时间戳：统一使用 `JetBrains Mono`

### 间距 / 圆角 / 阴影
| 类别 | Token | 值 |
|-----|------|---|
| 间距 | space-1 | 4px |
| 间距 | space-2 | 8px |
| 间距 | space-3 | 12px |
| 间距 | space-4 | 16px |
| 间距 | space-6 | 24px |
| 间距 | space-8 | 32px |
| 间距 | space-12 | 48px |
| 圆角 | radius-sm | 10px |
| 圆角 | radius-md | 16px |
| 圆角 | radius-lg | 24px |
| 圆角 | radius-pill | 999px |
| 阴影 | shadow-raised | 10px 10px 22px rgba(2, 8, 18, 0.48), -10px -10px 22px rgba(22, 42, 68, 0.36) |
| 阴影 | shadow-pressed | inset 7px 7px 14px rgba(3, 9, 18, 0.55), inset -7px -7px 14px rgba(28, 47, 73, 0.28) |
| 阴影 | shadow-glow | 0 0 0 1px rgba(111, 211, 255, 0.22), 0 0 26px rgba(111, 211, 255, 0.12) |

### 动效节奏
- 快速 (120-160ms): hover、focus、按钮按压反馈
- 正常 (220-320ms): 筛选切换、表格排序、抽屉展开
- 慢速 (520-760ms): 视图入场、骨架屏淡出、画布聚合层切换
- 缓动：`cubic-bezier(0.22, 1, 0.36, 1)`

## 组件规范
### 顶部工作台导航
- 作用：承载环境切换、时间窗、主题、分享、全局状态。
- 气质：悬浮但不喧宾夺主，像“诊断工具栏”而不是营销导航。
- 状态：default / hover / active / compact-mobile
- 联动：时间窗与环境变化同时驱动 WebGL、SVG、表格和摘要 KPI。

### 查询解释面板
- 作用：承载自然语言输入、建议语句、解析摘要、语音入口。
- 气质：可对话但不聊天化，更像“查询编译器”。
- 状态：default / parsing / error / permission-denied / success
- 联动：提交后更新状态条、刷新主画布、趋势图、证据表与 toast。

### WebGL 态势画布
- 作用：呈现大规模服务节点/trace cluster 的分布、密度与风险热区。
- 气质：深空仪表感，冷色点云在暗底上有秩序地流动。
- 状态：loading / ready / brushed / degraded / context-lost
- 联动：框选或点击 cluster 后过滤 SVG 图表与表格，并刷新右侧诊断摘要。

### SVG 趋势与分布视图
- 作用：精确显示延迟走势、错误率变化、分位数或服务维度分布。
- 气质：细线、轻面、清晰坐标，不靠厚重图块压人。
- 状态：default / hover / filtered / empty / degraded
- 联动：跟随当前筛选和画布框选变化；hover 到数据点时高亮对应表格记录。

### 证据表与详情抽屉
- 作用：排序、审阅、复制关键字段，查看选中记录的上下文。
- 气质：高对比、紧凑、工程化；局部软压感只体现在表头按钮和行选中边缘。
- 状态：default / sorted / selected / loading / empty / error
- 联动：点击表格行更新 SVG hover mask、右侧详情与诊断标签。

### 反馈系统（Toast + 横幅）
- 作用：展示加载阶段、解析错误、WebGL 降级、分享成功等反馈。
- 气质：快速、明确、有分类；不要做浮夸庆祝动效。
- 状态：info / success / warning / error
- 联动：任意操作都可触发；高优先级错误横幅不被普通 toast 覆盖。

### 空状态 / 骨架态
- 作用：保证“无数据”“无结果”“权限不足”“加载中”被明显区分。
- 气质：仍然属于同一暗色系统，但图形更简化、更示意化。
- 状态：loading / no-results / no-source / permission
- 联动：重置筛选、载入 demo、切回默认时间窗等动作直接可点。

## 页面交互清单
（Frontend 必须完整实现）

- [ ] 导航点击：滚动到对应锚点，并在移动端支持展开/收起导航。
- [ ] 时间窗切换：同步刷新 KPI、WebGL 画布、SVG 图表和表格。
- [ ] 环境筛选：生产 / 预发 / 沙箱切换后联动全部数据视图。
- [ ] 查询提交：文本查询解析为结构化条件，展示解析摘要和状态条。
- [ ] 语音按钮：支持浏览器语音识别时录入文本；不支持时展示可操作降级提示。
- [ ] 画布交互：点击 cluster 进行过滤，Shift + 拖拽进行框选，支持重置视图。
- [ ] 图表交互：hover 显示 tooltip，点击图例开关序列，刷选结果反映到表格。
- [ ] 表格交互：排序、搜索、行选中、详情抽屉展开，并反向高亮图表/画布。
- [ ] 表单校验：自然语言输入为空、过短、或无法解析时给出明确纠错反馈。
- [ ] 状态反馈：加载、空状态、错误状态、降级模式、复制成功、分享成功全部可见。
- [ ] 动画编排：入场、筛选更新、抽屉展开、toast 进出场均遵循统一节奏；支持 `prefers-reduced-motion`。

## 视觉特效方案
### 生成式视觉层
- 技术：`Three.js`（CDN 引入），用于 WebGL 点云/聚类态势层；精确图表使用原生 `SVG`。
- 算法：
  - 主画布使用 `points cloud + orbital field`，通过极坐标环带 + 噪声扰动构成 3 个风险层级；
  - 颜色从 `chart-cyan -> chart-hot -> chart-critical` 映射异常度；
  - 被选中 cluster 提升尺寸与发光阈值，非选中 cluster 降低 alpha。
- 区域：首屏主分析区背景画布。
- 参数范围：
  - 点数量：桌面 `1800-2600`，平板 `900-1400`，手机 `450-700`
  - 漂移速度：`0.0008-0.0018`
  - 点尺寸：`1.2-4.6`
  - 发光透明度：`0.18-0.4`
- 与内容层关系：画布位于主分析区底层，文字和控件区域加深背景蒙层；交互 hover 时只在局部出现高亮，不做整屏炫光。
- CDN：`https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.min.js`

### 动效方案
- 入场动画：`Intersection Observer + CSS transform/opacity`，区块分批进入。
- 交互动效：按钮和切换器使用 soft press 阴影切换；表格排序与抽屉展开使用 CSS transition。
- 滚动联动：导航高亮、section reveal、移动端目录收起由原生 JS 完成。
- 状态动画：查询状态条采用分段脉冲，骨架屏 shimmer 使用低对比渐变。

### 降级策略
- `prefers-reduced-motion` 时关闭点云漂移与入场位移，仅保留透明度渐变。
- WebGL 不可用或上下文丢失时，切换到静态 Canvas/SVG 聚合态势图，并在反馈横幅中说明当前为简化模式。
- 低宽度屏幕下只保留单主视图，详情改为抽屉覆盖层。

## Tailwind 配置（供 Frontend 直接使用）
```js
tailwind.config = {
  theme: {
    extend: {
      colors: {
        shell: "#0c1728",
        base: "#07111f",
        surface: "#101d31",
        elevated: "#16253d",
        overlay: "#1b2d47",
        line: "#21324c",
        stroke: "#2b4260",
        "stroke-strong": "#4d87c7",
        primary: "#6fd3ff",
        secondary: "#7a8cff",
        success: "#4ade80",
        warning: "#fbbf24",
        danger: "#fb7185",
        "text-main": "#e8f1ff",
        "text-soft": "#9bb0cc",
        "text-dim": "#6e85a7"
      },
      fontFamily: {
        sans: ["IBM Plex Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"]
      },
      boxShadow: {
        raised: "10px 10px 22px rgba(2,8,18,0.48), -10px -10px 22px rgba(22,42,68,0.36)",
        pressed: "inset 7px 7px 14px rgba(3,9,18,0.55), inset -7px -7px 14px rgba(28,47,73,0.28)",
        glow: "0 0 0 1px rgba(111,211,255,0.22), 0 0 26px rgba(111,211,255,0.12)"
      },
      borderRadius: {
        sm: "10px",
        md: "16px",
        lg: "24px",
        pill: "999px"
      }
    }
  }
}
```

## 禁止事项
- 不把新拟态阴影应用到整页大容器、整块图表底板和长表格背景
- 不把语音与自然语言入口做成“聊天主屏”，它只是查询入口，不是产品人格主角
- 不使用亮紫、霓虹粉等脱离性能诊断语义的装饰色作为主氛围
- 不让背景点云持续抢夺焦点；内容 hover 必须比背景更重要
- 不用营销页式大 Hero 和夸张文案覆盖主工作台
