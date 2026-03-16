# Architecture

UI Data Synth Pipeline 的整体架构、Agent 实体关系与数据流文档。

---

## 1. 端到端流水线总览

从一条 query 或测试 JSON 出发，经 `PM -> Designer -> Frontend` 三阶段，产出可运行前端与完整过程数据。

```mermaid
flowchart TD
    INPUT[/"📥 Input\n自然语言 Query\n或测试 JSON"/]

    subgraph PIPELINE ["🔄 Web Design Pipeline"]
        direction TB
        PM["🗂️ PM Agent\n需求压缩\n信息架构\nPRD 生成"]
        D["🎨 Designer Agent\n趋势调研\n风格探索\n设计系统与组件规格\n视觉特效判断"]
        FE["💻 Frontend Agent\n技术栈选型\n代码实现\nself_review"]

        PM -->|"prd.md\nrequirement_breakdown.json\nia_structure.json"| D
        D -->|"design_brief.md\ndesign_system.json\ncomponent_specs.json\nvisual_effects.json"| FE
    end

    subgraph TOOLS ["🔧 Standalone Skills"]
        DI["design-inspiration-ai\n趋势扫描\nWebSearch\n概念发散"]
        UU["ui-ux-pro-max\n设计系统收敛\nsearch.py\nanimated-components.csv"]
        GU["generative-ui\nMode A 背景层\nMode B 交互组件\nMode C 算法艺术\nMode D 动效组件库"]
    end

    subgraph ASSETS ["📚 Asset Library"]
        AL["trend-notes/\nstyle-recipes/\npalette-strategies/\nmotion-patterns/\ngenerative-recipes/\nanti-patterns.md"]
    end

    subgraph OUT ["📦 Outputs"]
        direction LR
        O1["01_pm"]
        O2["02_designer"]
        O3["03_frontend"]
        META["meta.json"]
    end

    INPUT --> PIPELINE

    D -.->|"读取 SKILL\n趋势扫描"| DI
    D -.->|"读取 SKILL\n检索资产"| UU
    FE -.->|"按需读取 SKILL\n生成视觉或动效组件"| GU

    PM --> O1
    D --> O2
    FE --> O3
    PM --> META
    D -->|"沉淀可复用结论"| AL
    AL -.->|"历史资产查询"| D
```

---

## 2. Skill 层级与调用依赖

两层结构：上层是独立工具库，下层是 pipeline 编排层。

```mermaid
flowchart TB
    subgraph L1 ["第一层：独立可复用 Skill"]
        DI["designer/\ndesign-inspiration-ai"]
        UU["designer/\nui-ux-pro-max\n(含 animated-components.csv)"]
        GU["frontend/\ngenerative-ui\n(Mode A/B/C/D)"]
        SC["skill-creator"]
    end

    subgraph L2 ["第二层：Pipeline 编排层"]
        subgraph WDP ["web-design-pipeline/"]
            ENTRY["SKILL.md\n入口编排"]
            PMA["agents/pm-agent.md"]
            DA["agents/designer-agent.md"]
            FEA["agents/frontend-agent.md"]
            REF["references/\noutput-structure.md\nuiux-asset-library/\nCHANGELOG.md"]

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

这一层强调每个 Agent 的输入、输出与外部依赖。

```mermaid
erDiagram
    INPUT {
        string query_or_json "用户输入"
        string id "可选：case ID"
        string domain "可选：领域标签"
        string user_req "可选：需求文本"
    }

    PM_AGENT {
        string role "需求压缩 + 信息架构"
        string reads "INPUT"
        string produces "01_pm/ 三份文件"
    }

    DESIGNER_AGENT {
        string role "风格探索 + 设计系统 + 视觉特效判断"
        string reads "01_pm/ + uiux-asset-library/"
        string invokes "design-inspiration-ai + ui-ux-pro-max"
        string produces "02_designer/ 五份文件"
    }

    FRONTEND_AGENT {
        string role "技术选型 + 代码实现（TypeScript / 组件框架）"
        string reads "01_pm/ + 02_designer/"
        string invokes "generative-ui（按需：Mode A/B/C/D）"
        string produces "03_frontend/ 多文件源码 + 两份 JSON"
    }

    PM_DELIVERABLES {
        file prd_md "产品需求文档"
        file requirement_breakdown "MoSCoW 需求拆解 JSON"
        file ia_structure "信息架构 JSON"
    }

    DESIGNER_DELIVERABLES {
        file style_research_md "风格探索记录（含趋势证据 + generative 调研）"
        file design_brief_md "给 Frontend 的执行摘要"
        file design_system_json "色彩/排版/间距/动效 token + generative 美学参数"
        file component_specs_json "组件规格 + 状态 + 交互 + 组件间联动"
        file visual_effects_json "特效建议：effect_type / generative_combination / component_library_selections"
    }

    FRONTEND_DELIVERABLES {
        file source_code "可运行前端（多文件项目，TypeScript / 组件框架）"
        file tech_decision_json "技术栈选型 + 前沿候选比较 + generative 策略"
        file self_review_json "完成项 + 交互完整性 + 已知缺口 + 修复建议"
    }

    META {
        string case_id
        string pipeline_version "如 v4"
        string generated_date "YYYYMMDD"
        string domain
        string selected_stack
        array component_library_used "如 magicui reactbits"
        bool uses_visual_effects
        string interaction_completeness
    }

    INPUT ||--|| PM_AGENT : "触发"
    PM_AGENT ||--|{ PM_DELIVERABLES : "产出"
    PM_DELIVERABLES ||--|| DESIGNER_AGENT : "输入"
    DESIGNER_AGENT ||--|{ DESIGNER_DELIVERABLES : "产出"
    DESIGNER_DELIVERABLES ||--|| FRONTEND_AGENT : "输入"
    PM_DELIVERABLES ||--|| FRONTEND_AGENT : "补充输入"
    FRONTEND_AGENT ||--|{ FRONTEND_DELIVERABLES : "产出"
    PM_AGENT ||--|| META : "写入"
    FRONTEND_AGENT ||--|| META : "更新"
```

---

## 4. 单次执行数据流（时序）

下图展示单个 case 从触发到归档的完整时序。

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

    User ->> WDP : query / test JSON

    WDP ->> FS : 创建 outputs/{case_id}@v{N}_{YYYYMMDD}/
    WDP ->> PM : 传入 query + case 目录
    PM ->> FS : 写入 01_pm/prd.md
    PM ->> FS : 写入 01_pm/requirement_breakdown.json
    PM ->> FS : 写入 01_pm/ia_structure.json

    WDP ->> D : 传入 01_pm/ + asset-library 路径
    D ->> DI : 读取 SKILL.md，执行 STEP 1.5
    DI ->> SRCH : 3~5 次 WebSearch
    SRCH -->> DI : 趋势信号 + 参考案例
    DI -->> D : 趋势洞察摘要
    D ->> UU : 读取 SKILL.md，调用 search.py
    UU -->> D : 设计资产查询结果
    D ->> FS : 写入 02_designer/style_research.md
    D ->> FS : 写入 02_designer/design_system.json
    D ->> FS : 写入 02_designer/component_specs.json
    D ->> FS : 写入 02_designer/design_brief.md
    D ->> FS : 写入 02_designer/visual_effects.json
    D ->> FS : 沉淀结论到 uiux-asset-library/

    WDP ->> FE : 传入 01_pm/ + 02_designer/
    FE ->> FS : 写入 03_frontend/tech_decision.json
    alt visual_effects.json 建议生成式视觉层
        FE ->> GU : 读取 SKILL.md
        note over GU: Mode A 背景层<br/>Mode B 交互组件<br/>Mode C 算法艺术<br/>Mode D 动效组件库（MagicUI/ReactBits/AnimateUI）
        GU -->> FE : 工程约束 + 实现模式 + MCP 安装命令
    end
    FE ->> FS : 写入 03_frontend/ 多文件源码
    FE ->> FS : 写入 03_frontend/self_review.json
    WDP ->> FS : 更新 meta.json
    note over WDP,FS: 写入 pipeline_version / generated_date / status

    WDP -->> User : 汇报栈选择、设计方向与交付物路径
```

---

## 5. 输出目录结构

每个 case 的标准归档格式如下（`v4` 起）。

```text
outputs/
├── v1-pipeline/                       # v1 历史存档（只读）
├── v2-pipeline/                       # v2 历史存档（只读）
├── v3-pipeline/                       # v3 历史存档（只读）
└── {case_id}@v{N}_{YYYYMMDD}/         # v4 起，如 010_meeting-collab@v4_20260315
    ├── meta.json                      # case 元数据：版本、日期、域、技术栈、状态
    │
    ├── 01_pm/
    │   ├── prd.md                     # 产品需求文档（面向下游 agent）
    │   ├── requirement_breakdown.json # MoSCoW 需求拆解
    │   └── ia_structure.json          # 信息架构（页面结构 + 用户流）
    │
    ├── 02_designer/
    │   ├── style_research.md          # 趋势调研、generative 调研、方向探索、最终选型
    │   ├── design_brief.md            # 给 Frontend 的执行摘要（含组件联动清单）
    │   ├── design_system.json         # 色彩、排版、间距、动效 token + generative 参数
    │   ├── component_specs.json       # 组件清单、状态、交互规范、组件间联动
    │   └── visual_effects.json        # 特效建议与组件库选择
    │
    └── 03_frontend/
        ├── [框架惯用结构]/             # 多文件项目，按所选框架自由组织
        ├── src/generative/            # Canvas / WebGL / p5.js / Three.js 模块
        ├── tech_decision.json         # 技术决策、前沿候选比较、generative 策略
        └── self_review.json           # 完成项、交互完整性、已知缺口、修复候选

.agents/skills/web-design-pipeline/references/uiux-asset-library/
├── trend-notes/                       # 跨 case 趋势观察
├── style-recipes/                     # 可复用风格配方
├── palette-strategies/                # 配色策略
├── motion-patterns/                   # 动效模式
├── generative-recipes/                # generative 视觉与代码艺术组合策略
└── anti-patterns.md                   # 同质化风险清单
```

---

## 6. 技术栈选型决策树

这是 Frontend Agent 在 `tech_decision.json` 中做出的核心判断。本项目以视觉品质优先，不按实现成本排序。

```mermaid
flowchart TD
    Q1{页面主要目标}

    Q1 -->|"复杂交互 · 状态管理 · SaaS / AI 工具"| Q2{是否需要 SSR / SEO？}
    Q1 -->|"强交互 · 动画性能优先 · 轻量交付"| SV["svelte / sveltekit\n轻量、响应快\nThrelte 可做 3D"]
    Q1 -->|"内容结构明确 · 组件编排复杂"| VU["vue / nuxt\nTresJS 可做 3D"]
    Q1 -->|"极简展示 · 快速验证"| AS["astro / vite + TypeScript\n门槛低，仍建议 TS"]

    Q2 -->|"是"| NX["nextjs\nSSR / ISR / API routes"]
    Q2 -->|"否"| RC["react\nhooks、状态管理、组件复用"]

    RC --> Q3
    NX --> Q3
    SV --> Q3
    VU --> Q3
    AS --> Q3

    Q3{是否需要视觉增强层？}

    Q3 -->|"文字动效 · 特效背景 · 品牌组件"| MD["Mode D 动效组件库\nMagicUI / ReactBits / AnimateUI\n通过 MCP 安装（仅 React / Next.js）"]
    Q3 -->|"算法生成视觉 · 氛围背景层"| MA["Mode A\nCanvas 2D / p5.js\nPerlin noise、流场、粒子"]
    Q3 -->|"GPU 级质感 · shader · 大规模粒子"| WGL["Mode A WebGL\nThree.js / React Three Fiber\nGLSL shader"]
    Q3 -->|"交互组件 · 数据可视化"| MB["Mode B\nCanvas / D3 / Chart.js\n图表、模拟器等交互组件"]
    Q3 -->|"独立算法艺术作品"| MC["Mode C\np5.js + seeded randomness\n算法艺术"]
    Q3 -->|"无明确需求 / 偏内容型"| DONE["✅ 按基础选型交付"]

    MD --> DONE
    MA --> DONE
    WGL --> DONE
    MB --> DONE
    MC --> DONE

    NOTE["说明：Mode 可组合\n例如 Mode D + Mode A\n= 动效组件 + 自写生成背景"]
    NOTE -.-> DONE
```

---

## 7. 管线版本与迭代

| 版本 | 日期 | 主要变更 |
|------|------|----------|
| v1 | 2026 早期 | 基本流水线，单阶段生成，测试集批量跑通 |
| v2 | 2026 早期 | 三阶段流水线（PM → Designer → Frontend），uiux-asset-library 资产沉淀 |
| v3 | 2026 早期 | generative-ui skill，强制多文件 TS 交付，禁纯静态 HTML，视觉品质门槛 |
| **v4** | **2026-03-15** | **动效组件库层（Mode D）+ MCP 集成 + 输出目录命名规范 + 结构模板解放** |

详细变更记录见：`.agents/skills/web-design-pipeline/CHANGELOG.md`

| 扩展点 | 操作 |
|--------|------|
| 增加新的独立工具 | 在 `.agents/skills/designer/` 或 `.agents/skills/frontend/` 下新建目录 |
| 调整 Pipeline 某阶段行为 | 修改 `.agents/skills/web-design-pipeline/agents/<agent>.md` |
| 增加输出格式 | 更新 `references/output-structure.md` + 对应 agent prompt |
| 沉淀设计资产 | 直接写入 `references/uiux-asset-library/` 对应子目录 |
| 调整技术栈选型逻辑 | 修改 `frontend-agent.md` 的选型建议部分 |
| 管线版本升级 | 更新 `SKILL.md` 版本号 + `output-structure.md` 命名格式 + 追加 `CHANGELOG.md` |
