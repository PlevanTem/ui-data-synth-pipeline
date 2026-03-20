# Travel Quest AR Frontend

## Run
```bash
npm install
npm run dev
```

## Structure
- `src/App.tsx`: 主应用与四个视图（Tasks/Shop/Form/AR）
- `src/generative/FlowFieldCanvas.tsx`: 生成式背景层
- `src/hooks/useLocalStorage.ts`: 状态持久化
- `src/types/models.ts`: 类型定义
- `src/index.css`: Tailwind v4 globals + theme tokens

## Notes
- 遵循 `prefers-reduced-motion` 与用户“减少动效”设置。
- AR 使用相机权限 + fallback mock overlay，保证拒绝权限时仍可用。
# Travel Quest AR Frontend

## 启动方式

```bash
npm install
npm run dev
```

## 目录结构

- `src/App.tsx`：主业务交互（任务/商城/表单/AR）
- `src/generative/FlowFieldCanvas.tsx`：生成式流场背景层
- `src/hooks/useLocalState.ts`：本地状态持久化
- `src/types/index.ts`：业务类型定义
- `src/styles/globals.css`：Tailwind v4 + `@theme` 全局变量
- `src/styles/app.css`：业务样式
- `tech_decision.json`：技术决策记录
- `self_review.json`：契约核查与自审

## 已实现能力

- 任务完成后积分和账本联动更新
- 商城兑换积分校验与成功/失败反馈
- 3 步无障碍表单（验证、loading、提交反馈）
- AR 权限状态分支与 fallback 导览
- localStorage 持久化与 reduced-motion 降级
