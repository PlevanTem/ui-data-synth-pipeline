# Web Design Pipeline — 本 Case 执行说明

**Case 目录名**：`005_saas@v4_20260320`  
**case_id**：`005_saas`  
**输出根路径**（相对仓库）：`outputs/005_saas@v4_20260320/`

## 1. 必须先读的技能与规范

1. `.agents/skills/web-design-pipeline/SKILL.md` — **web-design-pipeline** 主技能（总流程、纪律、交付物）
2. `.agents/skills/web-design-pipeline/references/output-structure.md` — 目录与文件命名（**必须遵守**）
3. 分阶段 Agent（按顺序阅读并执行）：
   - `.agents/skills/web-design-pipeline/agents/pm-agent.md`
   - `.agents/skills/web-design-pipeline/agents/designer-agent.md`
   - `.agents/skills/web-design-pipeline/agents/frontend-agent.md`

技能绝对路径（本机）：`/Users/chenqiaobing/Desktop/proj/ui-data-synth-pipeline/.agents/skills/web-design-pipeline/SKILL.md`

## 2. 批量执行约定

**批量模式**：请连续执行 PM → Designer → Frontend 三个阶段，**不要在 PM 结束后停下来等待用户确认**。


- 禁止「一口气」把三阶段全部臆造完：每阶段按 SKILL 要求思考、检索（如 WebSearch / 脚本）、再写入文件。
- Designer 阶段须真实走 inspiration 与 ui-ux-pro-max 等工作流，不得凭空编造趋势。
- Frontend 须为 **TypeScript + 组件框架** 的可运行工程，交付物写入本目录下的 `03_frontend/`。

## 3. 本 Case 输入（交给 PM Agent 的原始需求）

```text
创建一个解决'信息过载'痛点的企业服务应用，包括：1) 多端同步的实时协作白板；2) 端到端加密的即时通讯模块；3) 自动化报表生成与定时推送；4) 实时地理位置追踪与热力图展示；5) 采用新拟态 (Neumorphism) 软UI风格，确保视觉一致性与用户体验。
```

## 4. 必须落盘的结构（完成后自检）

在 **`outputs/005_saas@v4_20260320/`** 下：

- `meta.json`（可更新 `batch_status`、栈与设计摘要等字段）
- `01_pm/prd.md`、`01_pm/requirement_spec.json`、`01_pm/ia_structure.json`
- `02_designer/style_research.md`、`02_designer/design_brief.md`、`02_designer/design_system.json`、`02_designer/component_specs.json`、`02_designer/visual_effects.json`
- `03_frontend/` 完整可运行项目（含 `package.json`、`tech_decision.json`、`self_review.json` 等）

## 5. 完成后

将 `meta.json` 中 `batch_status` 改为 `completed`，并简要记录 `selected_stack` / `design_style` 等（与仓库中其他 case 的 meta 对齐即可）。

---
*本文件由 `scripts/batch_web_design_pipeline.py` 自动生成。*
