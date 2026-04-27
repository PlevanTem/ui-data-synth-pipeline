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
   - **固定** 品牌设计相关如（字体、浅色、底色）、seed 导航、操作按钮
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
