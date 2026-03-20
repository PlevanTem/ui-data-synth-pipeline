# CrossBorder Graph Commerce Frontend

## 启动

```bash
npm install
npm run dev
```

## 项目结构

- `src/App.tsx`: 页面主交互编排（导航、筛选、图谱、结果、结账、toast）
- `src/generative/FlowFieldCanvas.tsx`: Canvas 生成式背景层（支持 reduced-motion）
- `src/components/`: 业务组件
- `src/types/`: TypeScript 类型定义
- `src/styles/app.css`: 业务样式
- `src/index.css`: Tailwind v4 全局 token 与 base 规则
