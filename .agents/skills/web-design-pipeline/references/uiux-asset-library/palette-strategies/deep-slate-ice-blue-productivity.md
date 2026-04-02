# 深石板暗色 + 冰蓝强调 — 生产力工具配色策略

**来源 Case**：010_meeting-collab  
**适用场景**：AI 工具、会议协作、效率 SaaS、技术产品、暗色系优先界面

---

## 配色结构

### 暗色模式（主推）
```css
--bg-base:     #0a0f1e   /* 最深底色，全局背景 */
--bg-surface:  #111827   /* 卡片/面板表面 */
--bg-elevated: #1e2a3a   /* 浮层/Tooltip */
--bg-overlay:  #243247   /* Modal 前景，最高层 */

--border-subtle:  #1e293b  /* 微分割线 */
--border-default: #2d3f52  /* 普通卡片边框 */
--border-strong:  #3d5168  /* 活跃状态/hover 边框 */

--text-primary:   #f1f5f9  /* 主文字 */
--text-secondary: #94a3b8  /* 次要文字 */
--text-tertiary:  #64748b  /* 占位符/标签 */

--accent:       #38bdf8    /* 冰蓝强调色：CTA/激活态/AI 高亮 */
--accent-muted: #1e3a4f    /* 强调色背景（低亮度版） */
--success: #34d399
--warning: #fbbf24
--error:   #f87171
```

### 亮色模式（配套）
```css
--bg-base:     #f8fafc
--bg-surface:  #ffffff
--bg-elevated: #f1f5f9
--accent:      #0284c7    /* 亮色模式强调色（更深） */
```

---

## 使用原则

1. **唯一强调色**：冰蓝 #38bdf8 用于主要 CTA、激活态、AI 相关信息高亮，不引入第二个高饱和色
2. **层次感靠背景色差异**：base / surface / elevated / overlay 四层，无 shadow 也有层次感
3. **暗色模式的 shadow** 必须用更深的黑（`rgba(0,0,0,0.4+)`），不用灰色
4. **文字对比度**：主文字 #f1f5f9 在 #111827 底色上对比度 > 12:1（AAA 级）

---

## 适用场景

- 企业 SaaS 仪表盘（暗色模式）
- AI 工具界面（流式内容展示）
- 技术开发工具
- 需要长时使用、减少眼疲劳的场景

## 不适用场景

- 消费品零售/电商（缺乏温暖感）
- 医疗/儿童产品（偏冷，信任感不足）
- 需要高度"白净清爽"感的品牌（如时尚/美妆）

---

## 结构化标签

```
style_keywords: ["deep-slate", "ice-blue", "dark-mode-first", "single-accent", "enterprise"]
interaction_level: "medium"
visual_primitives: ["depth", "grid", "subtle-glow"]
uiuxmax_domains: ["color", "style"]
suitable_stacks: ["react+ts", "vue+ts", "svelte+ts"]
avoid_patterns: ["multiple-accent-colors", "bright-gradient-bg", "glassmorphism-overuse"]
```
