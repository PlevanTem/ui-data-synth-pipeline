# Web Design Pipeline v8.1

端到端网站与 App 原型生成流水线：把一条自然语言需求或测试集记录依次交给 PM、Designer、Frontend 三个 Agent，最终归档需求规格、设计规范、React 工程源码和可直接打开的单文件前端。

当前有效实现位于 `.claude/`。根目录旧文档曾描述 `.agents/skills/`、v4 以及多份阶段产物，这些内容已经不再代表当前主流程。

## 当前能力

- 接受单条自然语言需求，或包含 `id`、`domain`、`user_req` 等字段的测试数据。
- PM Agent 把模糊需求压缩为固定 11 字段的 `prdSpec.json`。
- Designer Agent 基于真实 WebSearch 结果生成可执行的 `design_brief.md`，其中包含设计系统、组件规范、交互清单、视觉方案和 Tailwind 配置。
- Frontend Agent 使用固定工程栈实现页面和完整交互，并打包为自包含的 `bundle.html`。
- 每个 case 同时保留 `_build/` 工程目录，便于源码审查、调试和二次迭代。
- `.cursor/skills/` 与 `scripts/` 提供旧版 case 的慢思考数据合成工具，但不属于 v8.1 主生成链路。

## v8.1 固定技术栈

- React 18
- TypeScript
- Vite
- Tailwind CSS 3.4
- shadcn/ui
- pnpm
- Parcel + `html-inline`

第三方视觉库按需通过 `pnpm add` 安装，并打入 `bundle.html`。当前 v8.1 工程规则禁用 p5.js；噪点或纸感纹理应使用 CSS、SVG `feTurbulence` 等替代方案。

## 三阶段交付

| 阶段 | 输入 | 唯一阶段产物 | 职责 |
| --- | --- | --- | --- |
| PM | query 或测试记录 | `01_pm/prdSpec.json` | 固化用户意图、目标用户、页面类型、功能、视觉、交互和隐性要求 |
| Designer | `prdSpec.json` | `02_designer/design_brief.md` | 实时风格调研、设计系统、组件约束、响应式、动效与 Tailwind 双段配置 |
| Frontend | `prdSpec.json` + `design_brief.md` | `03_frontend/bundle.html` | 初始化 React 工程、实现功能与交互、构建并内联为单文件 |

Frontend 阶段还会保留 `03_frontend/_build/`。它是可继续开发的工程源码，不是替代 `bundle.html` 的第二个最终交付物。

## 标准输出结构

```text
outputs/
└── {case_id}@v8_{YYYYMMDD}/
    ├── meta.json
    ├── 01_pm/
    │   └── prdSpec.json
    ├── 02_designer/
    │   └── design_brief.md
    └── 03_frontend/
        ├── bundle.html
        └── _build/
            ├── package.json
            ├── tailwind.config.js
            ├── vite.config.ts
            ├── node_modules/
            └── src/
                ├── main.tsx
                ├── App.tsx
                ├── index.css
                ├── components/
                └── lib/utils.ts
```

命名规则：

- 测试集 case：`{NNN}_{domain_slug}@v8_{YYYYMMDD}`
- 单条需求：`{2-4个英文小写词}@v8_{YYYYMMDD}`
- 同日重复运行：在目录末尾追加 `-2`、`-3`

## 使用方式

### 1. 环境要求

- Node.js 18+
- pnpm 8+
- Bash
- 能调用 `.claude/agents/` 的 Claude Code 兼容 Agent 环境
- Designer 阶段可用的 WebSearch 工具

项目记录的已验证环境为 Node.js 22.11、pnpm 8.7.5。

### 2. 启动主流程

在项目根目录向 Agent 提供一句网站/App 需求或测试 JSON 路径，并要求使用：

```text
.claude/skills/web-design-pipeline/SKILL.md
```

主流程应连续执行 PM → Designer → Frontend，除非输入缺失会造成实质性架构分叉，否则不在阶段之间等待确认。

### 3. 验收产物

至少检查：

1. `prdSpec.json` 是合法 JSON，并且包含固定的 11 个字段。
2. `design_brief.md` 含真实调研依据、设计约束、交互清单和 Tailwind Block A/Block B。
3. `bundle.html` 存在、以 `<!DOCTYPE html>` 开头且小于 5 MB。
4. 浏览器通过 `file://` 直接打开 `bundle.html` 后，主流程、筛选、表单、导航和状态反馈可操作。
5. `_build/` 被保留，并可在其中运行 `pnpm dev` 做后续开发。

Frontend Agent 的自动流程只做构建级校验，不在 Agent 内循环启动 dev server 或浏览器验收；最终交互验收由使用者打开 `bundle.html` 完成。

## 项目目录

```text
.
├── .claude/
│   ├── agents/
│   │   ├── pm-agent.md
│   │   ├── designer-agent.md
│   │   └── frontend-agent.md
│   └── skills/web-design-pipeline/
│       ├── SKILL.md
│       ├── CHANGELOG.md
│       ├── references/
│       │   ├── output-structure.md
│       │   ├── design-guardrails.md
│       │   └── engineering-guardrails.md
│       └── scripts/
│           ├── init-artifact.sh
│           ├── bundle-artifact.sh
│           └── shadcn-components.tar.gz
├── .cursor/skills/
│   ├── slow-think-causal-chain/
│   └── slow-think-long-chain/
├── scripts/                    # 批处理与训练数据合成工具
├── test/                       # 测试数据
├── outputs/                    # case 归档
├── README.md
└── ARCHITECTURE.md
```

## 辅助脚本与兼容状态

| 工具 | 作用 | 当前状态 |
| --- | --- | --- |
| `scripts/batch_web_design_pipeline.py` | 批量创建 case 骨架和 Cursor 执行说明 | 遗留 v4 实现：默认版本、技能路径和交付清单均未同步到 v8.1，不应直接作为 v8.1 主入口 |
| `scripts/run_cursor_agent_batch.sh` | 按 manifest 调用 Cursor CLI | 依赖上面的遗留骨架格式 |
| `scripts/batch_synth_causal_chains.py` | 通过 OpenAI 兼容 API 批量生成因果链 JSONL | 可扫描多种源码路径，但提示规范仍以旧版多文件产物为主，使用前需核对 v8.1 case 内容 |
| `scripts/run_cursor_agent_batch_causal_chain.sh` | 通过 Cursor Agent 逐 case 合成因果链 | 面向 `.cursor/skills/slow-think-causal-chain` 的后处理流程 |
| `scripts/build_causal_chains_003.py` | 为固定的 003 case 拼装回归样本 | 固定路径的历史工具，不是通用入口 |

脚本细节见 [`scripts/README.md`](./scripts/README.md)。其中的 v4 示例和旧产物名属于历史行为，不应覆盖本 README 的 v8.1 主流程说明。

## 规范来源与已知不一致

当前行为按以下优先级理解：

1. [`output-structure.md`](./.claude/skills/web-design-pipeline/references/output-structure.md) 的 v8.1 归档规则。
2. [`frontend-agent.md`](./.claude/agents/frontend-agent.md) 与 [`engineering-guardrails.md`](./.claude/skills/web-design-pipeline/references/engineering-guardrails.md) 的实现规则。
3. [`SKILL.md`](./.claude/skills/web-design-pipeline/SKILL.md) 的顶层编排规则。
4. 根目录 `scripts/` 中尚未迁移的 v4 辅助流程。

仓库当前仍有三处需要后续代码/规则修正的冲突：

- `SKILL.md` front matter 仍写 `version: 8.0`，而 `CHANGELOG.md` 和 `output-structure.md` 已定义 v8.1。
- `SKILL.md` 部分段落仍要求打包后删除 `_build/`、仍把 p5.js 列为可选库；v8.1 的实际规则是保留 `_build/` 并禁用 p5.js。
- 批量建壳脚本仍默认 v4，并生成 `.agents/skills/...` 路径和旧版多文件交付清单。

这些冲突在本次仅更新说明文档的范围内没有修改。执行 v8.1 时，以前述优先级为准。

## 进一步阅读

- [架构与数据流](./ARCHITECTURE.md)
- [当前输出规范](./.claude/skills/web-design-pipeline/references/output-structure.md)
- [设计约束](./.claude/skills/web-design-pipeline/references/design-guardrails.md)
- [工程约束](./.claude/skills/web-design-pipeline/references/engineering-guardrails.md)
- [版本记录](./.claude/skills/web-design-pipeline/CHANGELOG.md)

