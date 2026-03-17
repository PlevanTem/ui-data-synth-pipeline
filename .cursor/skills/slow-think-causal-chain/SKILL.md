---
name: slow-think-causal-chain
description: 从 ui-data-synth-pipeline 的 case 产出合成多条聚焦决策的慢思考 SFT 训练样本。每个 case 生成 8-15 条独立样本，每条围绕一个具体实现决策展开短而深的推理，输出标准对话格式。适用于训练模型在特定技术/设计决策点上的深度推理能力。
---

# 聚焦决策慢思考 SFT 数据合成

将 `outputs/<case_id>/` 下的全阶段产物，拆解为 **8-15 条独立的 SFT 训练样本**，每条样本聚焦于一个具体的实现决策，用 `<think>` 独白展示该决策的完整推理链路。

## 核心理念

与 `slow-think-long-chain`（一条长独白覆盖所有决策）不同，本技能生成**多条短而深的推理样本**：

- **长链**：用户问「帮我做一个智能家居面板」→ 完整思考整个项目 → 输出全部代码
- **因果链**：用户问「帮我做一个智能家居面板」→ 聚焦思考某个决策（如状态管理方案）→ 输出相关代码

每条样本的 `<think>` 块更短（500-2000字），但对单个决策的推理更深、更具体。这种数据适合：
- 训练模型在编码前先追溯约束的习惯
- 过程奖励模型（PRM）的 step-level 标注
- 推理蒸馏中的知识点级数据

## 输入

与 `slow-think-long-chain` 相同的 case 目录结构。

## 输出格式

输出 `<case_id>_causal_chains.json`：

```json
{
  "case_id": "string",
  "domain": "string",
  "pipeline_version": "string",
  "samples": [
    {
      "id": "sample_01",
      "focus": "tech_stack_selection",
      "conversations": [
        {
          "role": "user",
          "content": "帮我设计并实现一个智能家居控制面板..."
        },
        {
          "role": "assistant",
          "content": "<think>\n让我想想技术栈怎么选...\n</think>\n\n基于以上分析，我选择 React + TypeScript + Vite。\n\n```tsx\n// src/App.tsx\n...\n```"
        }
      ]
    }
  ],
  "metadata": {
    "source_case": "outputs/v3-pipeline/<case_id>",
    "synth_method": "causal-chain-v2",
    "total_samples": 12,
    "stage_files_used": ["meta.json", "..."]
  }
}
```

## 执行步骤

### Step 1: 读取全部 case 文件

与 long-chain 相同，读取所有 pipeline 产出文件和源码。

### Step 2: 构造基础 user prompt

同 long-chain，从 `meta.json` 生成一个自然的用户请求（80-200 字）。
**所有样本共享同一个 user prompt**（模拟同一个需求下的不同推理焦点）。

### Step 3: 识别决策锚点

从代码和文档中识别 8-15 个可以独立成篇的决策点。每个锚点对应一条 sample。

#### 必选锚点类别（从以下类别中各至少选 1 个）

| 类别 | 示例 | 数据来源 |
|------|------|---------|
| **技术栈选择** | 为什么用 React 不用 Vue | tech_decision → selected_stack, why_not_others |
| **状态管理方案** | 为什么分多个 store / 为什么用 useReducer | tech_decision → state_management，代码中的 store 目录 |
| **视觉方向** | 为什么选暗色主题 / 配色逻辑 | design_brief, design_system, prd 风格需求 |
| **布局/导航** | 为什么手机用底部 Tab | ia_structure, design_brief, 代码中的 Layout 组件 |
| **功能边界（negative）** | 为什么不做 WebRTC / 为什么用 mock | requirement out_of_scope, 代码中的 mockData |

#### 可选锚点类别

| 类别 | 示例 |
|------|------|
| 库采纳/拒绝 | Framer Motion vs GSAP, Recharts vs D3 |
| 生成式视觉方案 | Canvas 2D vs WebGL vs 纯 CSS |
| 组件设计决策 | DeviceCard 多变体设计、场景触发的交互编排 |
| 性能策略 | Canvas 降分辨率、RAF cleanup、memo 策略 |
| 动效编排 | stagger 时序、spring 参数选择 |
| 响应式策略 | 断点设计、不同端的布局差异 |

### Step 4: 为每个锚点撰写 `<think>` 独白

每条独白的写作要求：

#### 结构模式

```
<think>
{引入}：从用户需求中找到与该决策相关的约束
{分析}：列出 2-3 个候选方案并比较
{犹豫}：表达某个权衡点上的不确定
{决定}：做出选择并给出核心理由
{细化}：思考具体实现细节
{兜底}：考虑降级/出错场景
</think>
```

但这不是严格的六步模板——内容应自然流动，允许跳步和交织。

#### 写作风格（与 long-chain 一致）

- 第一人称心理独白
- 情感化标记词（嗯、等等、让我想想）
- 明确的比较和否定
- 不用 markdown 标题
- 不泄露 JSON 字段名

#### 长度与深度

- 每条 `<think>` 块 500-2000 中文字符
- 至少包含 1 个明确的否定推理（放弃了什么）
- 至少包含 1 次犹豫/比较（A 还是 B？）
- negative 极性样本（功能边界类）至少 2 条

### Step 5: 为每条样本匹配代码输出

`</think>` 后的代码部分只包含**与该决策直接相关的文件**（不是全部源码）。

例如：
- 技术栈选择 → `App.tsx` + `main.tsx`
- 状态管理 → `store/` 下所有文件 + `types/index.ts`
- 视觉方向 → `globals.css` + 生成式背景组件
- 导航/布局 → `Layout.tsx` + `Navigation.tsx`
- 功能边界 → `mockData.ts` + 相关 view 文件

代码格式同 long-chain（独立代码块 + 路径注释）。

### Step 6: 组装并写入 JSON

## 质量检查清单

- [ ] 8-15 条 samples
- [ ] 每条 `<think>` 是连贯自然独白，无 markdown 标题
- [ ] 每条有 ≥1 个否定推理
- [ ] 每条有 ≥1 次比较/犹豫
- [ ] ≥2 条 negative 极性样本
- [ ] 覆盖 ≥5 种锚点类别
- [ ] `</think>` 后代码只包含决策相关文件
- [ ] user prompt 对所有样本一致
- [ ] 全文无 JSON 字段名泄露

## `<think>` 独白示例

### 示例 1: 技术栈选择（~800字）

```
让我想想技术栈怎么选。这个智能家居控制面板的核心挑战是状态管理——16 台设备，6 种类型，每种有不同的控制参数（灯的亮度、空调的温度、窗帘的开合度），还有 4 种场景联动需要批量操作设备。

React 还是 Vue？先说 Vue 的优势——双向绑定对设备参数调节特别自然，v-model 绑一个 slider 几乎零成本。但问题是，我脑中已经有了场景触发的动画设计：设备逐个激活、每台间隔 120ms 的 stagger 效果，加上页面切换的 AnimatePresence 退场动画——这些用 Framer Motion 做最顺手，而 Framer Motion 是 React 生态独有的。Vue 的动画库，transition-group 够基础，但编排复杂时序动画？差太远了。

那 Svelte 呢？性能确实好，内置动画也不错。但 Recharts（能耗图表要用）不支持 Svelte，我得找替代品...D3 太底层了，ECharts 太重。算了，引入一个不确定的图表方案不值得冒这个险。

Next.js？这是个纯客户端原型，SSR 完全用不上。引入 Next.js 等于背一堆 server 相关的概念负担，对开发效率反而是拖累。

嗯，就 React + TypeScript + Vite。TypeScript 特别重要——6 种设备类型的控制参数各不相同，没有类型系统的话 DeviceCard 组件的 props 会变成灾难。Vite 提供快速 HMR，原型阶段开发体验好。
```

### 示例 2: 功能边界 / negative（~600字）

```
用户说要"语音控制设备"，但让我想清楚这个"语音控制"到底要做到什么程度。

这是一个前端原型，不是真正的 IoT 产品。如果我去接真实的语音识别 API——先不说成本，光是麦克风权限、WebRTC 音频流、语音转文字的延迟处理...这些工作量至少占整个项目的 40%，而且全部是后端/基础设施层面的事情。用户要的是"展示交互体验"，不是"能真的听懂说话"。

所以语音部分全部用 mock。具体来说：点击语音按钮后，随机从预设的指令库里抽一条（"打开客厅灯"、"睡觉模式"之类的），然后模拟逐字显示的打字效果，800ms 后进入"理解中"状态，再过 400ms 给出结果。这样用户能完整体验 listening → processing → success/error 四个状态的视觉变化。

同样的逻辑，设备状态也全部是前端 mock。不存在真实的 MQTT broker、不存在 IoT 网关。一个 mockData.ts 文件放 16 台设备的初始状态，所有的"控制"操作都是直接修改前端 state。

这个决定让我可以把精力全部集中在交互体验上——场景触发的 stagger 动画、设备卡片的发光状态变化、语音波形的四态 Canvas 动画。这些才是原型要验证的东西。
```

### 示例 3: 状态管理方案（~1000字）

```
状态管理是这个应用最需要想清楚的部分。让我梳理一下有哪些状态需要管理。

首先是设备状态——16 台设备，每台有 isOn、isOnline、params（类型各不同的控制参数）。这是最复杂的一块。然后是场景——4 个预设场景，每个关联多台设备的目标状态，还有 isActive 和 executingSceneId。最后是 UI 状态——当前激活的导航标签、Toast 通知队列。

嗯，先想想用什么方案。Redux？对于这个规模的应用太重了。我不需要时间旅行调试、不需要中间件、不需要 devtools。引入 Redux 的样板代码量（action creators、reducers、selectors、store 配置）至少要多写 200 行完全不产生价值的代码。

那全部用 Zustand？Zustand 确实轻量好用。但等等，场景触发的逻辑很复杂——用户点击"回家模式"，需要：1. 标记 executingSceneId；2. 遍历场景关联的 4 台设备，每台间隔 120ms 先标记 executing 状态，再过 300ms 更新实际参数；3. 全部完成后标记场景为 active。这是一个多步骤的状态机转换。

用 Zustand 的 set 来写这个...也不是不行，但代码会变成一堆嵌套的 setTimeout 里调 set，可读性很差。useReducer 的 dispatch action 模式更适合这种场景——每个步骤是一个明确的 action type：TRIGGER_SCENE_START → SCENE_DEVICE_START → UPDATE_DEVICE_FROM_SCENE → SCENE_DEVICE_DONE → TRIGGER_SCENE_COMPLETE。状态流转一目了然。

好，那就分两层。设备核心状态用 React Context + useReducer——DeviceProvider 包在最外层，内部用 reducer 管理设备和场景的所有状态变更。UI 状态用 Zustand——一个小小的 useUIStore，管理 activeTab 和 toasts，简单直接，不需要 Provider。

为什么不反过来，设备用 Zustand、UI 用 Context？因为设备状态的消费者很多（每个 DeviceCard、SceneCard、HomePage、DevicesPage 都要读），Context + useReducer 在这种"多消费者、复杂更新逻辑"的场景下反而比 Zustand 更清晰——useReducer 的 action 派发让每次状态变更都有据可查。而 UI 状态只有导航和 Toast 两个简单值，Zustand 的 set 足矣。
```
