# Skills 目录结构说明

这里有两类文件，层级不同，不要混淆：

---

## 第一层：独立可复用 Skill（工具库）

放在顶层子目录下，可以在任何上下文中单独调用。

```
.agents/skills/
├── designer/
│   ├── design-inspiration-ai/   ← 设计研究引擎：趋势调研 + 优秀案例搜寻 + 风格探索
│   └── ui-ux-pro-max/           ← 设计系统收敛 + 排版配色工具（含 scripts/search.py）
├── frontend/
│   └── generative-ui/          ← 交互式 UI + 算法艺术（Mode A: 背景层 / Mode B: 交互组件 / Mode C: 独立艺术）
└── skill-creator/               ← 创建/评估/优化 skill 的元工具
```

这些 skill 各自有完整的 `SKILL.md`，内含自己的工作流、数据和脚本，可以独立触发。

---

## 第二层：Pipeline 编排层（专属于 web-design-pipeline）

放在 `web-design-pipeline/` 下，只在这个 pipeline 上下文中有意义。

```
.agents/skills/web-design-pipeline/
├── SKILL.md              ← Pipeline 入口，负责编排整个流程
├── agents/
│   ├── pm-agent.md       ← PM 阶段系统提示（无外部 skill 依赖）
│   ├── designer-agent.md ← Designer 阶段系统提示（调用 designer/ 层工具）
│   └── frontend-agent.md ← Frontend 阶段系统提示（调用 frontend/ 层工具）
└── references/
    ├── output-structure.md
    └── uiux-asset-library/   ← 带 catalog 索引与统一 schema 的设计资产库
```

`agents/` 下的文件 **不是独立 skill**，它们是 pipeline 各阶段的执行指令，通过显式 skill 调用来驱动上层工具。

---

## 调用关系

```
web-design-pipeline/SKILL.md
  ├─ 调用 agents/pm-agent.md
  ├─ 调用 agents/designer-agent.md
  │     ├─ 读取并遵循 designer/design-inspiration-ai/SKILL.md（趋势扫描 + 优秀案例搜寻 + 审美信号判断）
  │     └─ 读取并遵循 designer/ui-ux-pro-max/SKILL.md（设计系统收敛）
  └─ 调用 agents/frontend-agent.md
        └─ 按需读取 frontend/generative-ui/SKILL.md（WebGL / 生成式 UI）
```

---

## 重要原则

- **独立 skill** 有自己的判断和工作流，调用时"读取 SKILL.md → 按其流程执行"
- **pipeline agents** 是编排层，不要和独立 skill 的工作流重叠描述；遇到领域问题应委托给对应工具
- 有新的通用设计工具或前端能力，加在 `designer/` 或 `frontend/` 下；pipeline 专属的调整改 `agents/` 下的文件
