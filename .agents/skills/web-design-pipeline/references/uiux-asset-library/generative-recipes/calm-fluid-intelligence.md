# Calm Fluid Intelligence (静谧流体智能)

## 适用场景
- AI 工具、办公协作软件、需要长时间专注的效率工具
- 强调"系统无处不在但绝不打扰"的 Agentic AI 产品
- 目标情绪是 Calm、Focus 的专业级 SaaS

## 不适用场景
- 需要强视觉刺激的电竞、娱乐营销页
- 需要明确品牌大面积撞色的消费品官网

## 风险点
- 流体粒子的渲染如果缺乏节制，容易导致笔记本发热、风扇狂转
- 对比度如果调得过低，在劣质显示器上可能完全看不见流体动画，导致氛围丢失

## 核心参数
- `style_keywords`: calm ui, fluid, generative, low-contrast, agentic ai, invisible interface
- `interaction_level`: medium
- `visual_primitives`: flow-field, soft-glow, frosted-glass (minimal)
- `motion_primitives`: spring-physics, spatial-transition
- `generative_primitives`: particles, noise-field, canvas-2d
- `implementation_hints`: HTML5 Canvas (requestAnimationFrame), Framer Motion, Zustand
- `uiuxmax_domains`: style, ux, stack
- `suitable_stacks`: react, svelte, framer-motion
- `avoid_patterns`: 赛博朋克紫蓝色高饱和渐变、深层厚重毛玻璃、粗糙的进度条、全屏占位的 AI 思考弹窗

## 组合策略 (Generative Combination)
使用 Canvas 流场(Flow Field)作为最底层的氛围背景。其颜色与背景色的色差控制在 5% 以内，只提供几乎察觉不到的明暗涟漪。
将流场的速度(speedMultiplier)与用户的全局麦克风输入状态、AI的思考状态进行物理绑定。当有语音输入或 AI 生成时，流体速度加快，形成呼吸感。
配合使用 Framer Motion 的 spring 弹簧动画（模拟现实物理世界的拉扯感），用于组件模块在不同设备视口下的流转和悬浮拖拽。