# AgriFlow Command Style Research

## 设计问题定义
这个产品需要让区域调度经理在“高压但可控”的情绪下快速完成资源判断与流程编排。核心挑战不是把模块堆齐，而是让图表、地图、工作流与转化 CTA 形成连续状态流。视觉需要建立 premium 级可信感，交互需要支持 immersive 深度但保持读数效率。

## 趋势洞察（真实检索证据）
- [Land-book Arva](https://land-book.com/websites/77403-arva-regenerative-agriculture-solutions)：农业场景常见“叙事落地页 + 数据证明”组合，强调成果信号先行。
- [Land-book Agrovision](https://www.land-book.com/websites/69983-agrovision)：品牌叙事与能力模块并列，说明 CTA 前置并不冲突专业感。
- [Awwwards 数据交互案例](http://www.awwwards.com/inspiration/intersection-of-conflict-fish-migration-climate-change-data-wwf-oceans-futures)：地图与数据联动可作为主叙事骨架，而非附属组件。
- [Shader flow field 参考](https://shaderjoy.work/sketch/flow_field)：低对比流场可做“持续运行系统”隐喻，适合做高科技背景氛围层。
- [OpenProcessing GPU Particles](https://openprocessing.org/sketch/1966464/)：可控粒子密度适合表达资源压力与流向。
- [USDA/Drought 互动地图](https://www.drought.gov/sectors/agriculture/interactive-map)：农业地图表达需要图例、层级与筛选同步，不能只做视觉热力。

## Generative 视觉与代码艺术调研发现
- 优先算法族：`flow-field`（系统流动感）、`particle-system`（资源活跃度）、`heat pulse diffusion`（热点传播）、`svg morph`（图表状态切换）。
- 推荐组合：Canvas 流场背景（低频）+ SVG 图表微形变（中频）+ 地图热点脉冲（事件触发）。
- 交互钩子：区域筛选、时间范围切换、地图点选、工作流发布、滚动进入关键章节。
- 约束：生成式层不能压过数据可读性；主文本区维持高对比与稳定背景。

## 三方向发散
### A. Command Minimal Grid（保守高完成度）
- 关键词：`structured` `precise` `modular` `cool-gray`
- 视觉信号：企业仪表盘稳定感强
- 风险：识别度偏弱，品牌记忆点不足
- 不选原因：不足以承载“高科技且生动”的目标

### B. GeoPulse Tech Field（主推）
- 关键词：`geospatial` `pulse` `flow` `deep-blue` `signal`
- 视觉信号：地图、图表、流程编排统一在“信号场”语义
- generative 策略：流场 + 热力脉冲 + SVG 数据过渡
- 风险：动效过多会损耗可读性，需要节奏治理
- 选择原因：同时满足 M01/M02/M03/M05 的表现力与可实现性

### C. Bio-Digital Terrain Lab（实验识别度）
- 关键词：`terrain` `3d` `scanline` `simulation`
- 视觉信号：三维地形与空间叙事冲击力强
- 风险：工程复杂度和性能风险高，移动端适配压力大
- 不选原因：当前 case 更需要高完成度交付而非重 3D 实验

## 最终选型与理由
选择 **GeoPulse Tech Field**。该方向在蓝黑冷色约束下仍能建立清晰层级，且可把“资源调度不均”具象成“流速差、热度差、节点阻塞”三种可交互反馈，天然服务产品叙事。

## 动态交互策略
- 图表层：筛选触发线条重绘与指标动画，保持 180-300ms 微过渡。
- 地图层：热点脉冲按风险等级变化，选中对象后轨迹与侧栏同步。
- 工作流层：拖拽状态高亮、发布后 toast 与状态徽记联动。
- 转化层：CTA 入口在导航、hero、底部三处一致，但视觉权重递增。

## 去同质化与反套路
- 禁用“紫蓝霓虹 + 满屏毛玻璃 + 三卡片”默认科技模板。
- 生成式视觉只做信息增强，不做独立屏保。
- 每个动态效果必须绑定业务事件（筛选/选中/发布/提交）。

## 资产沉淀建议
- 本案可沉淀为 `generative-recipes`：`agritech-geopulse-flowfield`（高信息密度地图产品）。
- 新增结构化标签建议：
  - `style_keywords`: geo-command, pulse-field, dark-precision
  - `visual_primitives`: field, glow, grid, depth, map
  - `motion_primitives`: pulse, morph, scroll-sync, drift
