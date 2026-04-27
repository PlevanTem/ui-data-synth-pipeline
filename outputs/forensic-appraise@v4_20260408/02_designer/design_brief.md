# Design Brief: ForensicAppraise Dashboard

## 1. 风格方向 (Style Direction)
- **主题概念**: "Clinical Precision" (临床精准)
- **视觉基调**: 严肃、专业、高科技、数据密集。采用深色模式（Dark Mode），以深蓝/石板灰为背景，辅以高对比度的医疗/科技感强调色（青色、蓝色、琥珀色），确保在昏暗的鉴定室或高亮度显示器上都能清晰阅读。
- **核心隐喻**: "数据流与生命线"。将案件的流转比作脉搏或数据流，通过动态的连线和微光效果体现案件的实时推进。

## 2. 设计系统 Tokens (Design System Tokens)
```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        slate: {
          850: '#151e2e',
          900: '#0f172a',
          950: '#020617',
        },
        clinical: {
          cyan: '#06b6d4',     // 正常/顺畅
          blue: '#3b82f6',     // 信息/常规
          amber: '#f59e0b',    // 警告/积压
          red: '#ef4444',      // 紧急/严重积压
          emerald: '#10b981',  // 完成/健康
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'], // 用于数字和代码
      },
      boxShadow: {
        'glow-cyan': '0 0 15px rgba(6, 182, 212, 0.3)',
        'glow-amber': '0 0 15px rgba(245, 158, 11, 0.3)',
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
      }
    }
  }
}
```

## 3. 组件规范 (Component Specs)
- **KPI Cards**: 采用深色毛玻璃质感（背景透明度 + backdrop-blur），左侧带有对应状态色的细边框。数字使用等宽字体，带有从 0 递增的加载动画。
- **Charts Container**: 极简边框（border-slate-800），无背景或极暗背景，图表本身使用高对比度线条和渐变填充。
- **Pipeline Flow**: 节点采用圆形图标，节点之间用带有流动光效（CSS dasharray animation）的线条连接。节点状态（如积压）通过颜色（如琥珀色脉冲）强调。
- **Estimator Widget**: 悬浮面板或侧边栏卡片，输入框采用下划线或极简边框样式。计算按钮带有微光 hover 效果。

## 4. 视觉特效方案 (Visual Effects Plan)
- **背景层 (Canvas Generative)**: 使用原生 Canvas 绘制极其微弱的、缓慢向上漂浮的粒子（代表数据点/案件），增加空间的纵深感和科技感，但不干扰数据阅读。
- **图表层 (Chart.js)**: 折线图下方使用平滑渐变填充，环形图带有 hover 放大和 tooltip 联动效果。
- **交互层 (CSS/JS)**: 
  - 案件流转管道的连接线使用 CSS `@keyframes` 实现流动光点效果。
  - 预估器计算时，显示数字快速滚动的 loading 状态，增强"AI 计算中"的感知。
- **CDN 库**:
  - Tailwind CSS (样式)
  - Chart.js (数据可视化)
  - Phosphor Icons / Heroicons (SVG 图标)