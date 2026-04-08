# Style Recipe: Temporal Architecture — Luxury Property Dark Editorial

## 适用场景
- 奢侈地产、精品酒店、建筑事务所品牌站
- 任何需要「工具感 + 高端感」并存的调度/排期产品
- 用「时间」或「环境条件」作为核心交互维度的产品

## 不适用场景
- 轻量消费品电商（需要明亮/活力感）
- SaaS B2B工具（太偏艺术感，降低效率感知）
- 年轻用户为主的社交产品

## 设计哲学
> 不把UI设计成工具，而是设计成一个能感知时间的空间。  
> 数据操作的外壳是建筑质感，功能逻辑是时钟逻辑。

## Token 定义

| 用途 | 值 |
|-----|----|
| 全局背景 | #0A0907（极暖深黑，接近碳化木质感） |
| 表面层 | #14120E |
| 卡片/面板 | #1C1914 |
| 边框微妙 | #2C2820 |
| 边框明显 | #3E3830 |
| 主文字 | #F2EADB（暖白，非纯白，降低疲劳） |
| 次文字 | #9E9080 |
| 辅文字 | #5E5548 |
| 主强调（默认） | #C8924A（琥珀金） |
| 动态强调 | CSS var(--ta)，随活跃主题变化 |

## 字体搭配
- **标题体**：Cormorant Garamond（高对比度衬线，建筑事务所/高端时装感）
- **数据体**：DM Mono（等宽，数字/标签/时间戳用，不要用在正文）
- **搭配原则**：Cormorant负责情感，DM Mono负责精度，两者形成视觉张力

## 配色策略
- 底色使用极暖深黑（有木质/皮革质感），而非纯黑（太冷硬）或深蓝（太科技）
- 强调色只有一个，但通过CSS变量实现随「活跃状态」动态切换
- 5种主题色各自对应不同情绪温度（暖橙/冷蓝/节日红/夕阳橙/自然绿）
- 文字层使用暖米白，避免纯白在暖底色上的刺眼感

## 核心视觉技巧：动态CSS变量主题切换
```javascript
// 三个变量控制全局氛围
document.documentElement.style.setProperty('--ta', theme.accent);     // 强调色
document.documentElement.style.setProperty('--ta-rgb', theme.rgb);   // 用于rgba()
document.documentElement.style.setProperty('--tg', theme.glow);      // 环境光晕
```
所有边框、按钮、选中态、底层光晕均通过这三个变量驱动，切换一行代码影响全局。

## Canvas 时间光效系统（核心生成式视觉）
```
算法族群：多层线性渐变 + 径向光晕 + 梯形光柱 + 确定性尘埃粒子
核心参数：
  - 10段色温阶段（6AM→10PM），三通道lerp插值
  - 光柱位置随时间归一化值 t 从左向右移动（模拟日照角度）
  - 720个伪随机粒子（sin函数种子，不依赖Math.random，不闪烁）
  - Vignette暗角加强空间深度
性能策略：
  - 只在交互时重绘（非持续requestAnimationFrame）
  - 节省性能，不影响响应感
```

## 结构化标签

```yaml
style_keywords: [luxury, editorial, temporal, architectural, refined, dark-warm]
interaction_level: immersive
visual_primitives: [gradient, light-shaft, dust-particles, vignette, glow, depth]
motion_primitives: [css-keyframe, css-transition, canvas-on-demand, lerp-color]
implementation_hints: [Canvas2D, CSS-custom-properties, Chart.js, Tailwind-CDN]
uiuxmax_domains: [style, color, ux, chart, landing]
suitable_stacks: [html-tailwind-js, Next.js, SvelteKit]
avoid_patterns:
  - 紫蓝渐变 + glassmorphism
  - Space Grotesk / Inter 作为标题字
  - 纯黑底色（失去暖质感）
  - 霓虹发光效果
  - 居中三栏等高卡片 hero 区
  - 全屏动效背景持续占用GPU
```

## 验证来源
- Veloria Estates (Behance, Feb 2026)：2026奢侈地产主流配色与排版证据
- Woodlight (Awwwards HM, Jun 2025)：深色暖底 #09101E + 响应式shader precedence
- Living Canvas (Awwwards, 2023)：时间驱动WebGL画布的可行性与设计认可度证据
