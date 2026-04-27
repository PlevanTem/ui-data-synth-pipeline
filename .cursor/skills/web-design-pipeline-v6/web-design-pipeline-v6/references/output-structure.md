# Output Structure

这个文件定义 `web-design-pipeline` 的目录、命名和归档规范。执行时优先遵守这里，而不是临时自由发挥。

**当前管线版本**：`v5`（2026-04-02）— 每个 Agent 只输出一份核心文件，极简归档。

---

## Case 命名

格式：

```text
{case_id}@v{N}_{YYYYMMDD}
```

- 来自测试集（有 `id` + `domain`）：`{NNN}_{domain_slug}`，例如 `001_devtools@v5_20260402`
- 来自单条 query：`{2-4个英文小写词}@v5_{YYYYMMDD}`，例如 `habit-tracker@v5_20260402`
- 同一天同一 slug 多次运行：末尾加 `-2`、`-3`

## 目录结构

```text
outputs/
└── {case_id}@v5_{YYYYMMDD}/
    ├── meta.json
    ├── 01_pm/
    │   └── prd.md              ← PM 唯一产物：需求推理 + 功能契约 + IA
    ├── 02_designer/
    │   └── design_brief.md     ← Designer 唯一产物：设计系统 + 组件规范 + 特效方案
    └── 03_frontend/
        ├── index.html          ← 单文件交付，含全部 HTML/样式/JS
        └── self_review.json    ← 自审结果
```

说明：

- `index.html` 必须在浏览器中**直接双击打开**运行，无需 `npm install` 或构建步骤
- Tailwind 通过 CDN 引入，设计 Token 通过 `tailwind.config` JS 对象配置
- 第三方库（p5.js、Three.js、GSAP 等）按需 CDN 引入
- 历史版本（v1–v4）存放在 `outputs/v{N}-pipeline/` 只读存档目录

## `meta.json`

```json
{
  "case_id": "",
  "pipeline_version": "v5",
  "generated_date": "YYYYMMDD",
  "source_type": "query|test_file",
  "input_summary": "",
  "domain": "",
  "delivery_mode": "single-file",
  "stack": "html-tailwind-js",
  "cdn_libs_used": [],
  "uses_visual_effects": false,
  "interaction_completeness": "full|partial",
  "created_at": ""
}
```

## 不要做的事

- 不要把产物混在根目录
- 不要创建 `package.json`、`tsconfig.json`、`src/` 目录
- 不要创建除 `index.html` 和 `self_review.json` 以外的前端文件
- 不要省略 `self_review.json`
