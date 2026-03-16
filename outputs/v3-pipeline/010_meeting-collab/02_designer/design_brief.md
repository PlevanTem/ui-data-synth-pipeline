# Design Brief: HarmonyMeet AI 会议协作应用

> 给 Frontend Agent 的执行摘要。本文件是设计决策的最终定稿，不需要重新猜需求。

---

## 1. 核心视觉方向

**极简暗夜工作流（Dark Workflow Minimal）**

- 主色调：深石板暗色（`#0a0f1e` base，`#111827` surface）
- 强调色：单一冰蓝（`#38bdf8`），仅用于主要 CTA、AI 状态、激活态
- 字体：Inter（英文）+ HarmonyOS Sans fallback（中文）
- 图标：Phosphor Icons（线性风格）
- 整体气质：**有序、精准、技术感、信赖感**——像一款精良的专业工具，不是消费品

双主题：暗色（默认）+ 亮色（可切换），设计优先暗色。

---

## 2. 布局策略

### 应用骨架
```
[ TopBar - 全宽固定 56px ]
[ SideNav 240px | MainContent flex-1 ]
```

### 三种响应式形态
- **桌面 ≥1280px**：SideNav 展开 240px + 双栏主内容区（会议视图：60% 转写 + 40% 摘要）
- **平板 768-1279px**：SideNav 折叠 64px + 单栏主内容
- **手机 <768px**：无 SideNav，底部 BottomTabBar（64px）替代

### 各视图布局
- **Dashboard**：2 列卡片（桌面），1 列（手机）；左侧今日日程时间线，右侧即将到来的会议
- **MeetingView**：桌面双栏（转写 | 摘要）；底部声波条 + 控制栏
- **MinutesView**：单列文档布局，最大宽度 800px 居中；右侧操作栏
- **TasksView**：筛选栏在顶，左侧任务列表，右侧详情抽屉

---

## 3. 交互重点

1. **会议全流程可端到端演示**：Dashboard 入会 → 转写面板激活 → 结束 → 纪要生成 → 任务同步
2. **流式文字动效**：转写面板必须有逐字出现效果（35ms/字 delay）
3. **声波 Canvas**：会议进行中必须渲染（绑定 speakingParticipant mock 状态）
4. **粒子聚合过渡**：结束会议 → 纪要生成的 1500ms 过渡动效
5. **筛选联动**：TasksView 的筛选器必须实时过滤列表
6. **任务状态切换**：TaskStatusChip 循环切换有动效反馈

---

## 4. 页面内部交互完整清单

### 视图导航
- SideNav 点击 → currentView 状态变更 → MainContent 切换，带 cross-fade 250ms
- TopBar 设备 Tab → deviceMode 变更 → 布局响应（演示用，视觉响应即可）

### 组件联动
| 操作 | 来源组件 | 目标组件 | 状态变更 |
|------|----------|----------|----------|
| 点击「加入会议」 | UpcomingMeetingCard | MeetingView | meetingStatus: idle→in-progress |
| 结束会议确认 | MeetingControlBar | ParticleCanvas + MinutesView | meetingStatus→generating→done |
| 纪要行动项「同步」 | ActionItemsSection | TaskList + Toast | taskList 追加 |
| 筛选器点击 | TaskFilterBar | TaskList | filterState 更新 → 列表过滤 |
| 任务卡片点击 | TaskCard | TaskDetailDrawer | selectedTaskId + drawerOpen |
| 语言切换 | LanguageSwitcher | 纪要内容区 | currentLanguage 切换 |
| 主题切换 | TopBar ThemeToggle | 全局 | theme: dark↔light |
| 投屏按钮 | MeetingControlBar | ProjectionModal | projectionOpen: true |

### 表单与输入
- QuickJoinBar：输入框 6 位数字验证，错误时边框变红 + 错误文字
- 提交有 loading 态（按钮 spinner + disabled）

### 空状态
- TasksView 无任务：插图 + 引导文字 + 「去查看最新会议」按钮
- HistoryView 无历史：插图 + 「开始你的第一次会议」
- 搜索无结果：「没有找到相关会议」

---

## 5. Generative 视觉层实现指南

### WaveformCanvas（会议视图必须实现）
```typescript
// 参数范围
barCount: 36              // 条形数量
barWidth: 3px             // 每条宽度
barGap: 2px               // 间距
maxHeight: 48px           // 最大高度
minHeight: 4px            // 最小高度
color: '#38bdf8'          // 冰蓝
opacity: 0.7
updateHz: 60              // fps

// 算法：simplex noise
// 输入：noise(barIndex * 0.3, time * 0.015)
// 当 speakingParticipant === null：振幅 × 0.15（静默状态）
// 当 speakingParticipant 存在：振幅 × 1.0（活跃发言）
```

### ParticleConvergeCanvas（结束会议过渡必须实现）
```typescript
// 粒子从画布四角随机位置向画布中心汇聚
particleCount: 100
startOpacity: 0.8
duration: 1500ms
convergencePoint: { x: width/2, y: height/2 }
particleColor: '#38bdf8'
particleSize: 2-4px random
// 到达中心后消散，中心出现 "正在生成纪要..." 文字
```

### StreamingText（转写面板必须实现）
```typescript
// 模拟实时转写：每 50ms 追加一个字符到 transcriptBuffer
// 每个新字符：opacity 0→1，translateY 4px→0，duration 150ms
// 底部自动滚动（scrollTop = scrollHeight）
// 用户主动滚动时停止自动滚动，显示「回到底部」按钮
```

---

## 6. 组件气质

- **卡片**：`background: #111827`，`border: 1px solid #1e293b`，`border-radius: 10px`，hover 时 border 变为 `#2d3f52` + box-shadow
- **按钮**：主按钮冰蓝底 + 深字；次按钮透明底 + 细边框；危险按钮红色
- **输入框**：暗底 + 低对比度占位符，focus 时边框变冰蓝
- **状态芯片**：小圆角 pill，颜色区分状态（待办灰 / 进行中蓝 / 完成绿）
- **发言人标注**：彩色点 + 姓名缩写，每个参会者分配固定色彩（从色彩池循环）

---

## 7. 禁止事项

- ❌ 紫色/紫蓝渐变背景或 hero 区
- ❌ 半透明玻璃卡片（glassmorphism）全屏铺开
- ❌ 无意义的 neon glow 或过度发光效果
- ❌ 只有静态页面，无流式文字动效
- ❌ 会议进行中无 Canvas 声波
- ❌ 结束会议时没有过渡动效直接跳转
- ❌ 筛选器点击后列表不变化
- ❌ 使用单一 index.html 或纯静态 HTML 交付
- ❌ 任何模拟"加载完成"但实际无交互的占位按钮

---

## 8. 技术实现优先级

1. **P0 必须实现**：四视图完整导航、流式文字动效、会议流程端到端
2. **P0 必须实现**：声波 Canvas、任务筛选联动、状态切换
3. **P1 尽力实现**：粒子聚合动效、任务详情抽屉、语言切换
4. **P2 余力实现**：投屏预览模态、历史会议搜索、批注演示
