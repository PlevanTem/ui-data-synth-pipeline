# 车载安全分级告警动效模式

## 名称

**Safety Tiered Alert Motion** — 安全分级告警动效

## 来源

case 005_car-intelligence，2026-03-16

## 适用场景

- 车载 HMI 安全提醒
- IoT 设备异常告警
- 监控类 Dashboard 告警
- 任何需要"1秒内被感知"的分级通知系统

## 三级告警动效模式

| 级别 | 视觉 | 动效 | 持续 |
|------|------|------|------|
| Info | 绿色顶部细条（4px） | 淡入 300ms | 自动消失 4s |
| Warning | 全宽悬浮横条 56px，琥珀色 glow border | 从顶部滑入 250ms | 用户手动关闭 |
| Danger | 全宽红色横条 72px，边框脉冲 1.2s | 紧急脉冲 + 文字闪烁 | 强制确认才关闭 |

## CSS 实现模式

```css
/* Warning 级别告警边框脉冲 */
@keyframes emergency-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); }
  50% { box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); }
}

/* Danger 级别数字闪烁 */
@keyframes blink-fast {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}
```

## AnimatePresence 入场模式

```typescript
// 告警入场 / 离场
<AnimatePresence>
  {alerts.map(alert => (
    <motion.div
      key={alert.id}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, height: 0 }}
      transition={{ duration: 0.25 }}
    >
      <AlertItem alert={alert} />
    </motion.div>
  ))}
</AnimatePresence>
```

## 视觉层次原则

- Info 不占用主视图空间（细条附着在顶部/底部）
- Warning 可临时遮挡次要内容，但不遮挡核心功能区
- Danger 可以全屏覆盖，优先级最高

## 结构化标签

```
motion_primitives: pulse, blink, slide-in, stagger
visual_primitives: glow, border-pulse
implementation_hints: CSS keyframes, Framer Motion AnimatePresence
uiuxmax_domains: ux, motion
suitable_stacks: react-ts, vue-ts
avoid_patterns: all-same-level, no-close-mechanism, blocking-core-content
```
