---
name: generative-ui
description: 交互式 UI 生成与算法艺术技能。覆盖两类场景：(1) 在网站中嵌入生成式视觉层（Canvas/WebGL/p5.js background、hero 动效、数据可视化、交互模拟器、游戏等交互组件）；(2) 生成独立算法艺术作品。基于 Google Generative UI 论文核心原则：交互优先、无占位符、数据驱动、视觉效果服务内容。适用关键词：WebGL、Canvas、p5.js、Three.js、交互式 UI、生成式 UI、数据可视化、粒子系统、流场、模拟器、噪声动效、算法艺术、generative art。
---

# Generative UI

这个 skill 覆盖两个使用场景，工作在同一技术栈上，但服务于不同目标：

1. **网站视觉层与交互组件**：嵌入式 Canvas / WebGL / p5.js 模块，必须服务于网站内容和叙事
2. **独立算法艺术**：自包含生成艺术作品，强调视觉哲学和美学探索

核心哲学（来自 [Google Generative UI 论文](https://generativeui.github.io)）：

- **交互优先**：可以用静态图解决的，优先做成可交互的
- **无占位符**：所有元素完整实现或不出现，不留示意性假数据
- **数据驱动**：视觉层服务于内容信息，不遮盖它
- **无文字墙**：能用视觉和交互传达的，不用大段文字

---

## 先判断：用哪种模式

| 上游 `visual_effects.json` 说什么 | 对应模式 |
|----------------------------------|---------|
| 需要 background / 氛围层动效 | **Mode A** |
| 需要数据可视化 / 交互组件 / 模拟器 | **Mode B** |
| 明确要求算法艺术作品 / 没有 visual_effects 上下文 | **Mode C** |

---

## Mode A：生成式背景层

用于网站的视觉氛围——背景、hero 装饰、section 过渡动效。

### 使用前提

只在满足以下条件时实施 Mode A：

- Designer Agent 的 `visual_effects.json` 明确建议
- 效果能强化产品叙事（不是"为了酷"）
- 主内容可读性不受影响
- 有降级方案（静态或 CSS 版本）

### 效果选型

| 效果 | 适用产品语境 | 推荐实现 |
|------|------------|---------|
| 流场粒子 (flow field) | AI、数据、技术基础设施 | Canvas 2D + Perlin noise |
| 几何网格 + 涟漪 | SaaS 工具、设计平台 | Canvas 2D / SVG |
| WebGL shader 渐变 | 高端品牌、创意机构 | Three.js 或 raw GLSL |
| 噪声地形 / 波浪 | 环境、科学、探索 | Canvas 2D + simplex noise |
| 有机生长系统 | 生命科学、自然主题 | p5.js |
| 深空粒子 | 探索类、科幻产品 | Canvas 2D |

### 标准实现结构

```javascript
class GenerativeLayer {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d'); // 或 'webgl'
    this.params = {
      seed: options.seed || 42,
      intensity: options.intensity || 0.5,   // 供外部主题控制
      colorPalette: options.colorPalette || [],
      particleCount: Math.min(options.particleCount || 80, 300), // 上限保护
      ...options
    };
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // reduced-motion 必须支持
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) { this.renderStatic(); return; }

    // 页面隐藏时暂停（节省性能）
    document.addEventListener('visibilitychange', () => {
      this.running = !document.hidden;
      if (this.running) this.start();
    });

    this.setup();
    this.start();
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.canvas.offsetWidth * dpr;
    this.canvas.height = this.canvas.offsetHeight * dpr;
    if (this.ctx.scale) this.ctx.scale(dpr, dpr);
  }

  setup()       { /* 初始化粒子 / 网格 / 场 */ }
  update()      { /* 每帧逻辑更新 */ }
  render()      { /* 绘制 */ }
  renderStatic(){ /* reduced-motion 静态降级 */ }

  start() {
    this.running = true;
    const loop = () => {
      if (!this.running) return;
      this.update();
      this.render();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  // 供外部调用：主题切换、页面状态变化
  updateParams(patch) { Object.assign(this.params, patch); }
  stop()  { this.running = false; }
}
```

---

## Mode B：交互式组件

用于功能性交互 UI——数据可视化、模拟器、游戏、探索器。

### 核心原则（论文直接引用）

> "Even for simple queries that *could* be answered with static text, your primary goal is to create an **interactive application**."

不要做静态图表，要做：

- 可以 hover 看 tooltip、点击筛选、拖拽探索的
- 让用户感受到数据形状和动态，而不只是看数字
- 参数可调，用户能看到变化

### 组件类型

**① 数据可视化**

适合：dashboard 指标、时间线、关系图、热力图、地理分布

```javascript
// 实现要素：
// - 数据绑定（真实数据或合理模拟，不是写死的假数据）
// - 交互（hover tooltip、click drill-down、legend filter）
// - 缩放（zoom + pan，尤其时间线和关系图）
// - 空状态 / 加载状态

// 库选择：
// D3.js — 高度定制，复杂关系图
// Chart.js — 常规图表，快速实现
// 自写 Canvas — 高密度数据、定制渲染
```

**② 模拟器**

适合：物理、生物群体、城市交通、经济、气候

```javascript
// 实现要素：
// - 用户可调参数（滑块 / 选择器，但参数要对用户有意义）
// - 运行控制（播放/暂停/重置）
// - 实时指标（速度、密度、压力等）
// - 参数命名规则：

// Bad（暴露实现）：{ noise_octaves: 4, perlin_scale: 0.003 }
// Good（用户关心）：{ complexity: 0.7, speed: "medium", density: "comfortable" }
```

**③ 探索器**

适合：分形/数学概念、地图、内容集合、知识图谱

```javascript
// 实现要素：
// - 缩放/平移控制（鼠标滚轮、触控手势）
// - 搜索/过滤
// - 用户有控制感（不是被动播放）
```

**④ 游戏**

适合：教育类内容、品牌互动、轻娱乐

```javascript
// 实现要素：
// - 明确规则（首次进入有引导）
// - 即时反馈（视觉+音效）
// - 进度感（分数、关卡、成就）
// - 可重玩（重置不刷新页面）
```

### 实现要求（强制）

- 所有控件真实可用，无 placeholder 元素
- 没有写死的 `[1, 2, 3, 4, 5]` 假数据——用真实数据或参数化生成
- 必须有空状态、加载态、错误态
- 键盘可访问（focus visible、Enter/Space 触发关键操作）
- 移动端基本可用（touch events、viewport 适配）

---

## Mode C：独立算法艺术

生成可分享的独立算法艺术作品。保留原 `algorithmic-art` 的完整工作流。

### 第一步：算法哲学创作

写一个 4-6 段的生成艺术运动宣言，说明：

- 计算过程和数学关系
- 噪声函数和随机性模式
- 粒子行为和场动力学
- 时间演化和系统状态
- 参数变化和涌现复杂性

**关键要求**：

- 反复强调匠艺性——最终算法应看起来经过无数次精心迭代，是计算美学领域顶尖专家的产物
- 强调"美在算法执行的过程中，而非最终画面"
- 为实现步骤留足创作空间

**命名模式**（1-2 个词）：

- "有机湍流 / Organic Turbulence"
- "量子和声 / Quantum Harmonics"
- "随机结晶 / Stochastic Crystallization"
- "场动力学 / Field Dynamics"

### 第二步：概念种子提取

从用户请求中提炼一个微妙的概念线索——嵌入算法内部，不显式说明。像爵士乐手在和声中引用另一首曲——只有懂的人感受到，但所有人都欣赏到生成美。

### 第三步：p5.js 实现

**⚠️ 先读取 `templates/viewer.html`，以它为严格起点，不要从零写 HTML。**

技术要求：

```javascript
// Seeded Randomness（Art Blocks 模式）
let seed = 12345;
randomSeed(seed);
noiseSeed(seed);

// 参数结构
let params = {
  seed: 12345,
  // 覆盖：数量、尺度、速率、概率、比例、角度、阈值
};

// Canvas 标准结构
function setup() {
  createCanvas(1200, 1200);
  // 初始化系统
}

function draw() {
  // 生成算法
  // 可以是静态（noLoop）或动态
}
```

**匠艺要求**：

- 复杂而不嘈杂，有序而不死板
- 色彩和谐，有语义逻辑，不是随机 RGB
- 相同 seed 必须产生完全相同输出
- 每个参数调整都让人感受到可控的美学变化

### 输出格式

1. 算法哲学 `.md` 文件
2. 基于 `templates/viewer.html` 的单文件 HTML 交互查看器
   - **固定**：Anthropic 品牌（Poppins/Lora 字体、浅色、渐变底色）、seed 导航、操作按钮
   - **可变**：p5.js 算法本身、参数定义、参数 UI 控件

---

## WebGL 使用指南

WebGL 适合但要谨慎：

**适合用 WebGL**：

- GPU 加速大量粒子（>10K 以上才有明显优势）
- GLSL shader 效果（光照、折射、流体、噪声材质）
- 高端品牌要求视网膜级细腻质感

**不适合用 WebGL**（用更轻量方案）：

- 常规数据可视化 → Canvas 2D 或 SVG
- 简单动效 → CSS / SVG animation
- 不确定性能边界 → 先 Canvas 2D，有证据再升级

**Three.js 最小模板（含清理机制）**：

```javascript
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);

// 必须有 dispose（防内存泄漏）
function dispose() {
  renderer.dispose();
  scene.traverse(obj => {
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach(m => m.dispose());
    }
  });
}
```

---

## 性能检查清单

完成任何 Canvas / WebGL 实现后过一遍：

- [ ] particle count 有上限（mobile ≤ 100，desktop ≤ 500）
- [ ] 使用 `requestAnimationFrame`，不用 `setTimeout`
- [ ] resize 时正确重新初始化
- [ ] `document.visibilitychange` 时暂停动画
- [ ] 支持 `prefers-reduced-motion`（静态降级或关闭）
- [ ] Three.js 场景有 `dispose` 清理
- [ ] 不影响主内容层的可读性（z-index、opacity、pointer-events）
- [ ] 移动端 touch events 已处理

---

## Mode D：动效组件库集成（新增 2026）

当 Designer Agent 的 `visual_effects.json` 要求"精致的微交互、文字动效、品牌感按钮、特效背景组件"，且目标栈为 React / Next.js 时，MagicUI / ReactBits / AnimateUI 是与 shadcn/ui 同层级的**组件增强层**（不是独立框架），通过 MCP 集成后可与 Canvas/WebGL 等 generative 层并行叠加使用。

### 三大核心动效组件库对比

| 库 | 定位 | 核心特色 | 安装方式 | MCP 支持 |
|---|---|---|---|---|
| **MagicUI** | SaaS / landing page 专用 | Globe、Bento Grid、Text Animate、Border Beam、Particles、Marquee、Dot/Grid Pattern 背景系列 | `npx shadcn@latest add <component>` | `npx @magicuidesign/mcp@latest` |
| **ReactBits** | 泛用动效组件 | Dither、FlowField、Aurora 等独立生成式背景；FadeContent、BlurIn 等交互动效；文字动效系列 | shadcn registry `@react-bits` | shadcn MCP + `@react-bits` registry |
| **AnimateUI** | 基于 Radix/Framer Motion | Button（hoverScale/tapScale）、Dialog、Popover 等含物理感动效的 headless-animated 组件；与 shadcn/ui 风格高度兼容 | `npx shadcn@latest add animate-ui/<component>` | shadcn MCP（同 ReactBits）|

### 何时使用哪个库

```
if (需要"Globe 地球仪、Orbiting Circles、AnimatedBeam 连线")
  → MagicUI（最丰富的 SaaS 展示性组件）

if (需要"Dither 蚀刻背景、FlowField 流场、Aurora 极光、独立生成式背景")
  → ReactBits（最接近 generative art 的背景系列）

if (需要"带物理感弹性动画的表单/弹窗/按钮，且要保持与 Radix 兼容")
  → AnimateUI（最适合交互组件级动效）

if (需要"Text Animate / Blur Fade / Morphing Text / Word Rotate / Number Ticker")
  → MagicUI 文字动效系列（最全面）

if (需要"FadeContent / SplitText / CountUp / TextPressure")
  → ReactBits 文字动效系列
```

### MCP 集成方法（在 Cursor 中）

```bash
# MagicUI MCP（推荐用于 Next.js + shadcn 项目）
npx @magicuidesign/cli@latest install cursor

# ReactBits + AnimateUI（通过 shadcn MCP + registry）
# 1. 在 components.json 中添加 registry：
{
  "registries": {
    "@react-bits": "https://reactbits.dev/r/{name}.json"
  }
}
# 2. 启用 shadcn MCP server（Cursor 下运行）
npx shadcn@latest mcp init --client cursor
```

**使用 MCP 的提示词范例（可直接用于 AI IDE）**：
- `"Add the Dither background from React Bits to the hero section, make it slate-blue"`
- `"Add a vertical Marquee of technology logos using MagicUI"`
- `"Add MagicUI Globe component to the world coverage section"`
- `"Add MagicUI BlurFade text animation to the heading"`
- `"Add AnimateUI Button with hoverScale=1.08 and tapScale=0.94"`

### 效果选型扩展表（补充 Mode A/B）

| 效果分类 | 具体效果 | 推荐来源 | 适用产品语境 | 实现提示 |
|---------|---------|---------|------------|---------|
| **生成式背景** | Dither / Aurora / FlowField | ReactBits | AI 工具、创意机构、科技产品 | ReactBits registry 直接安装 |
| **生成式背景** | Grid Pattern / Dot Pattern / Flickering Grid | MagicUI | SaaS 工具、dashboard、开发者工具 | MagicUI MCP 安装 |
| **生成式背景** | Retro Grid / Warp Background | MagicUI | 品牌站、营销页、复古科技 | MagicUI MCP 安装 |
| **特效组件** | Globe（3D 地球） | MagicUI | 全球化平台、地图类产品 | Three.js 封装，注意移动端降级 |
| **特效组件** | Orbiting Circles / Animated Beam | MagicUI | AI 工具关系图、连接叙事 | CSS animation + SVG |
| **特效组件** | Particles / Meteors / Confetti | MagicUI | 庆祝态、科技感氛围 | Canvas 粒子，注意上限 |
| **文字动效** | Text Animate / Blur Fade / Word Rotate | MagicUI | 品牌 hero 区、标题序列 | Framer Motion 封装 |
| **文字动效** | Morphing Text / Hyper Text / Aurora Text | MagicUI | AI / 变形叙事产品 | GSAP / CSS clip 技术 |
| **文字动效** | SplitText / FadeContent / TextPressure | ReactBits | 内容型网站、scroll-driven | IntersectionObserver |
| **文字动效** | Scroll Based Velocity / Text Reveal | MagicUI | 滚动叙事、品牌故事 | scroll-driven animations |
| **交互组件** | Magic Card（鼠标跟踪渐变）| MagicUI | 卡片悬停、产品展示 | CSS 变量 + mousemove |
| **交互组件** | Shine Border / Border Beam | MagicUI | 卡片高亮、Premium 感 | CSS 动画描边 |
| **交互组件** | AnimateUI Button（物理感）| AnimateUI | 所有需要"手感"的 CTA | Framer Motion spring |
| **Marquee 跑马灯** | Marquee / Scroll Based Velocity | MagicUI | Logo 墙、评论流、合作伙伴 | CSS animation |
| **数据展示** | Bento Grid | MagicUI | Feature 展示、SaaS 落地页 | CSS Grid + Framer Motion |
| **设备 Mock** | iPhone / Android / Safari 模拟 | MagicUI | 移动 App 产品展示 | SVG frame + 内容插槽 |

### 工程注意事项

```typescript
// 1. MagicUI / ReactBits 组件默认依赖 Framer Motion，确保已安装
// npm install framer-motion

// 2. AnimateUI 需要 Radix UI 基础组件（通常 shadcn/ui 项目已包含）

// 3. Globe 组件依赖 cobe（WebGL 地球库）
// npm install cobe

// 4. 所有动效组件都应遵守 prefers-reduced-motion
// AnimateUI / MagicUI 大多数组件已内置，自定义时记得加：
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 5. 这些库的组件是"复制到项目中"模式（不是 npm 包）
// 通过 CLI 安装后直接在 src/components/ui/ 下编辑
```

### 与 generative-ui Mode A/B 的组合策略

```
Mode A（自写 Canvas 生成层）+ MagicUI 文字动效  → 高端品牌站
Mode A（ReactBits Dither/Aurora 背景）+ AnimateUI 交互组件  → AI 工具 / 创意产品
Mode B（D3/Chart 数据可视化）+ MagicUI Bento Grid 布局  → SaaS dashboard
Mode B（Three.js 3D 场景）+ MagicUI Globe + Orbiting Circles  → 全球化平台 hero
Mode C（算法艺术）独立作品 → 不引入这些库，保持纯算法美学
```

---

## 参考资源

- `templates/viewer.html` — Mode C 独立艺术的 HTML 起点（严格按模板来）
- `templates/generator_template.js` — p5.js 结构和 seeded randomness 最佳实践
- [Google Generative UI 论文](https://generativeui.github.io) — Mode B 的设计哲学与案例来源
- [MagicUI 组件库](https://magicui.design/docs/components) — SaaS / landing page 动效组件
- [ReactBits 组件库](https://reactbits.dev/get-started/index) — 生成式背景 + 文字 + 交互动效
- [AnimateUI 组件库](https://animate-ui.com/docs/components) — 基于 Framer Motion 的物理感组件
- [Vercel Next.js Templates](https://vercel.com/templates/next.js) — Next.js 生产级模板参考（AI、电商、SaaS、博客）
