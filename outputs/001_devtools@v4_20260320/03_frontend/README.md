# PulseForge Devtools Frontend

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Structure

- `src/App.tsx`: 主应用与交互状态
- `src/generative/FlowFieldCanvas.tsx`: 生成式流场背景模块
- `src/types/index.ts`: 共享类型
- `src/index.css`: Tailwind v4 `@theme` 变量与基础样式

## Implemented Interactions

- 导航视图切换（overview/root-cause/optimization）
- 搜索 + 严重度筛选 + 排序联动拓扑与表格
- 语音查询状态流转（listening/processing/applied）
- 节点点击联动详情抽屉
- toast 提示、loading/empty/error/retry 状态
