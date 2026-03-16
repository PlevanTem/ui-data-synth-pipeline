# Style Research: Nebula Commerce

## 1. 设计问题定义
- **核心挑战**：如何在移动端有限的屏幕空间内，实现高密度的商品信息展示，同时保持“Apple-style”的通透感和高级感，避免信息过载。
- **用户审美**：偏好极简、流畅、无缝的交互体验，对 iOS 原生动效有惯性认知。
- **媒介表现**：需要从静态图片列表升级为 3D/流体/知识图谱的动态探索体验。

## 2. 风格探索方向

### 方向 A：Liquid Glass (流体玻璃) - **[选中方向]**
- **关键词**：Flowing, Morphing, Blur, Depth, Spatial.
- **视觉特征**：
  - 背景使用流动的极光色块（Aurora Gradients）配合高斯模糊前置层。
  - 卡片采用高透磨砂玻璃（backdrop-filter: blur(20px)），边框带有细腻的 1px 渐变光泽。
  - 知识图谱节点像漂浮在玻璃液态环境中的气泡。
- **Generative 策略**：
  - 背景层：使用 WebGL Shader 生成实时流动的液态光影，响应陀螺仪或触摸。
  - 交互：点击商品时，玻璃卡片形态通过 Spring 物理动画平滑形变（Morph）展开。
- **适配原因**：完美契合“Apple-style 磨砂玻璃”需求，同时液态背景能提供沉浸感，解决传统列表枯燥的问题。

### 方向 B：Neumorphism 2.0 (新拟态进化版)
- **关键词**：Soft, Extruded, Tactile, Light.
- **视觉特征**：基于光影的凸起/凹陷质感，强调触感。
- **不选原因**：虽然有触感，但在展示多彩商品图片时容易显得脏，且屏幕利用率较低，不如玻璃拟态适合复杂内容叠加。

### 方向 C：Spatial Grid (空间网格)
- **关键词**：3D Layout, Perspective, Floating.
- **视觉特征**：商品悬浮在 Z 轴不同的平面上，通过视差滚动浏览。
- **不选原因**：移动端操作复杂度过高，容易造成眩晕，且对性能要求过于苛刻。

## 3. Generative 视觉与代码艺术调研
基于 2026 趋势扫描：
- **Infinite Canvas**: 知识图谱搜索将采用无限画布模式，用户可以随意拖拽探索节点关系。
- **Organic Particles**: 使用粒子系统模拟数据流动的连接线，而非僵硬的直线。
- **Shader Gradients**: 使用 Mesh Gradient Shader 替代静态图片背景，确保持续的视觉活性。

## 4. 最终选型：Liquid Glass + Spatial Data
- **核心策略**：以“流体玻璃”作为 UI 容器，承载“3D 空间数据”。
- **差异化**：
  - 拒绝死板的白色卡片，全员玻璃态。
  - 拒绝静态图表，使用 D3 + Canvas 渲染动态力导向图谱。
  - 拒绝简单的 loading spinner，使用生成式 SVG 路径动画。

## 5. 可沉淀资产建议
- **Style Recipe**: `liquid-glass-mobile-commerce` (已验证)
- **Motion Pattern**: `spring-morph-card` (卡片展开动效)
- **Generative Recipe**: `shader-aurora-background` (流体背景)
