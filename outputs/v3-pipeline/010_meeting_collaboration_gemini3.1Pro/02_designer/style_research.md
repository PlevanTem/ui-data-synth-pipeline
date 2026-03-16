# Style Research & Exploration: Harmony AI Meeting App

## 1. 本案设计问题定义
- **核心挑战**：在极高信息密度（多端视频流、实时语音转写、多语翻译、实时批注协作）的环境下，维持“清爽无冗余”的体验；体现跨端流转的鸿蒙原生感（空间连续性、设备感知）。
- **目标情绪**：Calm (镇静)、Focus (专注)、Intelligent (智能内敛)。
- **交互强度**：高（需要模块自由排布、侧边栏收起、白板画笔协作）。

## 2. 趋势扫描与发现 (2026 办公协作趋势)
基于 WebSearch 对 2026 会议协作趋势的调研：
- **Agentic UI**：控制面板从静态固定的菜单，演变为“基于意图”的上下文触发。不需要点击一堆设置，而是用自然语言或智能预判来唤出功能。
- **Calm UI**：解决数字疲劳。采用低饱和色、柔和高斯模糊、单色模式（Monochromatic high-focus mode）。
- **Spatial / Hybrid Workspace**：不同设备的显示具有“空间延续性”，从手机到大屏的转移在视觉上有明确的方向感和空间感。

## 3. Generative 视觉与代码艺术调研
基于 OpenProcessing 和 WebGL 2026 艺术趋势调研：
- **Fluid & Reaction-Diffusion**：非常适合用来表现“AI 正在聆听或思考”。当用户说话时，底部控制栏或转写面板通过轻微的 WebGL 反应扩散算法（Reaction-Diffusion）产生涟漪，而不是传统的僵硬声波柱。
- **Particle Flow Field**：在空状态或多设备连接状态时，使用 Subtle Particle Flow Field 表现“设备之间的通信与数据流转”，提升“碰一碰投屏”的科技感知。

## 4. 三个探索方向
### 方向A：传统商务 (Conservative)
- 特征：深蓝主题，大面积纯色色块，卡片式固定布局。
- 不选原因：过于像传统的 Zoom/Teams，缺乏 2026 Agentic AI 和多设备空间感。
### 方向B：沉浸式拟物空间 (Experimental)
- 特征：全 3D 虚拟会议室，Apple Vision Pro 风格的极重玻璃拟态，高饱和环境光。
- 不选原因：过于喧宾夺主，增加认知负荷，不符合“清爽、极简办公”的诉求。
### 方向C：流体空间与 Calm UI (Selected)
- 特征：低对比度冷灰色调，极细的边框，背景使用轻微的 WebGL 噪声渐变与流场粒子表示 AI 状态。UI 模块化悬浮，根据不同设备尺寸进行丝滑的空间平移。
- 选型原因：完美契合“极简商务、低饱和”要求，通过 Generative UI (流场与反应扩散) 把 AI 的存在感做成环境底噪，而不是突兀的弹窗。

## 5. 避免同质化策略
- **规避**：大面积的紫蓝色霓虹渐变（过去几年的 AI 陈词滥调）。
- **规避**：满屏的高斯模糊毛玻璃卡片。
- **采用**：冰川灰（Glacier Grey）结合克制的琥珀色（Amber）高亮，采用“微光晕”（Soft Glow）而非大面积玻璃。

## 6. Generative 组合策略
- **AI 聆听态 (Reaction Diffusion WebGL)**：当有语音输入时，在转写区域底部触发细微的流体扩散效果。
- **设备流转 (Particle Canvas)**：拖拽模块或投屏时，触发粒子从设备 A 飞向设备 B 的视觉反馈。