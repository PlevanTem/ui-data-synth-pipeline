# Design Brief: AI Health Management Dashboard

## 核心设计概念 (Core Design Concept)
**"Calm Insight" (平静的洞察)** —— 健康数据不需要制造焦虑。我们将复杂的体征数据封装在柔和、通透、带有轻微物理质感的UI外壳中。长辈模式则进一步将“数据解读”转化为“状态反馈”。

## 视觉原则 (Visual Principles)
1. **温暖光感 (Warm Glow)**：抛弃纯白/冷灰，使用暖色调的米白和带有环境光反射的卡片，营造治愈感。
2. **流动与呼吸 (Fluid & Breathing)**：图表和背景避免生硬的几何切割，使用流体形态和缓慢的呼吸动效，暗示生命体征。
3. **适老化分层 (Adaptive Hierarchy)**：标准模式展现趋势与深度分析；长辈模式通过高对比度状态块（大红、大绿、大黄）直接告知“该吃药了”或“今天血压很好”。

## 页面布局逻辑 (Layout Logic)
- **Top Bar**: 包含明显的长辈模式 Toggle（带生动图标），云端同步按钮（带有数据环绕流动的小动效）。
- **Main Content**:
  - 英雄区 (Hero Section)：AI 综合健康评分，以巨大的发光光环（Aurora Glow）展示。
  - 数据矩阵 (Data Grid)：4个核心指标块（心率、睡眠、血氧、运动），2x2 网格排列。
  - 洞察与计划 (Insights & Plans)：基于数据的卡片流，使用温柔的提示卡（如“今晚建议10点入睡”）。

## 交互与动效预期 (Interaction & Motion Expectations)
- **长辈模式切换**：不仅是缩放，要有一次平滑的布局重排过渡（FLIP 动画），折线图渐隐，替换为巨大的 Emoji/Icon。
- **数据同步**：点击“同步”时，顶栏会出现类似微小星轨被吸入云端图标的动画，完成后卡片内容有一次向上的轻微弹跳（Staggered Fade Up）。
- **实时数据**：心率数据旁的红心会有频率与数值一致的缩放脉动。