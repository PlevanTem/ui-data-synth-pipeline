# HarmonyMeet AI - 鸿蒙 AI 会议协作应用

## 启动方式

```bash
npm install
npm run dev
```

浏览器访问 http://localhost:5173

## 项目结构

```
src/
├── main.tsx              # 应用入口
├── App.tsx               # 根组件，视图路由和主题
├── components/           # 通用组件
│   ├── TopBar.tsx        # 顶部工具栏（设备切换、主题切换）
│   ├── SideNav.tsx       # 侧边导航
│   ├── ToastContainer.tsx # 全局通知系统
│   └── ProjectionModal.tsx # 智慧屏投屏预览弹窗
├── views/                # 主视图
│   ├── DashboardView.tsx # 首页 Dashboard
│   ├── MeetingView.tsx   # 会议进行中（转写+声波+摘要）
│   ├── MinutesView.tsx   # 会议纪要
│   ├── TasksView.tsx     # 任务待办
│   └── HistoryView.tsx   # 历史会议
├── generative/           # Canvas/生成式视觉层
│   ├── WaveformCanvas.tsx # 声波可视化组件
│   └── ParticleConverge.tsx # 纪要生成过渡粒子动效
├── hooks/                # 自定义 Hooks
│   ├── useWaveformCanvas.ts # Canvas 声波 Hook
│   └── useStreamingText.ts  # 流式文字动效 Hook
├── store/                # Zustand 状态管理
│   └── index.ts          # meetingStore / taskStore / uiStore
├── types/                # TypeScript 类型定义
│   └── index.ts
├── utils/                # 工具函数和 Mock 数据
│   └── mockData.ts
└── styles/
    └── globals.css       # 全局样式和 CSS 变量（双主题系统）
```

## 技术栈

- **React 18 + TypeScript** — 组件框架和类型安全
- **Vite** — 构建工具
- **Framer Motion** — 视图切换、spring 动画、stagger 入场
- **Zustand** — 轻量状态管理
- **Tailwind CSS** — 实用类 + 双主题系统
- **Phosphor Icons** — 线性图标系统
- **Canvas 2D API** — 声波可视化 + 粒子聚合动效（原生）

## 交互演示流程

1. **Dashboard** → 点击「加入会议」→ 进入会议视图
2. **会议视图** → 查看实时转写流 + 声波动效 + AI 摘要侧边栏
3. **结束会议** → 点击「结束会议」→ 确认 → 粒子聚合动效 → 跳转纪要
4. **纪要视图** → 查看结构化纪要 → 点击「全部同步到任务」
5. **任务视图** → 筛选任务 → 点击任务查看详情抽屉 → 切换任务状态
6. **功能演示** → 顶部设备标签切换 / 主题切换 / 语言切换
