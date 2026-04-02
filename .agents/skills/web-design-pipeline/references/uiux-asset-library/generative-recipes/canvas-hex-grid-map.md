# Canvas 六边形地图生成

## 名称

**Canvas Hex Grid Map** — Canvas 六边形网格模拟地图

## 来源

case 005_car-intelligence，2026-03-16

## 适用场景

- 需要地图视觉但无法或不需要接入真实地图的场景（演示、原型）
- 车载 HMI 导航模拟
- 游戏 UI 地图
- 数据可视化地理底图

## 实现策略

```typescript
// 六边形网格绘制
const hexSize = 22
const hexH = hexSize * Math.sqrt(3)
for (let row = -1; row < H / hexH + 1; row++) {
  for (let col = -1; col < W / (hexSize * 1.5) + 1; col++) {
    const x = col * hexSize * 1.5
    const y = row * hexH + (col % 2 === 0 ? 0 : hexH / 2)
    ctx.beginPath()
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6
      // ...绘制六边形
    }
    ctx.strokeStyle = 'rgba(26, 37, 53, 0.9)'
    ctx.lineWidth = 0.7
    ctx.stroke()
  }
}
```

## SVG 路线流光叠加

```typescript
// SVG polyline + CSS stroke-dashoffset 动效
<path
  d={routePath}
  stroke="#00D4FF"
  strokeWidth={3.5}
  strokeDasharray="12 8"
  style={{ animation: 'route-flow 1.6s linear infinite' }}
/>

// CSS keyframe
@keyframes route-flow {
  to { stroke-dashoffset: -40; }
}
```

## 性能优化

- Canvas 地图底图在 useEffect 中一次性渲染，不进入 rAF 循环
- 只有路线覆盖层（SVG）是动态的
- 交通状态变化时重新触发 useEffect（依赖数组传 trafficStatus）

## 结构化标签

```
visual_primitives: canvas, grid, svg-flow
motion_primitives: flow, css-animation
implementation_hints: Canvas 2D hex grid, SVG stroke-dashoffset
uiuxmax_domains: chart, style
suitable_stacks: react-ts, vue-ts
avoid_patterns: real-map-without-api, rAF-static-map
```
