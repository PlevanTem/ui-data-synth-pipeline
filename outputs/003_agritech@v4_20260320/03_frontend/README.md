# AgriFlow Command Frontend

基于 `React + TypeScript + Vite + Tailwind v4` 的农业科技交互原型（多文件工程）。

## 运行方式
```bash
npm install
npm run dev
```

## 构建验证
```bash
npm run build
```

## 已实现能力
- 筛选联动：区域/资源类型/时间窗口共同驱动页面状态。
- 工作流交互：可点击调整节点位置并触发发布反馈。
- 地图联动：热区点选可更新右侧详情。
- CTA 表单：必填校验、提交中状态、成功反馈。
- 生成式背景层：Canvas flow-field，支持 reduced-motion 降级。

## 目录说明
- `src/App.tsx`：全局状态编排、导航锚点、toast 反馈。
- `src/components/DashboardSections.tsx`：核心业务区块（命令中心/工作流/地图/CTA）。
- `src/generative/FlowFieldCanvas.tsx`：生成式视觉层实现。
- `src/hooks/useReducedMotion.ts`：可访问性动效降级。
- `src/types/app.ts`：类型定义。
- `tech_decision.json`：技术选型与前沿候选对比。
- `self_review.json`：对照 PM 契约的自审记录。
