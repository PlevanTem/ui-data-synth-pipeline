# Claude Code 项目构建 Prompts
> 按顺序执行以下 5 个 Prompt，每个 Prompt 完成后验证产出物再进入下一步。
---
## 全局上下文（贴入 CLAUDE.md）
```markdown
# UI-SYNTH: 高品质 UI 网站数据合成流水线
## 项目概述
一套 Multi-Agent 数据合成流水线，从 Query → 推理过程 → 高质量 UI 代码，
产出可用于训练 AI 生成专业级 UI 的 (query, thinking, code) 数据集。
## 架构核心原则
- 奥卡姆剃刀：能砍则砍，不过度工程
- 5 个 Agent 串行流水线，无需复杂并发
- 每个 Agent = 1 个目录，内含 skills（纯函数）
- Agent 间通过 TypeScript 类型严格约束数据流
- 所有 LLM 调用通过统一的 provider 层，支持切换模型
## 技术栈
- Runtime: Node.js + TypeScript (strict)
- LLM: Anthropic Claude API (@anthropic-ai/sdk)
- 无框架，纯 TS，最小依赖
- 数据格式: JSONL
## Agent 流水线（5 个 Agent，串行执行）
```
Seeds → [用户研究Agent] → Persona+Query
→ [产品经理Agent] → PRD
→ [设计师Agent] → DesignSpec
→ [前端开发Agent] → Code
→ [编织Agent] → 最终训练数据
```
## 目录结构约定
```
ui-synth/
├── src/
│ ├── types/ # 全局类型定义（Agent 间的契约）
│ ├── agents/ # 5 个 Agent，每个一个目录
│ │ ├── researcher/ # 用户研究 Agent
│ │ ├── pm/ # 产品经理 Agent
│ │ ├── designer/ # 设计师 Agent
│ │ ├── developer/ # 前端开发 Agent
│ │ └── weaver/ # 数据编织 Agent
│ ├── pipeline/ # 流水线编排
│ ├── llm/ # LLM 调用封装
│ └── knowledge/ # 设计趋势等知识库
├── seeds/ # 种子数据（手动 + 采集）
├── output/ # 中间产物
│ ├── personas/
│ ├── prds/
│ ├── designs/
│ ├── codes/
│ └── conversations/
├── dataset/ # 最终数据集
├── CLAUDE.md
├── package.json
└── tsconfig.json
```
```
---
## Prompt 1 · 地基：类型系统 + 项目骨架
```markdown
## 任务
初始化 ui-synth 项目，搭建完整的类型系统和项目骨架。
类型系统是整个流水线的契约层，必须先于一切实现。
## 要求
### 1. 项目初始化
- pnpm init，TypeScript strict mode
- 依赖仅安装: @anthropic-ai/sdk, zod, uuid
- tsconfig 开启 strict, paths alias (@/ → src/)
### 2. 核心类型定义 (src/types/index.ts)
定义 5 个 Agent 之间传递的数据结构，这是整个系统的脊梁：
```typescript
// === L0: 种子 ===
interface Seed {
id: string;
query: string; // 用户原始请求
category: Category; // 13 个领域之一
complexity: "low" | "medium" | "high";
source: string; // 来源标注
}
type Category =
| "saas_dashboard" | "e_commerce" | "portfolio"
| "landing_page" | "blog_content" | "social_community"
| "ai_tool" | "fintech" | "healthcare"
| "education" | "creator_economy" | "internal_tool"
| "mobile_first";
// === L1: 用户研究 Agent 输出 ===
interface ResearchOutput {
seed: Seed;
persona: Persona;
scenario: Scenario;
queryVariants: QueryVariant[]; // 同一需求的多种表达
}
interface Persona {
name: string;
role: string;
techLevel: "low" | "medium" | "high";
designSense: "low" | "medium" | "high";
background: string;
goals: string[];
frustrations: string[];
}
interface Scenario {
context: string;
motivation: string;
constraints: string[];
successCriteria: string[];
emotionalGoals: string[];
}
interface QueryVariant {
style: "vague" | "detailed" | "reference" | "problem";
text: string;
}
// === L2: 产品经理 Agent 输出 ===
interface PRDOutput {
projectName: string;
oneLiner: string;
targetAudience: string;
requirements: {
mustHave: Requirement[];
shouldHave: Requirement[];
niceToHave: Requirement[];
outOfScope: string[];
};
informationArchitecture: {
pageType: "single_page" | "multi_page" | "spa";
sections: Section[];
navigationModel: string;
userFlows: string[];
};
dataModel: {
entities: Entity[];
storage: string;
};
edgeCases: EdgeCase[];
nonFunctionalRequirements: {
performance: string[];
accessibility: string[];
responsive: string[];
};
}
interface Requirement {
id: string;
title: string;
description: string;
acceptanceCriteria: string[];
}
interface Section {
id: string;
purpose: string;
components: string[];
priority: "P0" | "P1" | "P2";
}
interface Entity {
name: string;
fields: Record<string, string>;
}
interface EdgeCase {
scenario: string;
expectedBehavior: string;
}
// === L3: 设计师 Agent 输出 ===
interface DesignOutput {
rationale: DesignRationale;
designSystem: DesignSystem;
componentSpecs: ComponentSpec[];
specialStates: SpecialState[];
}
interface DesignRationale {
moodAndPersonality: string[];
emotionalDesignGoals: string[];
competitiveInsights: string[];
trendsApplied: TrendApplication[];
layoutStrategy: {
mobile: string;
tablet: string;
desktop: string;
};
}
interface TrendApplication {
trend: string; // e.g., "bento_grid", "liquid_glass"
where: string; // 应用位置
rationale: string; // 为什么在这里用
}
interface DesignSystem {
colors: {
light: Record<string, string>; // token名 → hex
dark: Record<string, string>;
semanticReasoning: string; // 为什么选这些颜色
};
typography: {
headingFont: string;
bodyFont: string;
scale: Record<string, { size: string; lineHeight: string }>;
};
spacing: { unit: number; scale: number[] };
borderRadius: Record<string, string>;
shadows: Record<string, string>;
animations: {
durations: Record<string, string>;
easings: Record<string, string>;
keyAnimations: Record<string, string>; // 关键动画描述
};
}
interface ComponentSpec {
name: string;
purpose: string;
variants: string[];
states: string[]; // idle, hover, pressed, disabled, loading...
anatomy: Record<string, string>; // 子元素描述
interactions: Record<string, string>; // 交互行为描述
responsive: Record<string, string>; // 响应式行为
}
interface SpecialState {
state: string; // empty, error, loading, success
design: string; // 设计描述
tone: string; // 语调
components: string[];
}
// === L4: 前端开发 Agent 输出 ===
interface CodeOutput {
techStack: {
framework: string;
styling: string;
componentLibrary: string;
otherDeps: string[];
reasoning: Record<string, string>; // 每个选择的理由
};
files: CodeFile[];
projectStructure: string; // 文件树文本描述
}
interface CodeFile {
path: string; // e.g., "app/page.tsx"
content: string; // 完整代码
purpose: string; // 文件用途简述
}
// === L6: 编织 Agent 输出 (最终数据集条目) ===
interface DatasetEntry {
id: string;
conversation: ConversationTurn[];
metadata: {
seedId: string;
category: Category;
complexity: string;
dialogueType: "direct" | "clarification" | "iterative" | "reference";
personaType: string;
techStack: string[];
designTrends: string[];
componentCount: number;
totalCodeLines: number;
fileCount: number;
};
artifacts: {
persona: Persona;
prd: PRDOutput;
designSpec: DesignOutput;
};
}
interface ConversationTurn {
role: "user" | "assistant";
content: string;
}
// === Pipeline 配置 ===
interface PipelineConfig {
seed: Seed;
dialogueType: "direct" | "clarification" | "iterative" | "reference";
modelConfig: {
research: string; // model name for each agent
pm: string;
designer: string;
developer: string;
weaver: string;
};
}
```
### 3. LLM 调用封装 (src/llm/provider.ts)
- 封装 Anthropic Claude API 调用
- 统一接口: `callLLM(systemPrompt, userPrompt, options) → string`
- options 包含: model, maxTokens, temperature
- 内置重试逻辑 (3次, 指数退避)
- 支持 structured output: `callLLMJSON<T>(system, user, schema, options) → T`
用 zod schema 做运行时校验，失败自动重试并在 prompt 中附带错误信息
### 4. Agent 基础框架 (src/agents/base.ts)
- 定义 Agent 基类或工厂函数
- 每个 Agent 有: name, systemPrompt, skills[]
- Skill = `(input: I, context: PipelineContext) => Promise<O>` 的纯函数
- PipelineContext 包含已积累的所有中间产物
### 5. Pipeline Runner 骨架 (src/pipeline/runner.ts)
- `runPipeline(config: PipelineConfig): Promise<DatasetEntry>`
- 串行调用 5 个 Agent，每一步输出写入 output/ 目录
- 每步完成打印进度日志
- 错误时 throw 并标记失败步骤
### 6. 入口文件 (src/index.ts)
- 读取 seeds/ 目录下的种子文件
- 循环调用 pipeline
- 输出写入 dataset/ 目录
## 验收标准
- `pnpm build` 无 TypeScript 错误
- 项目结构清晰，每个文件 < 150 行
- 类型定义完整，Agent 骨架就位（skill 函数体为 TODO）
- 能 `pnpm start` 运行，虽然 Agent 还没实现但骨架流程走得通（输出 TODO 日志）
```
---
## Prompt 2 · 知识层 + 用户研究 Agent + 产品经理 Agent
```markdown
## 任务
实现流水线的前半段：知识库 + 用户研究 Agent + 产品经理 Agent。
## 前置
Prompt 1 已完成，项目骨架和类型系统就位。
## 要求
### 1. 设计趋势知识库 (src/knowledge/design-trends.ts)
导出一个纯文本常量，作为设计师 Agent 的系统知识注入。内容涵盖 2025-2026 核心 UI 设计趋势：
```typescript
export const DESIGN_TRENDS_2026 = `
## 2025-2026 UI Design Trends Reference
### Liquid Glass
Semi-transparent surfaces with backdrop blur, reflecting light and color.
CSS: backdrop-filter: blur(16px); background: rgba(255,255,255,0.1);
Use for: navigation bars, modals, floating cards.
### Bento Grid
Rounded rectangular cards in modular grid layout.
Use for: dashboards, feature showcases, content organization.
Characteristics: varied card sizes, consistent gap, rounded-2xl corners.
### Dopamine Design
Bold, saturated, vibrant colors. Neon gradients, high-contrast pairs.
Moving away from muted minimalism toward energetic expression.
Use for: CTAs, accents, gradients, brand colors.
### Kinetic Typography
Custom fonts, oversized headlines, animated text effects.
Use for: hero sections, landing page headlines, brand statements.
### Micro-interactions & Satisfying Feedback
Spring animations, haptic-like visual feedback, state transitions.
Every interaction should have visible, delightful response.
Easing: cubic-bezier(0.34, 1.56, 0.64, 1) for spring feel.
### Dark Mode as First-Class
Not just color inversion. Independent dark palette design.
Subtle elevation through brightness (not shadow).
Support prefers-color-scheme with smooth transition.
### Texture & Depth Revival
Return from flat design to subtle depth, shadows, layered surfaces.
Noise textures, gradient meshes, organic shapes.
### Key CSS/Tech Patterns
- clamp() for fluid typography
- Container queries for component-level responsive
- View Transitions API for page transitions
- Scroll-driven animations
- oklch() color space for perceptually uniform colors
`;
```
同时创建 `src/knowledge/ui-patterns.ts`，包含常见 UI 模式参考（按领域组织）：
```typescript
export const UI_PATTERNS: Record<Category, string> = {
saas_dashboard: `
Common patterns: Sidebar navigation, Bento grid metrics cards,
Data tables with sort/filter, Line/bar charts, Activity feed,
Command palette (Cmd+K), Breadcrumb navigation.
References: Linear, Vercel Dashboard, Stripe Dashboard.
`,
e_commerce: `
Common patterns: Product grid with filters, Product detail with
image gallery, Shopping cart slide-over, Checkout flow,
Review cards, Size/variant selector.
References: Shopify storefront, Apple Store, Glossier.
`,
// ...为全部 13 个 Category 编写（每个 3-5 行，点明核心模式和参考产品）
};
```
### 2. 种子数据 (seeds/initial.json)
手动创建 10 条高质量种子，覆盖不同领域和复杂度：
```json
[
{
"id": "seed-001",
"query": "Build me a project management dashboard with kanban board, team workload view, and timeline chart",
"category": "saas_dashboard",
"complexity": "high",
"source": "curated"
},
{
"id": "seed-002",
"query": "Create a minimal portfolio website for a product designer with case studies and a contact form",
"category": "portfolio",
"complexity": "medium",
"source": "curated"
}
// ... 8 more, 确保: 3 high + 4 medium + 3 low, 覆盖至少 8 个不同 category
]
```
### 3. 用户研究 Agent (src/agents/researcher/)
目录结构：
```
src/agents/researcher/
├── index.ts # Agent 入口，组装 skills
├── prompts.ts # 所有 prompt 模板
└── skills/
├── synthesize-query.ts # Skill 1: 丰富和结构化 query
├── generate-persona.ts # Skill 2: 生成用户画像
├── elaborate-scenario.ts # Skill 3: 场景深化
└── diversify-query.ts # Skill 4: 生成 query 变体
```
**Agent 入口** (index.ts):
```typescript
export async function runResearchAgent(
seed: Seed,
context: PipelineContext
): Promise<ResearchOutput> {
// 1. 丰富 query (补充隐含需求、类似产品)
const enrichedSeed = await synthesizeQuery(seed);
// 2. 生成 persona
const persona = await generatePersona(enrichedSeed);
// 3. 深化场景
const scenario = await elaborateScenario(enrichedSeed, persona);
// 4. 生成 query 变体
const queryVariants = await diversifyQuery(enrichedSeed, persona);
return { seed: enrichedSeed, persona, scenario, queryVariants };
}
```
**Prompt 设计要求**：
- 每个 skill 的 prompt 放在 prompts.ts 中统一管理
- System prompt 设定角色："你是一位资深用户研究员..."
- User prompt 用模板函数生成，注入上下文
- 输出要求 JSON 格式，用 zod schema 校验
- Persona 要有血有肉（不是模板化的"User A"），有名字、背景故事、真实的 frustrations
- Scenario 要包含情感目标（不只是功能性目标）
- Query 变体要模拟真实用户的不同表达方式（模糊的/详细的/参考驱动的/问题驱动的）
### 4. 产品经理 Agent (src/agents/pm/)
目录结构：
```
src/agents/pm/
├── index.ts
├── prompts.ts
└── skills/
├── analyze-requirements.ts # Skill 1: 需求分析 + MoSCoW 排序
├── design-architecture.ts # Skill 2: 信息架构设计
└── generate-prd.ts # Skill 3: 完整 PRD 生成
```
**Agent 入口** (index.ts):
```typescript
export async function runPMAgent(
research: ResearchOutput,
context: PipelineContext
): Promise<PRDOutput> {
// 1. 需求分析
const requirements = await analyzeRequirements(research);
// 2. 信息架构
const architecture = await designArchitecture(research, requirements);
// 3. 完整 PRD
const prd = await generatePRD(research, requirements, architecture);
return prd;
}
```
**Prompt 设计要求**：
- System prompt："你是一位有 10 年经验的产品经理，擅长将模糊需求转化为清晰的产品规格..."
- PRD 必须包含：
- MoSCoW 优先级的功能列表（每个 must-have 有明确的验收标准）
- 信息架构（sections + 组件列表 + 导航模型）
- 用户流（primary + secondary）
- 数据模型（entities + storage 方案）
- 边界情况（empty/error/loading/success 至少 4 个）
- 非功能需求（性能/可访问性/响应式）
- out_of_scope 列表（明确什么不做）
- 对前端和设计的约束传递要明确写出
- PRD 的深度要匹配 complexity：low → 简洁聚焦，high → 详尽全面
### 5. 集成测试
- 在 pipeline runner 中接入这两个 Agent
- 用 seed-001 跑通 L0→L1→L2 流程
- 中间产物写入 output/personas/ 和 output/prds/
- 验证输出符合类型定义
## 验收标准
- `pnpm build` 通过
- 用 seed-001 运行，生成合理的 Persona + PRD
- Persona 有名字、背景、真实痛点（非模板化）
- PRD 的 must-have requirements 每条有明确 acceptance criteria
- PRD 的 edge_cases 至少包含 empty state 和 error state
- 中间产物以 JSON 格式保存在 output/ 目录
```
---
## Prompt 3 · 设计师 Agent + 前端开发 Agent
```markdown
## 任务
实现流水线的后半段：设计师 Agent（L3）+ 前端开发 Agent（L4）。
这是整个流水线最关键的两个 Agent，直接决定最终代码质量。
## 前置
Prompt 1-2 已完成。用户研究 Agent 和产品经理 Agent 可以正常输出 ResearchOutput 和 PRDOutput。
## 要求
### 1. 设计师 Agent (src/agents/designer/)
目录结构：
```
src/agents/designer/
├── index.ts
├── prompts.ts
└── skills/
├── reason-design.ts # Skill 1: 设计决策推理
├── generate-design-system.ts # Skill 2: 设计系统生成
├── spec-components.ts # Skill 3: 组件规范
└── design-states.ts # Skill 4: 特殊状态设计
```
**Agent 入口**:
```typescript
export async function runDesignerAgent(
research: ResearchOutput,
prd: PRDOutput,
context: PipelineContext
): Promise<DesignOutput> {
// 1. 设计决策推理（注入设计趋势知识库）
const rationale = await reasonDesign(research, prd);
// 2. 生成设计系统（基于 rationale 的色彩/排版/间距/动画 token）
const designSystem = await generateDesignSystem(rationale, research.persona);
// 3. 组件规范（基于 PRD 的信息架构 + 设计系统）
const componentSpecs = await specComponents(prd, designSystem);
// 4. 特殊状态设计（基于 PRD 的 edge cases）
const specialStates = await designStates(prd.edgeCases, designSystem);
return { rationale, designSystem, componentSpecs, specialStates };
}
```
**Prompt 设计要求**：
**Skill 1 - reasonDesign prompt 核心要点**：
- 注入 DESIGN_TRENDS_2026 知识库到 system prompt
- 注入对应 category 的 UI_PATTERNS 到 user prompt
- 要求输出：
- 品牌性格（3-5 个形容词 + 原因）
- 情感设计目标（绑定到具体交互，不是空泛的"好看"）
- 竞品设计分析（从 similar_products 推导，取其所长避其所短）
- 趋势应用决策（哪个趋势用在哪里，为什么，**不是所有趋势都要用**）
- 布局策略（mobile / tablet / desktop 三档）
**Skill 2 - generateDesignSystem prompt 核心要点**：
- 色彩必须有语义推理（"orange = energy 因为目标用户群体..."）
- 必须同时输出 light + dark 完整色板
- 排版：选择具体的 Google Fonts 或系统字体，给出完整 scale
- 间距：4px 基准，给出常用 scale
- 动画：定义 2-3 个关键动画的具体参数（easing, duration, 行为描述）
- **重要：所有 token 值必须是可直接映射到 Tailwind config 的**
**Skill 3 - specComponents prompt 核心要点**：
- 遍历 PRD 的 sections，为每个核心组件生成规范
- 每个组件必须定义：variants, states (至少 idle/hover/focus/disabled), anatomy, interactions
- 响应式行为描述（mobile vs desktop 有什么区别）
- **不要过度设计**：只规范 PRD 中出现的组件，不凭空创造
**Skill 4 - designStates prompt 核心要点**：
- 为 PRD 中的每个 edge case 设计对应的视觉方案
- 强制覆盖：empty state, loading state, error state, success/celebration state
- 每个状态包含：设计描述（具体元素）、语调（tone）、需要的组件
- Empty state 不是空白，是引导机会
- Error state 传递安慰，提供解决方案
### 2. 前端开发 Agent (src/agents/developer/)
目录结构：
```
src/agents/developer/
├── index.ts
├── prompts.ts
└── skills/
├── select-stack.ts # Skill 1: 技术栈选型
├── scaffold-project.ts # Skill 2: 项目结构 + 配置文件
├── implement-code.ts # Skill 3: 完整代码实现（核心 skill）
└── self-review.ts # Skill 4: 代码自审 + 修复
```
**Agent 入口**:
```typescript
export async function runDeveloperAgent(
research: ResearchOutput,
prd: PRDOutput,
design: DesignOutput,
context: PipelineContext
): Promise<CodeOutput> {
// 1. 技术栈选型
const techStack = await selectStack(prd, design);
// 2. 项目脚手架（生成配置文件 + 文件结构规划）
const scaffold = await scaffoldProject(techStack, design.designSystem);
// 3. 完整代码实现（这是最核心的 skill，一次性生成所有文件）
const code = await implementCode(prd, design, techStack, scaffold);
// 4. 代码自审（检查常见问题，自动修复）
const reviewed = await selfReview(code, prd, design);
return reviewed;
}
```
**Prompt 设计要求**：
**Skill 1 - selectStack prompt**：
基于简单决策规则，不需要 LLM 调用，纯逻辑判断即可：
```typescript
function selectStack(prd: PRDOutput, design: DesignOutput): TechStack {
// 根据 pageType 和 complexity 决定
// single_page + low complexity → HTML + Tailwind + Alpine.js
// single_page + medium/high → React (Vite) + Tailwind + shadcn/ui
// spa → Next.js + Tailwind + shadcn/ui
// multi_page → Next.js + Tailwind + shadcn/ui
// 如需图表 → 加 Recharts
// 如需复杂动画 → 加 Framer Motion
}
```
**Skill 2 - scaffoldProject prompt**：
生成：
- tailwind.config.ts（将 DesignSystem 的 tokens 映射为 Tailwind 配置）
- package.json（精确的依赖列表）
- tsconfig.json
- 文件树规划（哪些文件要生成）
这个 skill 可以部分用模板 + 部分 LLM 生成。
**Skill 3 - implementCode prompt（最关键）**：
System prompt 核心指令：
```
你是一位有 10 年经验的高级前端工程师。你的代码以简洁、优雅、高品质著称。
你现在要基于给定的 PRD 和设计规范，生成完整的、生产就绪的前端代码。
## 代码质量标准（必须遵守）
1. TypeScript strict mode，无 any
2. 所有样式使用 Tailwind CSS utilities，颜色/间距引用 design token
3. 语义化 HTML（nav, main, section, article, aside, button）
4. 可访问性：ARIA labels, focus-visible:ring, 色彩对比度
5. 响应式：mobile-first，使用 sm:/md:/lg: 断点
6. Dark mode：class-based strategy，所有组件有 dark: 变体
7. 交互状态完整：hover, focus, active, disabled, loading, empty, error
8. 动画：简单交互用 CSS transition，复杂用 Framer Motion
9. 组件单一职责，props 接口清晰
10. 无 console.log，无 TODO，无 magic numbers
## 设计规范（必须严格遵循）
{designSystem 完整输出}
## 组件规范（逐一实现）
{componentSpecs 完整输出}
## 特殊状态（必须实现）
{specialStates 完整输出}
```
User prompt 注入：完整的 PRD + 设计规范 + 文件树规划
输出格式：JSON array of CodeFile，每个文件包含 path + content + purpose
**关键约束**：
- 单次 LLM 调用可能无法生成所有文件（token 限制）
- 策略：先生成文件清单 + 关键配置文件 + 核心页面，再分批生成组件
- 拆分逻辑：
1. 第一次调用：layout.tsx + page.tsx + globals.css + tailwind.config.ts + types
2. 第二次调用：所有 UI 基础组件 (Button, Card, Input, etc.)
3. 第三次调用：所有业务组件 (每个 section 的组件)
4. 第四次调用：hooks + lib/utils
- 每次调用都带上前面已生成的文件上下文（文件名+用途，不是全量代码）
**Skill 4 - selfReview prompt**：
检查已生成的代码，focus 在：
- 有没有缺少的 import
- 有没有引用但未实现的组件
- Dark mode 变体是否遗漏
- 空状态/错误状态是否真的实现了
- 输出：修复后的 CodeFile[]（只返回需要修改的文件）
### 3. 集成
- 在 pipeline runner 中接入设计师 Agent 和前端开发 Agent
- 用 seed-001 跑通 L0→L1→L2→L3→L4 完整流程
- 中间产物写入对应的 output/ 子目录
- 代码文件以实际文件结构保存在 output/codes/{seed-id}/ 下
## 验收标准
- 用 seed-001 端到端运行成功
- 设计系统有完整的 light + dark 色板，有语义推理
- 组件规范覆盖 PRD 中所有 P0 sections
- 生成的代码文件结构清晰（components/ui, components/sections, hooks, lib, types）
- 代码使用设计系统的 token（不是随机的颜色值）
- tailwind.config 与设计系统 token 一致
- 代码中包含 dark mode 变体
- 代码中有至少 1 个 empty state 和 1 个 loading state 实现
```
---
## Prompt 4 · 数据编织 Agent + Pipeline 完整串通
```markdown
## 任务
实现数据编织 Agent（L6+L7），并将整条流水线完整串通。
编织 Agent 是最后一个 Agent，负责将全链路产物编织为最终的训练数据。
## 前置
Prompt 1-3 已完成。5 个 Agent 中前 4 个已就绪。
## 要求
### 1. 数据编织 Agent (src/agents/weaver/)
目录结构：
```
src/agents/weaver/
├── index.ts
├── prompts.ts
└── skills/
├── synthesize-thinking.ts # Skill 1: 思维链合成
├── weave-dialogue.ts # Skill 2: 对话编织
└── assemble-entry.ts # Skill 3: 数据集条目组装
```
**Agent 入口**:
```typescript
export async function runWeaverAgent(
research: ResearchOutput,
prd: PRDOutput,
design: DesignOutput,
code: CodeOutput,
config: PipelineConfig
): Promise<DatasetEntry> {
// 1. 将全链路中间推理合成为自然的思维链
const thinking = await synthesizeThinking(research, prd, design, code);
// 2. 根据 dialogueType 编织对话
const conversation = await weaveDialogue(
research, thinking, code, config.dialogueType
);
// 3. 组装最终数据集条目
const entry = assembleEntry(
config.seed, research, prd, design, code, conversation
);
return entry;
}
```
**Skill 1 - synthesizeThinking prompt（思维链合成）**：
这是最需要技巧的 skill。目标是将 4 个 Agent 的结构化输出融合为一段
读起来像"一个专家在自然思考"的文本。
System prompt：
```
你是一位同时精通产品、设计和前端开发的全栈专家。
你现在要基于以下结构化分析材料，合成一段自然的内心思考过程（thinking）。
这段文字将作为 AI assistant 回答用户 UI 开发请求时的 <think> 内容。
## 要求
1. 用第一人称（"让我分析一下用户的需求..."）
2. 自然流畅，像真正在思考，不是在填表
3. 思考深度要体现专业性，但不卖弄
4. 结构：
- 需求理解（2-3句话，展示对用户深层需求的理解）
- 用户画像推导（简要，1-2句）
- 产品规划思考（核心功能、优先级、what NOT to do）
- 设计决策（色彩选择的why、布局策略、要用的趋势）
- 技术选型推理（为什么选这个栈、关键技术决策）
- 实现计划（组件拆解、需要注意的难点）
5. 总长度: 600-1500 字（视 complexity 调整）
6. 详略得当：关键决策展开推理，常规操作一笔带过
7. 不要列清单/bullet points，用连贯的段落
```
User prompt 注入：
- 原始 query
- persona（摘要）
- PRD 关键部分（requirements.mustHave, architecture, edgeCases）
- design rationale
- techStack + reasoning
**Skill 2 - weaveDialogue prompt（对话编织）**：
根据 dialogueType 生成不同结构的对话：
```typescript
type DialogueType = "direct" | "clarification" | "iterative" | "reference";
```
**direct 模式（最简单）**：
```json
[
{ "role": "user", "content": "{original query or detailed variant}" },
{ "role": "assistant", "content": "<think>\n{thinking}\n</think>\n\n{正文 + 代码}" }
]
```
**clarification 模式**：
```json
[
{ "role": "user", "content": "{vague query variant}" },
{ "role": "assistant", "content": "{3-5 个自然的澄清问题}" },
{ "role": "user", "content": "{回答澄清问题（从 persona/scenario 推导）}" },
{ "role": "assistant", "content": "<think>\n{thinking}\n</think>\n\n{正文 + 代码}" }
]
```
**iterative 模式**：
```json
[
{ "role": "user", "content": "{query}" },
{ "role": "assistant", "content": "<think>{v1 thinking}</think>\n\n{V1 代码（部分功能）}" },
{ "role": "user", "content": "{修改请求：如 'add dark mode' / 'make it more colorful'}" },
{ "role": "assistant", "content": "<think>{增量思考}</think>\n\n{V2 完整代码}" }
]
```
**reference 模式**：
```json
[
{ "role": "user", "content": "Build something like {reference product} but for {domain}" },
{ "role": "assistant", "content": "<think>{分析参考 + 领域适配思考}</think>\n\n{代码}" }
]
```
**Prompt 设计要点**：
- assistant 的正文部分需要自然：先简要说明方案，然后输出代码
- 代码输出格式：分文件用 ```tsx 代码块，每个文件标注文件路径
- clarification 的问题要自然（不是生硬的列表）
- iterative 的 V1 是完整可运行的简化版，V2 是增量修改后的完整版
- 用户侧的措辞要自然，像真人在对话（可以有口语化表达）
**Skill 3 - assembleEntry（纯函数，不需要 LLM）**：
- 组装 DatasetEntry 结构
- 计算 metadata（componentCount, totalCodeLines, fileCount 等）
- 附带所有 artifacts
### 2. Pipeline 完整串通 (src/pipeline/runner.ts)
更新 runner，完整串联 5 个 Agent：
```typescript
export async function runPipeline(config: PipelineConfig): Promise<DatasetEntry> {
const context: PipelineContext = { artifacts: {} };
// L0+L1: 用户研究
console.log(`[1/5] 🔍 Running User Research Agent...`);
const research = await runResearchAgent(config.seed, context);
context.artifacts.research = research;
await saveArtifact(`output/personas/${config.seed.id}.json`, research);
// L2: 产品经理
console.log(`[2/5] 📋 Running PM Agent...`);
const prd = await runPMAgent(research, context);
context.artifacts.prd = prd;
await saveArtifact(`output/prds/${config.seed.id}.json`, prd);
// L3: 设计师
console.log(`[3/5] 🎨 Running Designer Agent...`);
const design = await runDesignerAgent(research, prd, context);
context.artifacts.design = design;
await saveArtifact(`output/designs/${config.seed.id}.json`, design);
// L4: 前端开发
console.log(`[4/5] 💻 Running Developer Agent...`);
const code = await runDeveloperAgent(research, prd, design, context);
context.artifacts.code = code;
await saveCodeFiles(`output/codes/${config.seed.id}/`, code);
// L6+L7: 数据编织
console.log(`[5/5] 📦 Running Weaver Agent...`);
const entry = await runWeaverAgent(research, prd, design, code, config);
await saveArtifact(`dataset/${config.seed.id}.json`, entry);
console.log(`✅ Pipeline complete for ${config.seed.id}`);
return entry;
}
```
### 3. 入口与批量运行 (src/index.ts)
```typescript
async function main() {
const seeds = loadSeeds("seeds/initial.json");
// 每个 seed 可以生成多种 dialogueType
const dialogueTypes: DialogueType[] = ["direct", "clarification", "iterative", "reference"];
for (const seed of seeds) {
// 为每个 seed 随机选一种 dialogue type（或全部生成）
const dialogueType = dialogueTypes[Math.floor(Math.random() * dialogueTypes.length)];
const config: PipelineConfig = {
seed,
dialogueType,
modelConfig: {
research: "claude-sonnet-4-20250514",
pm: "claude-sonnet-4-20250514",
designer: "claude-sonnet-4-20250514",
developer: "claude-sonnet-4-20250514",
weaver: "claude-sonnet-4-20250514",
},
};
try {
const entry = await runPipeline(config);
console.log(`✅ ${seed.id} → ${entry.id} (score: N/A, dialogue: ${dialogueType})`);
} catch (error) {
console.error(`❌ ${seed.id} failed:`, error);
// 记录失败，继续下一个
}
}
// 合并为最终 JSONL
await mergeToJsonl("dataset/", "dataset/ui-synth-v1.jsonl");
console.log("🎉 Dataset generation complete!");
}
```
### 4. 工具函数 (src/pipeline/utils.ts)
- `saveArtifact(path, data)` — JSON 写入
- `saveCodeFiles(dir, codeOutput)` — 按文件树写入实际文件
- `loadSeeds(path)` — 读取种子
- `mergeToJsonl(dir, outputPath)` — 合并为 JSONL
- `countCodeLines(files)` — 统计代码行数
- `countComponents(files)` — 统计组件数量
## 验收标准
- 用 seed-001 完整跑通 5 个 Agent
- 产出一条完整的 DatasetEntry JSON
- DatasetEntry.conversation 包含完整的 <think> 块 + 代码
- thinking 读起来自然流畅，像专家在思考
- 代码在 conversation 中按文件分块展示
- output/ 目录下有完整的中间产物（personas, prds, designs, codes）
- output/codes/seed-001/ 下有可查看的实际代码文件
- dataset/seed-001.json 是完整的最终数据集条目
```
---
## Prompt 5 · 打磨 + 跑通 10 条端到端
```markdown
## 任务
打磨流水线质量，用 10 条种子完整跑通，产出第一版数据集。
重点是发现和修复实际运行中的问题，提升输出质量。
## 前置
Prompt 1-4 已完成，流水线已能跑通单条数据。
## 要求
### 1. 质量检查与修复
先用 seed-001 和 seed-002 跑一遍完整流水线。
检查输出，对以下常见问题逐一修复：
**检查清单**：
a) **类型一致性**：Agent 输出是否都通过了 zod 校验？
如果有字段缺失或类型不匹配，修复 prompt 或 schema。
b) **设计系统连贯性**：
- DesignSystem 的颜色 token 是否在 code 的 tailwind.config 中被正确引用？
- 代码中是否有硬编码的颜色值（如 `bg-blue-500`）而不是 token（如 `bg-primary`）？
- 如果有断裂，修复 developer agent 的 prompt，强调必须引用 design token。
c) **代码完整性**：
- 是否有组件被 import 但未生成？
- 是否有 TypeScript 类型定义缺失？
- 文件之间的 import 路径是否正确？
- 如果有问题，修复 selfReview skill 的检查逻辑。
d) **思维链质量**：
- thinking 是否读起来自然（不是机械地列清单）？
- 是否体现了专业深度？
- 长度是否在 600-1500 字范围内？
- 如果质量不够，调整 synthesizeThinking 的 prompt。
e) **对话自然度**：
- clarification 的问题是否自然？
- iterative 的修改请求是否合理？
- 用户侧措辞是否像真人？
- 如果不够自然，调整 weaveDialogue 的 prompt。
### 2. 错误处理加固
```typescript
// 在 pipeline runner 中添加：
// a) 每个 Agent 调用加 try-catch，失败时记录上下文信息
// b) LLM 返回的 JSON 解析失败时的重试逻辑（已有的话确认是否生效）
// c) 单个 Agent 失败不影响其他 seed 的处理
// d) 运行结束后输出统计：成功/失败/各步骤耗时
```
### 3. 添加运行统计 (src/pipeline/stats.ts)
```typescript
interface PipelineStats {
totalSeeds: number;
successful: number;
failed: number;
failureReasons: Record<string, number>; // agent_name → failure count
avgDuration: {
research: number; // ms
pm: number;
designer: number;
developer: number;
weaver: number;
total: number;
};
tokenUsage: {
totalInput: number;
totalOutput: number;
estimatedCost: number; // USD
};
}
```
### 4. 完整跑通 10 条种子
运行全部 10 条种子（seeds/initial.json），每条随机分配一种 dialogueType。
### 5. 最终数据集合并
- 将所有成功的 DatasetEntry 合并为 `dataset/ui-synth-v1.jsonl`
- 每行一条 JSON
- 生成 `dataset/README.md`，包含：
- 数据集描述
- 统计信息（条数、领域分布、复杂度分布、对话类型分布）
- 数据结构说明
- 使用方法
## 验收标准
- 10 条种子中至少 8 条成功完成
- 每条 DatasetEntry 的 conversation 中代码完整可读
- 设计系统 token 在代码中被正确引用（抽查 2 条验证）
- thinking 块读起来自然专业（抽查 2 条验证）
- dataset/ui-synth-v1.jsonl 存在且格式正确
- dataset/README.md 包含基础统计
- 控制台输出完整的运行统计
```
---
## 附：数据流速查图
每个 Prompt 完成后，系统中的数据流状态：
```
Prompt 1 完成后:
[Types ✅] [LLM Provider ✅] [Agent Base ✅] [Runner Skeleton ✅]
Prompt 2 完成后:
Seeds ──→ [Researcher ✅] ──→ Persona+Query
──→ [PM Agent ✅] ──→ PRD
──→ [Designer TODO] ──→ ...
Prompt 3 完成后:
Seeds ──→ [Researcher ✅] ──→ Persona+Query
──→ [PM Agent ✅] ──→ PRD
──→ [Designer ✅] ──→ DesignSpec
──→ [Developer ✅] ──→ Code Files
──→ [Weaver TODO] ──→ ...
Prompt 4 完成后:
Seeds ──→ [Researcher ✅] ──→ [PM ✅] ──→ [Designer ✅]
──→ [Developer ✅] ──→ [Weaver ✅] ──→ DatasetEntry
Prompt 5 完成后:
10 Seeds ══→ Full Pipeline ══→ ui-synth-v1.jsonl (8-10 entries)
```
## 过程交付物清单
| Prompt | 交付物 | 文件位置 |
|--------|--------|---------|
| P1 | 类型系统 | `src/types/index.ts` |
| P1 | LLM Provider | `src/llm/provider.ts` |
| P1 | Agent 基类 | `src/agents/base.ts` |
| P1 | Pipeline Runner 骨架 | `src/pipeline/runner.ts` |
| P2 | 设计趋势知识库 | `src/knowledge/design-trends.ts` |
| P2 | UI 模式知识库 | `src/knowledge/ui-patterns.ts` |
| P2 | 10 条初始种子 | `seeds/initial.json` |
| P2 | 用户研究 Agent (4 skills) | `src/agents/researcher/` |
| P2 | 产品经理 Agent (3 skills) | `src/agents/pm/` |
| P3 | 设计师 Agent (4 skills) | `src/agents/designer/` |
| P3 | 前端开发 Agent (4 skills) | `src/agents/developer/` |
| P4 | 数据编织 Agent (3 skills) | `src/agents/weaver/` |
| P4 | 完整 Pipeline Runner | `src/pipeline/runner.ts` |
| P4 | 入口 + 批量运行 | `src/index.ts` |
| P5 | 运行统计模块 | `src/pipeline/stats.ts` |
| P5 | v1 数据集 | `dataset/ui-synth-v1.jsonl` |
| P5 | 数据集说明 | `dataset/README.md` |