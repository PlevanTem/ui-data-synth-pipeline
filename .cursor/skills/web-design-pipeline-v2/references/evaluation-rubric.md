# Evaluation Rubric（视觉品质与创新）

评估锚点：**博物馆级 / 展览级完成度** — 指整体叙事、材质与节奏是否像刻意策展，而非模板拼贴。

## 四维度（1–10 分）

| 维度 | 英文键 | 含义 |
|------|--------|------|
| 设计质量 | `design_quality` | 整体感、情绪与身份感、层级与叙事是否统一 |
| 原创性 | `originality` | 是否有冒险的美学决策与非常规组合，避免安全牌 |
| 工艺 | `craft` | 排版、间距、对比度、动效节奏、技术执行干净度 |
| 功能性 | `functionality` | 交互可用、关键路径、响应式、控制台无阻塞错误 |

## 权重（加权总分 `weighted_total`）

- `originality`：**0.35**
- `design_quality`：**0.35**
- `craft`：**0.15**
- `functionality`：**0.15**

## 通过规则（写入 `eval-round-{nn}.json` 的 `pass`）

1. `design_quality >= 8` **且** `originality >= 8`
2. `weighted_total >= 7.0`（可按项目微调，写入 `loop-state.json` 备注）
3. 无 **P0 阻断项**（Evaluator 清单：首屏白屏、导航完全不可用、表单无法提交、Playwright 核心步骤失败）

任一不满足 → `pass: false`。

## `eval-round-{nn}.json` 字段约定

相对路径均相对 **`artifacts/wdp-v2/{case_id}/`**。

**写作与键顺序**：**先**写 `reasoning`（各维度推完全部论据后再定分），**再**写 `scores`；`scores` 必须与 `reasoning` 自洽。JSON 中建议 `reasoning` 在 `scores` 之前，便于人读与审阅 diff。

| 字段 | 类型 | 说明 |
|------|------|------|
| `schema` | string | 固定 `wdp.evalRound/v1` |
| `case_id` | string | 与目录一致 |
| `round` | number | 1–3，与文件名 `nn` 一致 |
| `reasoning` | object | **先推理再给分**；与 `scores` 四键同名：`design_quality`、`originality`、`craft`、`functionality`；每键为**完整段落**（证据：截图/交互步骤/代码嗅觉/slop；权衡：为何是该区间而非上下一分）。禁止只有分数没有论据 |
| `scores` | object | 四个维度整数 1–10（须在 `reasoning` 成文后再填） |
| `weighted_total` | number | 按上表权重计算，保留两位小数 |
| `pass` | boolean | 按通过规则 |
| `evidence` | object | `screenshots`: string[] 相对 `03-eval/screenshots/`；`playwright_steps`: string；`console_errors_summary`: string |
| `feedback_for_designer` | string | **给下一轮 Designer 的战略层输入**（见下「与 `reasoning` 分工」）；区分 refine / 建议 pivot |
| `slop_flags` | string[] | 命中反模式 id（见 `.cursor/agents/wdp-v2-evaluator.md`） |

### `reasoning` 与 `feedback_for_designer` 分工

- **`reasoning`**：收拢本轮**评分的因果链**（为何各维度是此分、与 `evidence` 如何对应、是否触达 slop 压分规则），供复盘与对账。
- **`feedback_for_designer`**：**不得**把 `reasoning` 整段重贴成操作手册；应转为 **产品/用户目标缺口、信息架构与叙事、体验与品质档位、高层技术/视觉策略**（如是否升级交互范式、数据叙事、可及性/性能/稳定性目标、是否建议 pivot 及气质关键词）。**避免** 具体实现细节：不写 HTML/CSS/JS 片段、不指定类名/选择器/变量名/行级算法——实现由 Designer 据 `design-brief` 与 spec 落码。若 P0 阻断（白屏、主流程不可达等），在 `feedback_for_designer` 用**问题陈述 + 成功标准**描述（例如「主路径须在移动宽下可完成 X」），不代写修复补丁。

## Slop 命中与上限（可选收紧）

若 `slop_flags` 含 **≥2** 个 P1 项，则该轮 `originality` 与 `design_quality` **不得超过 5**（Evaluator 在写入 JSON 前强制压分并说明）。
