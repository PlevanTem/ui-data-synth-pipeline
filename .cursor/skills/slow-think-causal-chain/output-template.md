# 聚焦决策 SFT 样本输出模板

实际输出为 JSON（见 SKILL.md schema），此模板用于人工审核和示意。一个 case 输出 8-15 条 samples。

---

## Sample 1: 技术栈选择

### User

帮我设计并实现一个鸿蒙智联全屋智能中控应用。我家里有十几台鸿蒙 IoT 设备，但每次要控制都得打开不同 App，太麻烦了。想要一个统一的控制面板，支持一键场景联动、语音控制、设备实时监控和能耗统计。界面风格要极简直观、色彩柔和，卡片式布局，适配手机、平板和大屏三端。

### Assistant

```
<think>
让我想想技术栈怎么选。这个智能家居控制面板的核心挑战是状态管理——16 台设备，6 种类型，每种有不同的控制参数，还有 4 种场景联动需要批量操作设备。

React 还是 Vue？Vue 的双向绑定对设备参数调节特别自然，v-model 绑一个 slider 几乎零成本。但问题是，场景触发需要 stagger 动画——设备逐个激活、每台间隔 120ms，加上页面切换的退场动画——这些用 Framer Motion 做最顺手，而它是 React 生态独有的。Vue 的 transition-group 够基础，但编排复杂时序动画差太远了。

那 Svelte？性能好，内置动画也不错。但 Recharts 不支持 Svelte，能耗图表得找替代品...D3 太底层了。算了，不值得冒这个险。

Next.js？纯客户端原型，SSR 完全用不上。背一堆 server 概念负担，对开发效率反而是拖累。

嗯，就 React + TypeScript + Vite。TypeScript 特别重要——6 种设备类型的控制参数各不相同，没有类型系统 DeviceCard 的 props 会变成灾难。
</think>

基于以上分析，我选择 React 18 + TypeScript + Vite 作为技术栈。

```tsx
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

```tsx
// src/App.tsx
import { AnimatePresence, motion } from 'framer-motion'
import AppLayout from '@/components/layout/AppLayout'
import AmbientBackground from '@/generative/AmbientBackground'
// ... 完整 App 组件 ...
```
```

---

## Sample 2: 状态管理方案

### User

（同上，所有 sample 共享一个 user prompt）

### Assistant

```
<think>
状态管理是这个应用最需要想清楚的部分。让我梳理一下——设备状态（16 台设备各有类型、开关、参数），场景状态（4 个场景的激活和执行中状态），UI 状态（导航标签、Toast 通知）。

先想到 Redux...不，太重了。这个规模的应用根本不需要时间旅行调试和中间件，200 行样板代码完全不产生价值。

全部用 Zustand？轻量好用。但等等，场景触发的逻辑很复杂——TRIGGER_SCENE_START → 逐设备 SCENE_DEVICE_START → UPDATE → DONE → TRIGGER_SCENE_COMPLETE，这是一个多步状态机。用 Zustand 的 set 写会变成一堆嵌套 setTimeout 里调 set，可读性很差。useReducer 的 dispatch action 模式更适合。

那就分两层。设备核心状态用 Context + useReducer——复杂的 reducer 逻辑让每次状态变更都有据可查。UI 状态用 Zustand——activeTab 和 toasts 两个简单值，set 足矣。

为什么不反过来？因为设备状态的消费者特别多（每个 DeviceCard、SceneCard、多个页面都要读），Context 在这种场景下反而比 Zustand 更清晰。
</think>

我采用双层状态管理方案：设备状态用 Context + useReducer，UI 状态用 Zustand。

```tsx
// src/store/DeviceStore.tsx
import React, { createContext, useContext, useReducer, useCallback } from 'react'
import type { Device, Scene, SceneId } from '@/types'

type DeviceAction =
  | { type: 'TOGGLE_DEVICE'; deviceId: string }
  | { type: 'TRIGGER_SCENE_START'; sceneId: SceneId }
  | { type: 'SCENE_DEVICE_START'; deviceId: string }
  // ... 完整 reducer 和 Provider ...
```

```ts
// src/store/UIStore.ts
import { create } from 'zustand'

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'home',
  toasts: [],
  setActiveTab: (tab) => set({ activeTab: tab }),
  // ...
}))
```
```

---

## Sample 3: 功能边界（negative 极性）

### Assistant

```
<think>
用户说要"语音控制设备"，但让我想清楚到底要做到什么程度。

这是一个前端原型，不是真正的 IoT 产品。如果去接真实语音识别 API——先不说成本，光是麦克风权限、WebRTC 音频流、语音转文字的延迟处理...这些工作量至少占项目的 40%，全部是后端层面的事。用户要的是"展示交互体验"，不是"能真的听懂说话"。

所以语音部分全部 mock。点击按钮后随机抽预设指令，逐字显示打字效果，模拟 listening → processing → success/error 四个状态。这样用户能完整体验视觉变化。

同理，设备状态也全部前端 mock。没有 MQTT broker，没有 IoT 网关。一个 mockData.ts 文件存 16 台设备初始状态，所有"控制"操作直接改前端 state。

这个决定让我把精力全集中在交互体验上——场景触发的 stagger 动画、设备卡片的发光状态、语音波形的 Canvas 动画。这些才是原型要验证的东西。
</think>

语音控制和设备通信全部使用 mock 数据，专注于交互体验的完整性。

```ts
// src/store/mockData.ts
export const DEVICES: Device[] = [
  {
    id: 'light-living-main',
    name: '客厅主灯',
    type: 'lighting',
    roomId: 'living',
    isOn: true,
    isOnline: true,
    // ...
  },
  // ... 16 台设备
]
```

```tsx
// src/components/voice/VoiceButton.tsx
const MOCK_COMMANDS = [
  { pattern: /客厅灯|打开.*灯/, intent: '打开客厅灯', action: '客厅主灯已开启' },
  { pattern: /回家|回来了/, intent: '切换回家模式', action: '正在执行「回家」场景' },
  // ...
]
// ... 完整 mock 语音识别流程 ...
```
```

---

## Sample 4: 视觉方向选择

### Assistant

```
<think>
用户说要"极简、色彩柔和、融合鸿蒙"。几个方向在我脑中浮现——

白底明亮极简？第一反应是这个，开发也最快。但说实话太普通了，跟市面上小米智能家居的界面没什么差别。用户特意说了"融合鸿蒙生态视觉语言"，应该是想要一些差异化。

纯紫蓝渐变玻璃态？现在很流行，看着挺高级。但仔细想想这种风格更适合 AI 工具类产品，往智能家居场景上套总觉得哪里不对——太冷、太数字化了，缺少「家」的感觉。

嗯，有个有意思的方向——暗色环境控制风格。智能家居使用高峰是晚上回家的时段，暗色主题天然合适。更妙的是，设备"亮了"的时候卡片也可以发光——灯开了就「亮」，关了就「暗」，这种控制与视觉的认知映射会让操作变得很直觉。

配色这样想：主背景 #0D0F14（近黑带蓝灰调，避免纯黑的廉价感），卡片用 #161921（深炭蓝），操作色冷蓝 #4E9EFF，设备激活用暖橘 #FF8C42。冷暖对比强调状态变化。不同类型设备有自己的发光色——灯暖黄、空调冷蓝、安防绿、娱乐紫。这不是随意配色，是从「设备类型→真实设备颜色→卡片发光色」推导来的。
</think>

视觉方向定为暗色环境控制风格，设备状态通过发光效果传达。

```css
/* src/styles/globals.css */
:root {
  --bg-primary: #0D0F14;
  --bg-card: #161921;
  --accent-blue: #4E9EFF;
  --accent-warm: #FF8C42;
  --glow-lighting: #FFD700;
  --glow-climate: #60A5FA;
  --glow-security: #34D399;
  --glow-entertainment: #A78BFA;
}
```

```tsx
// src/generative/AmbientBackground.tsx
// Canvas 2D + simplex noise 流动背景
// ... 完整组件 ...
```
```

---

## 反面示例

### ❌ Q&A 问答式

```json
{
  "anchor_question": "为什么使用 React 而非 Vue？",
  "chain_type": "selection",
  "nodes": [
    { "stage": "user_need", "content": "...", "source": "meta.json → input_summary" }
  ]
}
```

问题：结构化 Q&A，无法直接训练 LLM。

### ❌ 每条 sample 的 user prompt 不同

```json
{
  "samples": [
    { "conversations": [{ "role": "user", "content": "为什么用 React？" }] },
    { "conversations": [{ "role": "user", "content": "为什么用暗色主题？" }] }
  ]
}
```

问题：user prompt 应该始终是原始完整需求，不应拆成具体技术问题。模型应当学习「从完整需求自动聚焦到具体决策」。
