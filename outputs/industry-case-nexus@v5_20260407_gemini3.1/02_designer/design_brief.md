# Industry Case Nexus Design Brief

## 设计问题陈述
这个产品需要让资深运营顾问在面临客户审视和质疑的情绪状态下，通过直观的数据和场景演示成功论证智能制造的价值。核心挑战是如何将抽象的“预测性维护、精益生产”等后台运营策略转化为具有沉浸感、可视化和强说服力的前端体验。视觉上需要建立极致的专业、工业控制室般的信任感与高级感，交互上需要支撑高密度数据的操作流与 3D 空间的无缝联动。

## 风格方向
**主方向：B2B Neubrutalism & Control Room (新粗野主义与工业控制室混合风格)**

**关键词：** 
- Void Black (深空黑)
- Bento Grid (便当盒数据网格)
- Oversized Monospace (大字号等宽字体)
- Data-driven Brutalism (数据驱动的粗野表达)
- Generative Canvas (生成式交互画布)

**选择理由：**
根据 2026 年针对工业制造和 B2B 的前沿趋势调研，传统的“光鲜亮丽但缺乏实质内容”的营销网页已无法打动 VP 级的工业采购和运营方。他们需要“explicitness over subtlety（直白胜于隐晦）”。采用类似高端 SCADA 系统、数字孪生控制室的设计语言，结合深色模式、硬阴影、粗体等宽数据字体以及高对比度的荧光色（如 Reactor-core Green / Open-sky Blue），能瞬间建立极强的专业权威感与极客感。结合 Three.js 的 3D 渲染和 Echarts 数据流，可以将网页转化为一个“实战推演沙盘”。

**规避套路：**
刻意规避常见的 SaaS 营销页套路（如柔和的紫色/蓝色渐变、大面积的毛玻璃拟态、大量的抽象人物插画、居中居左的枯燥文字排版）。本案绝不使用“软”的视觉元素，所有切分都是硬朗的线条、锐利的边角和高对比的数据呈现。

## 设计系统 Token

### 色彩
| 用途 | Token 名 | 值 |
|-----|---------|---|
| 全局背景 | bg-void | #0B0B0F |
| 卡片/面板背景 | bg-gunmetal | #1B1F23 |
| 面板悬浮/强调底色 | bg-concrete | #3A3F47 |
| 核心主色/交互色 | color-acid | #39FF14 (Reactor-core Green) 或 #4DA8DA (Sky Blue，这里选用 #39FF14 作为强调色) |
| 主标题/白字 | text-mill-white | #EDF0F4 |
| 次要文字/标签 | text-gray | #8B949E |
| 边框线 | border-steel | #30363D |
| 危险/预警色 | color-alert | #FF6B6B |

### 排版
- **数据/界面字体 (UI & Data)**: `JetBrains Mono` (CDN: `https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap`)
- **正文与辅助阅读 (Body)**: `DM Sans` (CDN: `https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap`)
- **h1 (Hero 大数据/大标题)**: JetBrains Mono, 4rem (64px) - 6rem (96px), weight 800, leading 1.1, uppercase
- **h2 (区块标题)**: DM Sans, 2rem (32px), weight 700, leading 1.2
- **h3 (卡片标题/指标名)**: JetBrains Mono, 1.25rem (20px), weight 700, uppercase, tracking-wider
- **body (正文说明)**: DM Sans, 1rem (16px), weight 400, leading 1.6, text-gray
- **caption (微小数据/状态)**: JetBrains Mono, 0.75rem (12px), weight 400, text-acid 或 text-gray

### 间距 / 圆角 / 阴影
| 属性 | 关键值 | 说明 |
|-----|--------|------|
| 间距 (Spacing) | 4/8/16/24/48/96px | 采用 8pt 栅格，网格之间的 gap 采用 1px (实现极细边框分割) 或 16px/24px |
| 圆角 (Radius) | 0px (None) | 贯彻 Neubrutalism 和控制室风格，绝对硬朗，**不用任何圆角** |
| 阴影 (Shadow) | none 或 hard-offset | 卡片无软阴影，若需悬浮效果采用 1px 实线边框配合背景色变化，或硬投影 (如 `4px 4px 0px #39FF14`) |

### 动效节奏
- 快速 (100-150ms): 数据跳动、Hover 卡片高亮边框、Button 状态切换。
- 正常 (300-400ms): 3D 模型热点点击后相机的平滑推拉 (Tween)、Tab 切换时的数据重绘。
- 慢速 (800-1200ms): 首屏加载时的“控制室启动”序列动效（线框勾勒、网格展开、数据瀑布流）。
- 缓动：`cubic-bezier(0.16, 1, 0.3, 1)` (极具爆发力且迅速收敛的数字科技感缓动)。

## 组件规范

### 1. 3D Blueprint Viewer (全景 3D 视图器)
- **作用**：展示数字孪生风格的工厂流水线/机械臂，作为视觉锚点与交互入口。
- **气质**：科幻、精密、线框感、实时渲染。
- **状态**：
  - default: 缓慢自动旋转，展示全貌。
  - hotspot-hover: 热点发光放大，出现数据预览 tooltip。
  - hotspot-active: 相机推进，热点锁定，左侧/右侧滑出对应的 Dashboard 数据面板。
- **联动**：点击热点直接更新全局 Context，联动下方或侧边的数据图表及 ROI 估算器参数。

### 2. Bento Data Card (数据便当盒卡片)
- **作用**：承载单个业务指标或对比图表（Echarts）。
- **气质**：坚硬、工业风、信息密度极高。
- **状态**：
  - default: 灰暗的 gunmetal 底色，细边框。
  - hover: 边框亮起 acid-green，内部数据有微小的高亮脉冲。
- **联动**：作为数据展示容器，响应筛选器或 3D 视图的选中状态，触发 Echarts `setOption` 更新动画。

### 3. ROI Estimator Panel (计算器面板)
- **作用**：输入参数，输出预测价值。
- **气质**：类似飞机驾驶舱的输入面板，大号等宽字体反馈。
- **状态**：
  - input-focus: 边框变色，光标闪烁。
  - calculating: 数字快速滚动 (Number Scramble) 效果，持续 300ms 后定格。
- **联动**：独立计算组件，但其基准参数受当前“选中的行业案例”影响。

## 页面交互清单
- [ ] **首屏启动序列**：页面加载时，3D 模型从网格线框中渐渐生成（Fade in / Wireframe to Solid），同时侧边栏卡片按次序滑入。
- [ ] **3D 热点交互**：在 Three.js Canvas 中点击不同节点（例如：预见性维护节点、能耗监控节点），触发相机平滑移动对焦。
- [ ] **全局数据联动**：3D 热点或行业 Tab 被点击时，同步更新 Echarts 实例（折线图/柱状图），图表应带有数据变形过渡动画，而非生硬替换。
- [ ] **ROI 实时推算**：在估算器表单修改数字后，监听 `input` 事件，实时滚动更新大字号的 ROI 预测结果（带数字累加动画）。
- [ ] **Bento Grid 悬浮**：鼠标在不同的模块卡片上移动时，卡片边缘或局部高亮，提供清脆的“控制面板”操作反馈。

## 视觉特效方案

### 生成式视觉层 / 3D 空间
- **技术**：`Three.js` (CDN 引入)
- **算法/场景**：渲染一个高度抽象的工业结构（如传送带、管道或几何体拼装的厂房）。使用 `WireframeGeometry` 或带有边缘发光的材质（`MeshBasicMaterial` 配合发光特效）。
- **区域**：占据首屏的左半部分或作为大背景沉浸式存在。
- **参数范围**：深色背景，青绿色（#39FF14）的发光线条，整体带有极轻微的噪点（Post-processing Noise，可选）。
- **与内容层关系**：3D Canvas 固定或通过 Grid 布局放置在一个专属区域内，上方可以覆盖绝对定位的 HTML Tooltip（用作热点提示）。
- **CDN**：`https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`, `https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js`

### 图表数据层
- **技术**：`ECharts` (CDN 引入)
- **外观**：完全定制的深色主题，去掉默认背景，网格线使用极暗的灰色（#30363D），折线图使用高光色（#39FF14）带有阴影发光（shadowBlur），区域填充（areaStyle）使用渐变透明度。
- **CDN**：`https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js`

### 动效方案
- **入场动画**：使用 `GSAP`。对页面的卡片、标题执行 staggered reveal，带轻微的 Y 轴偏移（类似机器启动依次点亮）。
- **交互动效**：原生 CSS transition 用于 Hover 效果；GSAP 用于相机视角的平滑转换；自定义 JS 用于 ROI 数字的快速滚动动画。
- **CDN**：`https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js`

### 降级策略
- 若 Three.js 在极低端设备加载失败或帧率过低，隐藏 Canvas，降级展示一张带有网格线和高亮标注的高清 WebP 静态背景图。

## Tailwind 配置

```js
tailwind.config = {
  theme: {
    extend: {
      colors: {
        void: '#0B0B0F',
        gunmetal: '#1B1F23',
        concrete: '#3A3F47',
        acid: '#39FF14',
        'mill-white': '#EDF0F4',
        steel: '#30363D',
        alert: '#FF6B6B'
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      boxShadow: {
        'hard': '4px 4px 0px 0px rgba(57, 255, 20, 1)', // #39FF14 hard shadow
      }
    }
  }
}
```

## 禁止事项
1. **绝对禁止使用柔和阴影和圆角**：不要出现 `rounded-lg` 或 `shadow-lg`，这是一套硬核的 B2B 控制面板。
2. **禁止五颜六色的图表**：Echarts 图表不能使用默认的多彩配色，必须严格限制在 Acid Green、Void Black、Steel Gray 和 White 的体系内，可以用透明度来区分数据系列。
3. **禁止内容平铺直叙**：必须把数据和指标放在最显眼的位置，用大号等宽字体砸向用户，文案说明作为辅助。
4. **禁止 3D 模型孤立存在**：3D Canvas 不能只是个会转的动画，必须与页面的数据状态或点击事件建立真正的联动响应。