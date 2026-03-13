# Architecture

UI Data Synth Pipeline 的整体架构、Agent 实体关系与数据流文档。

---

## 1. 端到端流水线总览

从一条 query 或测试 JSON 出发，经三个 Agent 阶段，产出可运行前端与完整过程数据。

```mermaid
flowchart TD
    INPUT[/"📥 Input\nQuery 自然语言\n或 Test JSON 测试集"/]

    subgraph PIPELINE ["🔄 Web Design Pipeline  ·  web-design-pipeline/SKILL.md"]
        direction TB
        PM["🗂️ PM Agent\n─────────────\n需求压缩 · 范围定义\n信息架构 · PRD 生成"]
        D["🎨 Designer Agent\n─────────────\n趋势调研 · 风格探索\n设计系统 · 组件规格\n视觉特效判断"]
        FE["💻 Frontend Agent\n─────────────\n技术栈选型 · 代码实现\n自检 self_review"]

        PM -->|prd.md\nrequirement_breakdown.json\nia_structure.json| D
        D  -->|design_brief.md\ndesign_system.json\ncomponent_specs.json\nvisual_effects.json| FE
    end

    subgraph TOOLS ["🔧 Standalone Skills  ·  独立可复用工具层"]
        DI["design-inspiration-ai\n趋势扫描 + WebSearch\n风格发散"]
        UU["ui-ux-pro-max\n设计系统收敛\nscripts/search.py"]
        GU["generative-ui\nMode A 背景层\nMode B 交互组件\nMode C 算法艺术"]
    end

    subgraph ASSETS ["📚 Asset Library  ·  references/uiux-asset-library/"]
        AL["trend-notes/\nstyle-recipes/\npalette-strategies/\nmotion-patterns/\nanti-patterns.md"]
    end

    subgraph OUT ["📦 outputs/<case-id>/"]
        direction LR
        O1["01_pm/"]
        O2["02_designer/"]
        O3["03_frontend/"]
        META["meta.json"]
    end

    INPUT --> PIPELINE

    D  -.->|"读取 SKILL.md\n执行趋势扫描 WebSearch"| DI
    D  -.->|"读取 SKILL.md\n调用 search.py"| UU
    FE -.->|"按需读取 SKILL.md\nWebGL / Canvas / p5.js"| GU

    PM  --> O1
    D   --> O2
    FE  --> O3
    PM  --> META
    D   -->|"可泛化结论沉淀"| AL
    AL  -.->|"历史资产查询"| D
```

---

## 2. Skill 层级与调用依赖

两层结构：独立工具 + pipeline 编排。

```mermaid
graph TB
    subgraph L1 ["第一层：独立可复用 Skill（工具库）"]
        DI["designer/\ndesign-inspiration-ai"]
        UU["designer/\nui-ux-pro-max"]
        GU["frontend/\ngenerative-ui"]
        SC["skill-creator"]
    end

    subgraph L2 ["第二层：Pipeline 编排层"]
        subgraph WDP ["web-design-pipeline/"]
            ENTRY["SKILL.md\n入口编排"]
            PMA["agents/pm-agent.md"]
            DA["agents/designer-agent.md"]
            FEA["agents/frontend-agent.md"]
            REF["references/\noutput-structure.md\nuiux-asset-library/"]

            ENTRY --> PMA
            ENTRY --> DA
            ENTRY --> FEA
            ENTRY --> REF
        end
    end

    DA  -->|"读取并遵循"| DI
    DA  -->|"读取并调用 search.py"| UU
    FEA -->|"按需读取"| GU
    DA  <-->|"读取已有资产\n沉淀新结论"| REF

    style L1 fill:#f0f7ff,stroke:#4a9eff
    style L2 fill:#fff8f0,stroke:#ff9a4a
    style WDP fill:#fff8f0,stroke:#ff9a4a,stroke-dasharray:4
```

---

## 3. Agent 实体关系与交付物

每个 Agent 的输入、输出与外部依赖。

```mermaid
erDiagram
    INPUT {
        string query_or_json "用户输入"
        string id            "可选：case ID"
        string domain        "可选：领域标签"
        string user_req      "可选：需求文本"
    }

    PM_AGENT {
        string role       "需求压缩 + 信息架构"
        string reads      "INPUT"
        string produces   "01_pm/ 三份文件"
    }

    DESIGNER_AGENT {
        string role       "风格探索 + 设计系统"
        string reads      "01_pm/ + uiux-asset-library/"
        string invokes    "design-inspiration-ai + ui-ux-pro-max"
        string produces   "02_designer/ 五份文件"
    }

    FRONTEND_AGENT {
        string role       "技术选型 + 代码实现"
        string reads      "01_pm/ + 02_designer/"
        string invokes    "generative-ui（按需）"
        string produces   "03_frontend/ 源码 + 两份 JSON"
    }

    PM_DELIVERABLES {
        file prd_md                   "产品需求文档"
        file requirement_breakdown    "MoSCoW 需求拆解 JSON"
        file ia_structure             "信息架构 JSON"
    }

    DESIGNER_DELIVERABLES {
        file style_research_md        "风格探索记录（含趋势证据）"
        file design_brief_md          "给 Frontend 的执行摘要"
        file design_system_json       "色彩/排版/间距/动效 token"
        file component_specs_json     "组件规格 + 状态 + 交互"
        file visual_effects_json      "WebGL/Canvas 特效建议"
    }

    FRONTEND_DELIVERABLES {
        file source_code              "可运行前端（单文件或多文件）"
        file tech_decision_json       "技术栈选型 + 决策理由"
        file self_review_json         "完成项 + 已知缺口 + 修复建议"
    }

    META {
        string case_id
        string domain
        string selected_stack
        bool   uses_visual_effects
        string status
        string pipeline_version
    }

    INPUT            ||--|| PM_AGENT            : "触发"
    PM_AGENT         ||--|{ PM_DELIVERABLES     : "产出"
    PM_DELIVERABLES  ||--|| DESIGNER_AGENT      : "输入"
    DESIGNER_AGENT   ||--|{ DESIGNER_DELIVERABLES : "产出"
    DESIGNER_DELIVERABLES ||--|| FRONTEND_AGENT : "输入"
    PM_DELIVERABLES  ||--|| FRONTEND_AGENT      : "补充输入"
    FRONTEND_AGENT   ||--|{ FRONTEND_DELIVERABLES : "产出"
    PM_AGENT         ||--|| META               : "写入"
    FRONTEND_AGENT   ||--|| META               : "更新"
```

---

## 4. 单次执行数据流（时序）

一个 case 从触发到归档的完整时序。

```mermaid
sequenceDiagram
    actor User
    participant WDP  as Web Design Pipeline
    participant PM   as PM Agent
    participant SRCH as WebSearch
    participant DI   as design-inspiration-ai
    participant UU   as ui-ux-pro-max
    participant D    as Designer Agent
    participant GU   as generative-ui
    participant FE   as Frontend Agent
    participant FS   as File System

    User  ->> WDP   : query / test JSON

    WDP   ->> FS    : 创建 outputs/<case-id>/ 目录
    WDP   ->> PM    : 传入 query + case 目录
    PM    ->> FS    : 写入 01_pm/prd.md
    PM    ->> FS    : 写入 01_pm/requirement_breakdown.json
    PM    ->> FS    : 写入 01_pm/ia_structure.json

    WDP   ->> D     : 传入 01_pm/ 路径 + asset-library 路径
    D     ->> DI    : 读取 SKILL.md，执行 STEP 1.5
    DI    ->> SRCH  : 3~5 次 WebSearch（趋势扫描）
    SRCH -->> DI    : 趋势信号 + 参考案例
    DI   -->> D     : 趋势洞察摘要
    D     ->> UU    : 读取 SKILL.md，调用 search.py
    UU   -->> D     : 设计资产查询结果
    D     ->> FS    : 写入 02_designer/style_research.md
    D     ->> FS    : 写入 02_designer/design_system.json
    D     ->> FS    : 写入 02_designer/component_specs.json
    D     ->> FS    : 写入 02_designer/design_brief.md
    D     ->> FS    : 写入 02_designer/visual_effects.json
    D     ->> FS    : 沉淀可复用结论到 uiux-asset-library/

    WDP   ->> FE    : 传入 01_pm/ + 02_designer/ 路径
    FE    ->> FS    : 写入 03_frontend/tech_decision.json
    alt visual_effects.json 建议强视觉层
        FE ->> GU   : 读取 SKILL.md，选择 Mode A / B
        GU -->> FE  : 工程约束 + 实现模式
    end
    FE    ->> FS    : 写入 03_frontend/ 源码
    FE    ->> FS    : 写入 03_frontend/self_review.json
    WDP   ->> FS    : 更新 meta.json（status: completed）

    WDP  -->> User  : 汇报：栈选择 · 设计方向 · 交付物路径
```

---

## 5. 输出目录结构

每个 case 的标准归档格式。

```
outputs/
└── <case-id>/                        # 如 001_devtools 或 20260312_143022_habit-tracker
    ├── meta.json                     # case 元数据（栈、域、状态、pipeline 版本）
    │
    ├── 01_pm/
    │   ├── prd.md                    # 产品需求文档（面向下游 agent）
    │   ├── requirement_breakdown.json  # MoSCoW 需求拆解
    │   └── ia_structure.json         # 信息架构（页面结构 + 用户流）
    │
    ├── 02_designer/
    │   ├── style_research.md         # 趋势调研 + 3 方向探索 + 最终选型
    │   ├── design_brief.md           # 给 Frontend 的执行摘要
    │   ├── design_system.json        # 色彩 / 排版 / 间距 / 动效 token
    │   ├── component_specs.json      # 组件清单 + 状态 + 交互规范
    │   └── visual_effects.json       # WebGL / Canvas 特效建议与理由
    │
    └── 03_frontend/
        ├── index.html                # html-tailwind 栈交付物
        ├── src/                      # react / vue / svelte 等多文件栈
        ├── tech_decision.json        # 技术决策 + 选型理由
        └── self_review.json          # 完成项 · 已知缺口 · 修复候选

.agents/skills/references/uiux-asset-library/
    ├── trend-notes/                  # 跨 case 趋势观察
    ├── style-recipes/                # 可复用风格配方（如 devtools-precision-console.md）
    ├── palette-strategies/           # 配色策略
    ├── motion-patterns/              # 动效模式
    └── anti-patterns.md             # 同质化风险清单
```

---

## 6. 技术栈选型决策树

Frontend Agent 在 `tech_decision.json` 中做出的核心判断。

```mermaid
flowchart TD
    Q1{页面主要目标}

    Q1 -->|"展示型 · 品牌 · 快速验证"| HT["html-tailwind\n单文件 · 零构建 · 易归档"]
    Q1 -->|"复杂交互 · 状态管理 · SaaS"| Q2{有 SSR/SEO 要求?}
    Q1 -->|"强交互 · 追求动画性能"| SV["svelte\n轻量 · 响应快"]

    Q2 -->|Yes| NX["nextjs\nSSR · ISR · API routes"]
    Q2 -->|No | RC["react\nhooks · 状态 · 组件复用"]

    HT --> Q3{需要强视觉特效?}
    RC --> Q3
    NX --> Q3
    SV --> Q3

    Q3 -->|"Designer 建议 + 叙事强化"| Q4{特效规模?}
    Q3 -->|"无明确需求 / 内容型"| DONE["✅ 按选型交付"]

    Q4 -->|"粒子 < 500\n氛围层"| CA["Canvas 2D\nMode A"]
    Q4 -->|"粒子 > 10K\nshader 效果"| WGL["WebGL / Three.js\nMode A"]
    Q4 -->|"交互组件\n数据可视化"| CB["Canvas / D3\nMode B"]
    Q4 -->|"独立艺术作品"| P5["p5.js\nMode C"]

    CA  --> DONE
    WGL --> DONE
    CB  --> DONE
    P5  --> DONE
```

---

## 迭代说明

| 扩展点 | 操作 |
|--------|------|
| 增加新的独立工具 | 在 `.agents/skills/designer/` 或 `.agents/skills/frontend/` 下新建目录 |
| 调整 Pipeline 某阶段行为 | 修改 `.agents/skills/web-design-pipeline/agents/<agent>.md` |
| 增加输出格式 | 更新 `references/output-structure.md` + 对应 agent prompt |
| 沉淀设计资产 | 直接写入 `references/uiux-asset-library/` 对应子目录 |
| 调整技术栈选型逻辑 | 修改 `frontend-agent.md` 的选型建议部分 |
