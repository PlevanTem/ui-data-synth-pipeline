# Style Research — ClarityMesh

## 设计问题定义
这个产品需要让高压协作团队在“信息噪声很高”的状态下快速完成跨模块决策。设计核心挑战是：在高信息密度（whiteboard + chat + map + reports）下保持低焦虑和高掌控。视觉必须建立 premium 级信任感，交互需支撑 immersive 深度操作，同时通过新拟态软UI保持一致而不牺牲可读性。

## 设计语言翻译（来自 PM 输入）
- `emotional_goal` → 冷静、可控、可靠：采用低饱和冷灰蓝基底 + 柔和高光/内阴影。
- `information_density=high` → 采用分层容器、明确扫描路径、卡片优先级系统。
- `interaction_depth=immersive` → 导航切换、筛选联动、表单反馈、模态/抽屉、跨模块状态同步必须完整。
- `visual_trust_level=premium` + `trust_signals_needed=true` → 安全状态可视化（加密、已读、执行日志）作为一等视觉语义。

## 趋势扫描（真实检索证据）
### 主流方向
1. SaaS dashboard 模块化 + Bento grid 结构强化（Awwwards）  
   - 参考: https://www.awwwards.com/inspiration/saas-features-bento-grid-layout-cloud-7
2. 仪表盘倾向组件化系统与 light/dark 双主题一致性（Awwwards Market）  
   - 参考: https://www.awwwards.com/market/product_65a0e70509900852718385
3. 新拟态 dashboard 在 Dribbble 中持续活跃，但常见问题是低对比与“仅视觉无交互”  
   - 参考: https://dribbble.com/tags/neumorphism-dashboard

### 新兴信号
1. 以轻量 3D/scroll 动效增强 SaaS 叙事，但核心信息层保持克制。
2. 数据界面逐渐把“动画当反馈语言”而不是装饰：状态变化、载入、联动均有节奏化运动。

## Generative 与代码艺术调研（真实检索证据）
1. OpenProcessing 的 flow field 适合做“有秩序的动态背景”，可通过粒子密度映射风险等级。  
   - 参考: https://openprocessing.org/sketch/1861312/
2. Flowfield maze solver 展示了大量粒子也能维持结构化路径，适合映射协作流向。  
   - 参考: https://openprocessing.org/sketch/815894
3. Shader noise（Worley/Value noise）适合做微妙材质层，增强新拟态的空间质感。  
   - 参考: https://shadertoolbox.xyz/noise/worley/Worley.html
4. Shadertoy howto 与 iQuilez noise 说明可通过时间参数实现低干扰动态纹理。  
   - 参考: https://www.shadertoy.com/howto

## 方向发散（3 个方向）
### A. 保守高完成度：Calm Enterprise Soft
- 风格关键词：soft-depth, muted-blue, stable-grid, minimal-motion
- 视觉信号：企业可信、低噪音、强调可读性
- generative 策略：仅在 hero 和地图容器加入低速噪声纹理
- 交互语言：即时反馈、短时长动效（150-240ms）
- 风险：辨识度偏弱，容易和传统企业后台趋同
- 不选主推原因：难以突出“多模块协同”的动态特征

### B. 主推方向：Neuro-Flow Command（选定）
- 风格关键词：neumorphic-command, flowfield-atmosphere, secure-signal, data-relay
- 视觉信号：平静底色 + 动态信息流，强调“从混乱到聚焦”的过程感
- generative 策略：Canvas flow field 背景层 + SVG signal pulse + 图表动态反馈
- 交互语言：筛选驱动跨区联动；白板/聊天/地图彼此反馈
- 空间表达：前景（任务数据）/中景（卡片容器）/背景（流场）三层清晰
- 风险：若层级控制不当会影响文字可读性

### C. 实验识别度：Spatial Ops Theater
- 风格关键词：3d-parallax, cinematic-dashboard, shader-glow
- 视觉信号：强空间、强叙事、品牌冲击力高
- generative 策略：WebGL shader + 3D 地图场景 + 滚动叙事
- 交互语言：章节化转场、场景切换
- 风险：开发成本和性能风险高，不利于本案“高频操作效率”
- 不选主推原因：过度叙事会压制工具效率

## 最终选型与原因
选择 B（Neuro-Flow Command）：在保持企业 SaaS 可读性的前提下，通过流场与信号脉冲表达“信息流治理”，并可自然承接白板实时协作、地图热力、加密沟通三条主线。

## 动态交互策略
- 导航：侧栏切换不同工作视图，保持全局筛选状态。
- 筛选：时间/区域/风险级别改变时，聚焦队列、地图热力、报表概览同步更新。
- 表单：报表计划表单具备校验、loading、成功/失败反馈。
- 叠层：消息详情模态、移动端抽屉、全局 toast 完整闭环。
- motion：默认 150-280ms，关键状态切换 320ms；`prefers-reduced-motion` 降级。

## 去同质化策略
- 不使用“紫蓝渐变+玻璃卡满屏”常见模板。
- 保留新拟态但降低夸张阴影，改为功能性层级阴影。
- 将生成式视觉绑定业务参数（风险等级/协作活跃度），避免屏保化特效。

## 可沉淀资产建议
- 风格 recipe：新拟态 + flowfield 的企业控制台表达方式。
- 动效模式：跨模块筛选联动时的统一 pulse 反馈节奏。
- 反模式：仅视觉新拟态但缺乏交互语义（空壳软UI）。
