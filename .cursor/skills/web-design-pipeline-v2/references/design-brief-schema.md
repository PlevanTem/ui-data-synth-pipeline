# Design Brief Schema 与 Case 元数据

与 [`SKILL.md`](../SKILL.md) §0 一致；以下为 **JSON schema 语义摘要**（实施时可改为 JSON Schema 文件）。

---

## `case-manifest.json`

- **`schema`**: `wdp.caseManifest/v1`
- **`case_id`**: 目录名
- **`created_at`**: ISO8601
- **`source`**: 对象：`{ "type": "query" | "jsonl", "ref": "…" }`
- **`skill_version`**: 如 `2.0`
- **`frontend_deliverable`**（可配置，与 [`SKILL.md`](../SKILL.md)「前端交付物」一致）:
  - **`single_html`**（**默认**）：`02-build/index.html` 单文件，内联/同页含全部 HTML、样式、脚本；**Tailwind CDN + 原生 JS**，**无需** `npm install`。
  - **`multi_file`**：`index.html` + `css/`、`js/` 等；仍为 Tailwind CDN + 原生 JS、无构建工具链（除非项目另有约定）。
- **`paths`**: 对象，键固定：
  - `designBrief`: `01-brief/design-brief.md`
  - `buildEntry`: `02-build/index.html`
  - `evalDir`: `03-eval/`

---

## `loop-state.json`

- **`schema`**: `wdp.loopState/v1`
- **`case_id`**, **`round`** (1–3), **`max_rounds`**: 3
- **`pipeline_status`**: `pass` | `fail` | `in_progress`
- **`strategy`**: `refine` | `pivot`（Designer 声明下一轮意图）
- **`pivot_count`**: number
- **`weighted_total`**: number | null（最后一轮 Evaluator 写入）
- **`stop_reason`**: string（含残余风险说明）
- **`updated_at`**: ISO8601

**`pipeline_status: pass`** 为 Cursor hook **停止续跑**的主信号。

---

## `eval-round-{nn}.json`（`wdp.evalRound/v1`）

- 必备字段以 [`evaluation-rubric.md`](evaluation-rubric.md) 为准。
- **`reasoning`**：与 `scores` 四键对齐的对象，**先写满推理再给分**。
- **`feedback_for_designer`**：战略层反馈（产品/叙事/高层技术设计），不替代 Designer 实现细节。

---

## `design-brief.md` 设计规范结构

| # | Section | 内容要点 |
|---|---------|----------|
| 1 | Visual Theme & Atmosphere | Mood, density, design philosophy |
| 2 | Color Palette & Roles | 语义名 + hex + 角色；鼓励 OKLCH 标注 |
| 3 | Typography Rules | 字体栈 URL（钉版本）、完整层级表 |
| 4 | Component Stylings | 按钮/卡片/输入/导航 + 状态 |
| 5 | Layout Principles | 间距比例、Grid、留白哲学 |
| 6 | Depth & Elevation | 阴影与表面层级 |
| 7 | Do's and Don'ts | 反 slop + 正面脚手架（字阶、动效时长阶梯） |
| 8 | Responsive Behavior | 断点、触控 ≥44px、折叠策略 |
| 9 | **Agent Prompt Guide** | 一页内快览：主色 hex、字体名、禁止项；**须与上文 token 一致** |

额外保留（Designer 模板内）：**设计问题陈述**、**页面交互清单**、**视觉特效方案**、**Tailwind 配置**、**前端交付**（`single_html` / `multi_file`，与 `case-manifest.json` 的 `frontend_deliverable` 一致）独立章节或短段。

---

## 语境优先 → 再编码

- 若存在 **`01-brief/spec.md`** 或用户给定品牌材料：必须先体现在 brief 再实现。
- **无外部系统**：在 §1 写明自建设计宪章，再展开 token；禁止空泛形容词无 hex/无数值间距。
