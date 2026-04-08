# Generative Recipe: Canvas 2D Interior Atmosphere — Time-Driven Light Field

## 用途
模拟室内空间在一天内不同时段的自然光氛围。适用于：
- 地产/酒店产品的「时间预览」交互
- 任何需要「环境状态可视化」的调度工具
- 需要沉浸感视觉背景但又不想引入Three.js的场景

## 核心算法

### 色温阶段映射
```javascript
// 10个关键帧：[小时, 天空色RGB, 光线色RGB, 光柱透明度, 环境颗粒透明度]
const STAGES = [
  { h:6,  sky:[14,20,36], lc:[155,182,215], ba:0.055, aa:0.018 }, // 清晨蓝
  { h:9,  sky:[30,20,9],  lc:[248,224,182], ba:0.26,  aa:0.10  }, // 上午暖金
  { h:16, sky:[15,9,4],   lc:[244,163,42],  ba:0.45,  aa:0.12  }, // 黄金时段
  { h:19, sky:[9,5,5],    lc:[188,68,36],   ba:0.22,  aa:0.07  }, // 落日橙
  { h:22, sky:[3,3,9],    lc:[20,28,62],    ba:0.045, aa:0.018 }, // 深夜蓝
];
// 时间归一化：t = (hour - 6) / 16，[0=6AM, 1=10PM]
// 相邻阶段之间三通道线性插值
```

### 光柱位置计算（模拟太阳方位角）
```javascript
// 上午：光柱在画面左侧；下午→傍晚：向右移动
const bCX = W * (0.10 + t * 0.54);  // 中心点横向移动
const skew = (t - 0.5) * W * 0.22; // 倾斜角度随时间变化

// 梯形光柱：顶窄底宽
ctx.moveTo(bCX - bW*0.22 + skew, 0);   // 顶部左
ctx.lineTo(bCX + bW*0.22 + skew, 0);   // 顶部右
ctx.lineTo(bCX + bW*0.52 - skew, H);   // 底部右（更宽）
ctx.lineTo(bCX - bW*0.52 - skew, H);   // 底部左（更宽）
```

### 确定性尘埃粒子（不闪烁）
```javascript
// 关键：用 Math.sin(i * 种子) 生成"随机"位置，而非 Math.random()
// 这样每次重绘位置不变，不会产生闪烁
for(let i=0; i<720; i++){
  const px = Math.abs(Math.sin(i*127.1+1)) * W;
  const py = Math.abs(Math.sin(i*311.7+2)) * H * 0.95;
  const inBeam = px >= beamLeft && px <= beamRight;
  const alpha = inBeam ? aa*3.0 : aa*0.55;  // 光束内粒子更亮
  ctx.arc(px, py, Math.abs(Math.sin(i*74.3))*0.75+0.2, 0, Math.PI*2);
}
```

## 渲染层次（由下到上）
1. `fillRect` — 基底暗色 #0A0907
2. `createLinearGradient(0→H*0.7)` — 天空/墙面色温
3. 梯形光柱 path — 时段主光源投影
4. `createRadialGradient` — 环境漫射光晕
5. 窗框线条 — 建筑感细节
6. 地板线 + 反射渐变
7. 尘埃粒子点阵
8. `createRadialGradient` — 径向Vignette暗角

## 性能策略
- **不用持续 requestAnimationFrame**：只在用户拖拽 Slider 时调用一次重绘
- 这样600-700粒子对性能无影响
- 响应式：监听 `window.resize` 重新计算 `canvas.width/height`

## 降级方案
Canvas不可用时，用CSS线性渐变背景模拟氛围色：
```css
background: linear-gradient(to bottom, 
  rgb(var(--sky-rgb)) 0%, 
  #0A0907 100%
);
```

## 双索引标签
```yaml
visual_primitives: [light-shaft, dust-particles, gradient, vignette, floor-reflection]
motion_primitives: [on-demand-rerender, lerp-interpolation, seeded-noise]
implementation_hints: [Canvas2D, no-CDN-required, deterministic-particles]
interaction_level: immersive
suitable_for: [property-viewer, hotel-booking, time-based-scheduler, environmental-preview]
```
