# 流式文字出现动效 — AI 实时生成的文字动效模式

**来源 Case**：010_meeting-collab  
**适用场景**：AI 内容生成、实时转写、Chatbot 回复、代码生成、文档 AI 整理

---

## 概念说明

当 AI 在"实时生成"或"实时转写"内容时，文字逐字出现比一次性展示更符合认知预期，传达"这是实时的"信号。关键参数：charDelay（字符间隔）决定感知的"速度感"。

---

## 推荐实现

```typescript
// useStreamingText.ts

function useStreamingText({ text, charDelay = 35, enabled = true }) {
  const [displayed, setDisplayed] = useState('');
  // 使用 setTimeout 递归逐字追加
  // cleanup 时 clearTimeout 防止内存泄漏
  return { displayed, isComplete };
}
```

### CSS 动效（每字）
```css
.streaming-char {
  display: inline-block;
  opacity: 0;
  transform: translateY(4px);
  animation: streamChar 0.15s ease-out forwards;
}

@keyframes streamChar {
  to { opacity: 1; transform: translateY(0); }
}
```

---

## charDelay 参数指南

| 场景 | charDelay | 感知效果 |
|------|-----------|----------|
| 实时转写（逼真感） | 25-40ms | 跟得上说话速度 |
| AI 摘要生成 | 15-25ms | 快速但有节奏感 |
| 纪要回顾展示 | 一次性显示 | 已完成内容无需动效 |
| 演示/Demo 模式 | 50-80ms | 清晰可见，方便观察 |

---

## 关键工程约束

1. **自动滚动**：转写面板需要 `scrollTop = scrollHeight` sticky scroll，用户手动滚动时暂停
2. **性能**：超过 200 行时需要截取最近 N 行，避免 DOM 膨胀
3. **降级**：低端设备检测后一次性渲染，不逐字动效
4. **中文支持**：中文字符与英文字符混合时，charDelay 统一按字符计，不区分字节

---

## 不适用场景

- 重要的错误提示（需要立即可见，不应延迟）
- 超长静态文档（用户期望直接阅读）
- 按钮/标签/导航元素（状态变化不应用打字机动效）

---

## 结构化标签

```
style_keywords: ["streaming-text", "ai-typing", "real-time", "text-reveal"]
interaction_level: "low"
motion_primitives: ["stream", "stagger", "fade-in"]
generative_primitives: ["text-stream"]
implementation_hints: ["CSS animation", "React useState + setTimeout", "opacity+translateY"]
uiuxmax_domains: ["ux", "style"]
suitable_stacks: ["react+ts", "vue+ts", "svelte+ts"]
avoid_patterns: ["blinking-cursor-only", "full-page-typing", "slow-reveal-on-static-content"]
```
