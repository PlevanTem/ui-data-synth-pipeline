# Canvas 声波可视化 — AI 监听状态的生成式模式

**来源 Case**：010_meeting-collab  
**适用场景**：语音识别、AI 会议助手、实时录音、播客工具、任何"有人在说话"需要可视化的场景

---

## 概念说明

Canvas 声波条形图是传达"有声音输入正在发生"最直观的视觉语言。关键不是波形精确还原真实音频，而是让用户感知到"系统在工作"。

---

## 实现方案（React + Canvas 2D）

```typescript
// useWaveformCanvas.ts Hook

interface WaveformOptions {
  barCount?: number;   // 推荐 32-48
  color?: string;      // 与品牌强调色一致
  isActive?: boolean;  // 是否有声音输入（影响振幅）
}

// 算法：双 sin 叠加模拟噪声
const amplitude = isActive
  ? normalizedNoise          // 发言时：全振幅
  : normalizedNoise * 0.15 + 0.05;  // 静默时：5-20% 振幅（保持"活着"的感觉）

// 参数建议
barWidth: 3px
barGap: (canvasWidth - barCount * barWidth) / (barCount + 1)
maxHeight: 40-60px
minHeight: 4px
fps: 60 (requestAnimationFrame)
opacity: isActive ? 0.5 + noise * 0.5 : 0.25
```

---

## 关键工程约束

1. **生命周期管理**：组件 unmount 时必须 `cancelAnimationFrame`，否则内存泄漏
2. **prefers-reduced-motion**：检测到时停止动画，显示静态条形或静止图标
3. **画布尺寸**：Canvas width/height 属性（渲染分辨率）与 CSS 样式尺寸分离，避免模糊
4. **复用**：封装为 React Hook + 组件对，可在多处复用不同参数

---

## 视觉变体

| 变体 | 适用场景 | 特征 |
|------|----------|------|
| 条形声波 | 宽屏会议界面 | 32-48 条，底部对齐 |
| 对称条形 | 中央 hero 区 | 从中线向两侧扩展 |
| 圆形声波 | 头像周围 | 极坐标映射 |
| 点阵声波 | 极简风格 | 3-7 个跳动圆点 |

---

## 不适用场景

- 内容密集的数据表格页面（分散注意力）
- 纯文档阅读工具（干扰阅读节奏）
- 性能受限的低端设备（需提供静态降级）

---

## 结构化标签

```
style_keywords: ["waveform", "audio-visualization", "ai-ambient", "functional-generative"]
interaction_level: "low"
visual_primitives: ["wave", "bars", "field"]
motion_primitives: ["oscillation", "noise-driven", "data-mapping"]
generative_primitives: ["noise-field", "wave"]
implementation_hints: ["Canvas 2D API", "requestAnimationFrame", "React useEffect + useRef"]
uiuxmax_domains: ["style", "ux", "stack"]
suitable_stacks: ["react+ts", "vue+ts", "svelte+ts", "vanilla-ts"]
avoid_patterns: ["webgl-overkill", "complex-fft", "static-placeholder"]
```
