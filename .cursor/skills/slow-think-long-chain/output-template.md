# 长链推理 SFT 样本输出模板

实际输出为 JSON（见 SKILL.md schema），此模板用于人工审核和示意。

---

## 完整样本示意

### User

帮我设计并实现一个鸿蒙智联全屋智能中控应用。我家里有十几台鸿蒙 IoT 设备，但每次要控制都得打开不同 App，太麻烦了。想要一个统一的控制面板，支持一键场景联动（回家/离家/睡眠/观影）、语音控制、设备实时监控和能耗统计。界面风格要极简直观、色彩柔和，卡片式布局，适配手机、平板和大屏三端。

### Assistant

```
<think>
让我仔细分析一下这个需求。用户有十几台鸿蒙 IoT 设备，核心痛点是每台设备要打开独立 App 来控制，操控路径太深。他想要的不是「能控制设备」，而是「生活被智能顺畅地服务到，几乎不需要操心设备」。

首先搞清楚要管理什么——设备、房间、场景、能耗，四个核心实体。设备和房间是多对一关系，设备和场景是多对多。嗯，这意味着状态管理不会太简单...

哪些功能必须做？全屋仪表盘（进入 App 后 3 秒内形成状态感知）、设备卡片控制（80% 日常控制不离开主页）、场景一键触发（核心差异化）、语音控制。能耗统计也很重要但可以稍放后面。至于设备固件升级、帐号系统之类的...不做，这是 Web 原型，加这些只会分散注意力。

导航怎么设计？手机屏幕小，底部 Tab 是最高效的触达方式；平板有宽度，可以用侧边栏；大屏更是要三列全景布局。嗯，混合导航方案，虽然实现成本高一点但用户体验差异显著。

想清楚了需求，来考虑视觉方向。用户说要"极简、色彩柔和、融合鸿蒙"。几个方向——白底明亮极简？太普通，跟市面上的米家没区别。纯紫蓝渐变玻璃态？太 SaaS 工具感，不像家居。直接照搬 HarmonyOS 风格？视觉保守，无差异化。

啊，有个想法——暗色环境控制风格。智能家居晚上用得最多，暗色主题天然合适。而且设备"亮了"的时候卡片也发光——灯开了卡片就「亮」，这种认知映射很有意思。主背景用近黑带蓝灰调（避免纯黑的廉价感），卡片深炭蓝色，系统操作色冷蓝，设备激活用暖橘色——冷暖对比强调「状态变化」。

等等，背景效果用什么方案？WebGL 能做出很炫的效果，但太重了——一个家居控制 App 用 Three.js？完全 overkill。纯 CSS 渐变又太死板。让我想想...Canvas 2D 配合 simplex noise！可以做缓慢流动的环境光效果，性能可控，降级方案简单——不支持就纯色背景。

技术栈方面...React 还是 Vue？Vue 的双向绑定对设备参数调节很自然，但我想用 Framer Motion 做场景触发的 stagger 动画和页面切换——这在 Vue 生态没有对等库。Svelte 的 Recharts 不支持，Next.js 的 SSR 对纯客户端原型多余。好，React + TypeScript + Vite。

状态管理呢？先想到 Redux...不，太重了。Zustand？轻量好用，但场景触发需要一个状态机（START→逐设备EXECUTING→UPDATE→DONE→COMPLETE），useReducer 的 action 派发更自然。那就分两层：设备状态用 Context + useReducer，UI 状态用 Zustand。

嗯，差点忘了语音控制。用户说要语音控制，但这是 Web 原型——不接真实语音 API。全部 mock：点击后随机抽一条预设指令，逐字显示，模拟 listening → processing → success/error 四态。重点是 Canvas 波形的四态动画做好看。

文件结构大致想好了：pages/ 放各页面，components/ 按功能分（device/scene/energy/voice/ui/layout），store/ 放 DeviceStore 和 UIStore，generative/ 放 Canvas 背景和波形，hooks/ 放自定义 hook。types/ 集中管理类型定义。

关键难点预判：DeviceCard 的多变体（6 种设备类型各有不同的控制 UI）需要好好抽象；场景触发的 stagger 动画时序编排要精心；Canvas 背景的性能——用 1/3 分辨率计算再 CSS 放大来节省 GPU。

好，开始写代码。
</think>

好的，我来为你实现这个鸿蒙智联全屋智能中控应用。以下是完整的前端代码：

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
// ... 完整组件代码 ...
```

// ... 其余所有源码文件 ...
```

---

## 反面示例（不应该这样写）

### ❌ 结构化报告风格

```
<think>
## 阶段一：需求分析

**核心问题**：用户需要统一控制面板。

**目标用户**：
- 主控用户（25-50岁）
- 家庭成员

**MoSCoW 分级**：
- Must Have: M01 全屋仪表盘, M02 设备卡片...
- Should Have: S01 场景编辑器...
</think>
```

问题：这是结构化报告，不是心理独白。有 markdown 标题、有编号、有固定模板感。

### ❌ JSON 字段名泄露

```
<think>
从 requirement_spec.json 的 execution_contracts.must_deliver 中可以看到...
design_system.json 的 color_palette.rationale 写的是...
</think>
```

问题：出现了文件名和 JSON 路径，不是自然思考。

### ❌ 没有犹豫和比较

```
<think>
技术栈选 React + TypeScript + Vite。状态管理用 Context + useReducer。配色用暗色系。导航用混合模式。
</think>
```

问题：直接给结论，没有比较过程、没有否定推理、没有犹豫。
