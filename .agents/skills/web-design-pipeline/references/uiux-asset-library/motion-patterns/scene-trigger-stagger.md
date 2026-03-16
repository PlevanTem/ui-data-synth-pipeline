# IoT 场景联动时序动效模式

## 名称

**Scene Trigger Stagger** — 场景联动设备时序激活动效

## 适用场景

- 智能家居场景联动触发
- 批量设备状态变更时的视觉叙事
- 任何"一个操作影响多个元素"的连锁反应

## 问题

用户点击"回家"场景按钮后，多台设备同时瞬间跳变到新状态，体验是机械的、没有叙事感的。

## 解决方案

设备状态变更按 80-120ms 间隔依次执行，形成"场景正在生效"的时间叙事。

## 实现模式

```typescript
// 核心 stagger 执行逻辑
scene.actions.forEach((action, index) => {
  const delay = index * 120  // 每台设备间隔 120ms

  // 先进入"执行中"态（可选：视觉高亮）
  setTimeout(() => markDeviceExecuting(action.deviceId), delay)

  // 应用目标状态
  setTimeout(() => applyDeviceState(action), delay + 300)
})

// 全部完成后标记场景激活
const totalDuration = actions.length * 120 + 400
setTimeout(() => completeScene(sceneId), totalDuration)
```

## 视觉要求

1. 场景卡片点击时：scale 0.95 tap 反馈
2. 执行中：卡片有 animate-pulse 脉冲动画
3. 设备卡片：进入执行中态时微弱高亮，状态切换有 CSS transition（300ms ease）
4. 场景完成：active 徽章出现 + Toast 成功通知

## 参数调优指南

| 场景设备数 | stagger 间隔 | 视觉感知 |
|-----------|------------|--------|
| 3-5台     | 150ms      | 舒缓悠闲 |
| 5-8台     | 120ms      | 适中自然 |
| 8-15台    | 80ms       | 快速干净 |
| 15+台     | 50ms       | 快速批处理感 |

## 结构化标签

```
motion_primitives: stagger, sequence, spring
interaction_level: rich
implementation_hints: setTimeout stagger, Framer Motion stagger, CSS transition
uiuxmax_domains: ux, motion
suitable_stacks: react-ts, vue-ts, svelte-ts
avoid_patterns: instant-state-change, all-at-once-update
```
