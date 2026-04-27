---
name: web-design-pipeline-v2
description: >-
  高质量网站/落地页生成流水线（Designer 生成器 + Evaluator 评估器 + Cursor stop hook 最多 3 轮续跑），网站设计、前端原型、UI 数据合成、带 Playwright 实机评估与反 AI-slop 约束。
version: 2.0
tags: [web design, ui generation, generator-evaluator, playwright, data synthesis]
---

# Web Design Pipeline v2

目标不是「一次性吐代码」，而是**可复盘、可重跑、可归档**的 case 产物 + **生成器–评估器对抗**（Evaluator 独立评判，打破自嗨）。

## §0 目录、命名、归档与输出格式（强制执行）

**Case 根路径**：`artifacts/wdp-v2/{case_id}/`

- `case_id`：仅小写字母、数字、连字符；来自测试 JSON 的 `id` / `domain` 或从 query 派生的 slug（≤64 字符）。**禁止空格与中文路径**。
- 多 case 并行时设置环境变量 **`WDP_CASE_ID`**，供 `.cursor/hooks/grind-design-eval.js` 与人工对齐。

**单 Case 目录树**：

```text
artifacts/wdp-v2/{case_id}/
  README.md                 # 起静态服命令、Playwright URL、case 摘要
  case-manifest.json        # schema: wdp.caseManifest/v1（见 references/design-brief-schema.md）
  01-brief/
    spec.md                 # 可选：需求与功能契约
    design-brief.md         # 必填：九章节设计系统（唯一权威）
  02-build/                 # 具体形态由 case-manifest 的 frontend_deliverable 决定（见下「§ 前端交付物」）
    index.html              # 必存在：默认 = 单文件全量；multi_file 时为入口
  03-eval/
    loop-state.json         # schema: wdp.loopState/v1
    eval-round-01.json      # … eval-round-03.json，schema: wdp.evalRound/v1
    eval-round-01.md        # 可选：人类可读摘要
    screenshots/
      r01-desktop.png
```

**归档**：完结后将 `artifacts/wdp-v2/{case_id}/` 复制或移动到 `archive/wdp-v2/{yyyy-mm}/{case_id}/`（保持内部相对路径不变）。

---

## 角色与 Agent（仅两个）

| 角色 | 子代理（Cursor） | 职责 |
|------|------------------|------|
| **Designer（生成器）** | [`.cursor/agents/wdp-v2-designer.md`](../../../.cursor/agents/wdp-v2-designer.md) | 需求/spec → **九章节** `design-brief.md` → **`02-build/`** 实现（默认单文件 HTML + Tailwind CDN + 原生 JS；`frontend_deliverable: multi_file` 时分拆；分型、变体、Tweaks）；根据 Evaluator 输出 **refine** 或 **pivot** |
| **Evaluator（评估器）** | [`.cursor/agents/wdp-v2-evaluator.md`](../../../.cursor/agents/wdp-v2-evaluator.md) | 只读；**Playwright** 实机 + rubric；写 `eval-round-{nn}.json`、更新 `loop-state.json`；**禁止写实现代码** |

调用顺序：**先完成 brief 再写 `02-build/`**；闭环中 **Evaluator → Designer**。

**子代理位置与显式调用**（与 [Cursor 子代理文档](https://cursor.com/cn/docs/subagents) 一致）：两角色以项目级 Markdown 定义在 **`.cursor/agents/wdp-v2-designer.md`** 与 **`.cursor/agents/wdp-v2-evaluator.md`**（YAML frontmatter：`name` / `description` / `model`）。在对话中可用 **`/wdp-v2-designer`**、**`/wdp-v2-evaluator`** 显式调用，或由 Agent 依任务自动委派。

---

## Cursor Hook（对抗持久化，最多 3 轮）

- 项目已配置 **`.cursor/hooks.json`**：`stop` → `node .cursor/hooks/grind-design-eval.js`，`loop_limit: 3`。
- Hook 在 `pipeline_status === "pass"` 或找不到 `loop-state.json` 时输出 `{}`；否则注入 `followup_message` 要求按本 SKILL 继续 **Evaluator → Designer**。
- 完成信号以 **`03-eval/loop-state.json`** 为准（见 §0）。

---

## 强制执行纪律

1. **禁止一口气输出**：Designer / Evaluator 各阶段禁止在同一回复里跳过工具与验证。
2. **`<execution_plan>`**：任何写入 case 目录前，先输出 checklist，并在同一轮或下一轮**真实执行**工具（WebSearch、Read、Playwright 等），不得假装已执行。
3. **无结果不输出**：趋势、竞品、截图结论必须来自工具返回值后再写入 Markdown/JSON。

---

## 何时使用

- 生成/迭代 landing、dashboard、营销页、web app 静态原型
- 需要 **博物馆级/展览级** 视觉野心 + **可量化** rubric
- 需要 **反 AI Slop**、分型变体、Tweaks、**OKLCH / Grid / 动效脚手架**（见 `references/engineering-guardrails.md`）

---

## 输入

1. **query**：自然语言或产品描述  
2. **test file**：JSON 路径；字段 `id`、`domain`、`user_req` 用于 `case_id` 与上下文

信息不足时 Designer 在 `spec.md` 中列出**显式假设**，仅当分叉无法补全时再问用户。

---

## 交付与技术栈

- **权威设计系统**：仅 `01-brief/design-brief.md`（设计方案规划，**Agent Prompt Guide**）；若用户给品牌/参考则吸收进 brief。

### 前端交付物（可配置）

- **配置位置**：`case-manifest.json` 字段 **`frontend_deliverable`**（见 [`references/design-brief-schema.md`](references/design-brief-schema.md)）。
- **默认 `single_html`（可配置名，语义：单页全量）**  
  - **`02-build/index.html` 单文件**，内含全部 HTML、样式与脚本（可内联 `<style>` / `<script>`，不依赖 `npm install` 与构建步骤）。  
  - **技术栈**：**Tailwind CDN** + 原生 JS；**CDN 必须钉版本**（完整 URL，禁止裸 `@latest`）。  
  - **静态服**：在 `02-build/` 起 **`python -m http.server`**（或等价）供 Playwright 访问。  
- **可选 `multi_file`**  
  - `index.html` 为入口，`link` / `script` 引用 **`./css/`、`./js/`** 等；仍 **Tailwind CDN + 原生 JS**，无 npm 构建；细节见 [`.cursor/agents/wdp-v2-designer.md`](../../../.cursor/agents/wdp-v2-designer.md) 与 [`references/engineering-guardrails.md`](references/engineering-guardrails.md)。

- **分型**：静态 → 并排画布对比；复杂流 → 可点原型 + **≥3 变体轴** + **Tweaks**（CSS 变量 + `?debug=1` 等）。
- **物理尺度**：桌面正文参考 **≥24px**；触控 **≥44px**（见 rubric / guardrails）。
- **生成式视觉**：若 brief 要求 WebGL/Canvas/p5 等，参考 [`.agents/skills/generative-ui/SKILL.md`](../generative-ui/SKILL.md)。

---

## 评分与通过条件

- 维度与权重：[`references/evaluation-rubric.md`](references/evaluation-rubric.md)
- **硬性**：`design_quality` 与 `originality` 任一项小于 8 → 该轮 `pass: false`
- **原创性 + 设计质量** 权重高于工艺与功能（见 rubric）

---

## 参考文件

| 文件 | 用途 |
|------|------|
| [`.cursor/agents/wdp-v2-designer.md`](../../../.cursor/agents/wdp-v2-designer.md) | Designer 子代理（生成器） |
| [`.cursor/agents/wdp-v2-evaluator.md`](../../../.cursor/agents/wdp-v2-evaluator.md) | Evaluator 子代理 + Playwright 清单 |
| [`references/design-brief-schema.md`](references/design-brief-schema.md) | JSON schema 摘要 |
| [`references/evaluation-rubric.md`](references/evaluation-rubric.md) | Rubric 与 eval-round 字段 |
| [`references/engineering-guardrails.md`](references/engineering-guardrails.md) | Tailwind CDN、代码规范、禁 `theme()` 等 |

---

## 质量门槛（摘要）

- `02-build/` 在静态服下可完整交互；无控制台未处理异常阻塞主流程
- **页面交互清单**（见 design-brief）须实现；响应式与基础 a11y 无硬伤
- 未达标时 **`pass: false`**；`eval-round` 先写 `reasoning` 再给 `scores`；`feedback_for_designer` 为**战略层**（非实现细节）。不得伪造 `pass`
