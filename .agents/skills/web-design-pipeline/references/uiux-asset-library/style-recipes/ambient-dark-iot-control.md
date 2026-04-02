# Ambient Dark Control 风格食谱

## 风格名称

**Ambient Dark Control** — 暗色环境感控制台风格

## 适用场景

- 智能家居控制、IoT Dashboard
- 需要长时间使用（夜间高频）的控制类产品
- 面向中产及以上用户的 Premium 产品
- 设备状态是核心信息承载体的界面

**不适用**：
- 以浏览/发现为主的内容产品
- 高可及性要求（低视力用户）
- 明亮办公环境下的 SaaS 工具

## 色彩策略

```css
--bg-primary: #0D0F14;      /* 近黑，带蓝灰调，避免纯黑廉价感 */
--bg-secondary: #161921;    /* 深炭蓝，卡片底色 */
--surface-glass: rgba(255,255,255,0.06);
--backdrop: blur(16px);

/* 设备类型发光色编码 */
--glow-light: #FFD700;      /* 照明 */
--glow-climate: #60A5FA;    /* 空调/气候 */
--glow-security: #34D399;   /* 安防 */
--glow-entertainment: #A78BFA; /* 娱乐 */
--glow-appliance: #FB923C;  /* 家电 */
```

## 核心视觉规则

1. **设备状态 = 发光**：开启时卡片背景有 radial-gradient 渐变 + box-shadow glow，关闭时完全熄灭感
2. **磨砂玻璃层次**：背景/卡片/激活层/浮层 4个深度层次，通过 backdrop-filter 强度区分
3. **温暖圆角**：卡片20px圆角，避免锐利棱角，保持居家感
4. **空间感背景**：Canvas 噪声流动背景增加景深，避免纯色背景的单薄感

## 实现要点

### 设备发光 CSS 模式

```css
/* 设备开启状态卡片 */
.device-card-on {
  background: radial-gradient(circle at 20% 20%, var(--glow-color-alpha) 0%, rgba(22,25,33,0.8) 60%), rgba(255,255,255,0.06);
  border: 1px solid var(--glow-color-40);
  box-shadow: 0 0 20px var(--glow-color-25), 0 4px 24px rgba(0,0,0,0.4);
  transition: all 300ms ease;
}
```

### Canvas 噪声背景（性能优化版）

- 以 1/3-1/4 分辨率计算 noise，再通过 CSS scale 放大
- requestAnimationFrame + 极慢速度（dt=0.0003/帧），避免晕眩感
- colors 数组限定在 3-4 个深色变体，避免彩色感

### 场景触发 stagger

```typescript
scene.actions.forEach((action, index) => {
  setTimeout(() => updateDevice(action), index * 120) // 每台设备间隔120ms
})
```

## 差异化分析

vs. 白底极简：有视觉层次感和Premium感，适合付费意愿高的用户
vs. 科技冷感（全蓝/全黑）：因发光色的暖调而有居家温馨感
vs. 玻璃拟态 SaaS：服务于"设备状态"内容叙事，而非纯审美

## 结构化标签

```
style_keywords: ambient-dark, device-glow, glassmorphism, iot-dashboard
interaction_level: rich
visual_primitives: glow, glass, depth, gradient, grid
motion_primitives: stagger, pulse, spring, canvas-noise
implementation_hints: CSS radial-gradient, box-shadow glow, backdrop-filter, Canvas 2D simplex-noise
uiuxmax_domains: style, color, dashboard
suitable_stacks: react-ts, vue-ts, svelte-ts
avoid_patterns: pure-white, cold-blue-only, flat-no-depth
```
