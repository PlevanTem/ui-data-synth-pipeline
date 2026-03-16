# 鸿蒙智联全屋智能中控

> 基于 React + TypeScript + Vite 的智能家居中控 Web App 原型

## 快速启动

```bash
npm install
npm run dev
```

默认在 `http://localhost:5173` 启动。

## 项目结构

```
src/
├── types/          # TypeScript 类型定义（Device, Room, Scene, Energy）
├── store/          # 状态管理
│   ├── DeviceStore.tsx    # React Context + useReducer（设备状态）
│   ├── UIStore.ts         # Zustand（全局 UI：Tab、Toast）
│   └── mockData.ts        # 模拟 IoT 数据（16 台设备，4 个场景）
├── hooks/          # 自定义 hooks
│   ├── useCountUp.ts      # 数字滚动动画
│   └── useMediaQuery.ts   # 响应式断点
├── generative/     # 生成式视觉模块
│   ├── AmbientBackground.tsx  # Canvas 噪声流动背景
│   └── VoiceWaveform.tsx      # 语音控制波形 Canvas
├── components/
│   ├── layout/    # AppLayout, Navigation（BottomNav + SideNav）
│   ├── device/    # DeviceCard, DeviceDetailDrawer
│   ├── scene/     # SceneCard（含联动动效）
│   ├── energy/    # EnergyPanel（Recharts 图表）
│   ├── voice/     # VoiceButton + VoiceOverlay
│   └── ui/        # Toast, Skeleton, StatCard, RoomTabs
└── pages/         # HomePage, DevicesPage, ScenesPage, EnergyPage, SettingsPage
```

## 核心功能

- **全屋仪表盘**：实时设备状态统计，数字计数动画
- **设备卡片控制**：16 台模拟设备，6 种类型，开关/亮度/温度/音量/开合度实时调节
- **房间分组过滤**：客厅/卧室/厨房/书房/卫生间
- **场景联动**：回家/离家/睡眠/观影，触发时设备按时序逐步切换
- **语音控制模拟**：Canvas 波形动画，支持指令识别演示
- **能耗统计**：日/周/月维度，Recharts 面积图 + 柱状图
- **设备详情抽屉**：精细参数控制，Framer Motion 滑入动画
- **响应式布局**：移动端底部导航，桌面端侧边栏三列布局

## 视觉特效

- **Canvas 噪声背景**：simplex-noise 流动的深色环境光
- **设备 Glow 系统**：设备开启时发出类型对应色的光晕（暖黄/冷蓝/绿/紫）
- **场景联动动效**：Framer Motion stagger 时序动画
- **语音波形**：listening/processing/success/error 四态 Canvas 动画
- **骨架屏**：流光扫描加载动画
- **Toast 系统**：Spring 弹性进出动画
