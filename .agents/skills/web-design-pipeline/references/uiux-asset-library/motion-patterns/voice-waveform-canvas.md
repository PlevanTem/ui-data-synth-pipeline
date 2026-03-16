# Canvas 语音交互波形动效

## 名称

**Voice Waveform Canvas** — 语音控制多态波形 Canvas 动效

## 适用场景

- 语音助手 / 语音控制界面
- 录音/识别状态的视觉反馈
- AI 对话界面的聆听状态表达

## 四种状态与视觉语言

| 状态 | 视觉描述 | 颜色 | 动效 |
|-----|--------|-----|-----|
| listening | 多频段波形条，响应振幅变化 | #4E9EFF (蓝) | 持续脉冲 |
| processing | 旋转点阵，收缩聚焦感 | #4E9EFF | 旋转 + 透明度渐变 |
| success | 同心圆脉冲 + checkmark | #34D399 (绿) | 扩散脉冲 |
| error | 横向震动 + X 标 | #FF5C5C (红) | shake 震动 |

## Canvas 2D 实现要点

```typescript
// listening 状态：多频段波形条
const barCount = 24
for (let i = 0; i < barCount; i++) {
  const phase = time + i * 0.35
  const amplitude = 0.3 + 0.7 * Math.abs(Math.sin(phase))
  const barH = 10 + amplitude * 35
  // draw rounded rect
}

// processing 状态：旋转点
const dotCount = 8
for (let i = 0; i < dotCount; i++) {
  const angle = (i / dotCount) * Math.PI * 2 + time * 2
  const opacity = (i / dotCount + time * 0.5) % 1
  // draw arc with opacity
}
```

## 性能注意

- Canvas 尺寸固定（280×100），不依赖 window resize
- 状态切换时 cancelAnimationFrame 旧循环
- idle 状态不启动 rAF 循环

## 结构化标签

```
motion_primitives: waveform, pulse, shake, spin
visual_primitives: canvas, particles, status-color
implementation_hints: Canvas 2D, requestAnimationFrame, state-driven animation
uiuxmax_domains: ux, motion
suitable_stacks: react-ts (canvas ref), vue-ts (canvas ref)
avoid_patterns: static-mic-icon, no-state-differentiation
```
