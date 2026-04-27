# RDTTS 方法论抽象：面向论文的发散-约束对偶框架

> 本文档将 `slow-think-long-chain-v4-421` 技能从具体实现（11 维度 × Web 设计）抽象为通用方法论，核心框架是 **Divergence-Constraint Duality（发散-约束对偶）** 驱动的 **Reverse Design-Thinking Trajectory Synthesis（RDTTS）**。

---

## 图 1 · 顶层概念框架：发散-约束对偶下的设计思维轨迹反演

```mermaid
flowchart LR
    subgraph A["① 静态交付物<br/>(Static Artifact)"]
        Q["Query q<br/>(用户意图)"]
        Y["Artifact y*<br/>(最终解)"]
    end

    subgraph B["② 隐式思维空间<br/>(Latent Thinking Space)"]
        direction TB
        DIV["🔀 Divergence 算子<br/>──────────<br/>候选生成 / 对比 / 否定推理<br/>Exploration of Solution Space"]
        CON["🔒 Constraint 算子<br/>──────────<br/>验证 / 回溯 / 支架化<br/>Governance of Reasoning"]
        DIV <-.对偶.-> CON
    end

    subgraph C["③ 显式推理轨迹<br/>(Explicit Trajectory τ)"]
        T["τ = ⟨s₁, s₂, ..., sₙ⟩<br/>──────────<br/>含发散步、约束步、<br/>元认知步的时序序列"]
    end

    A -- "反演<br/>Reverse<br/>Inference" --> B
    B -- "序列化<br/>Serialize" --> C
    C -- "监督信号<br/>SFT Target" --> M[("LLM<br/>learns<br/>p(τ,y*|q)")]

    style A fill:#e8f4ff,stroke:#4a90e2
    style B fill:#fff4e6,stroke:#f5a623
    style C fill:#e8f8e8,stroke:#52c41a
    style DIV fill:#ffe6f0,stroke:#e91e63
    style CON fill:#e6f0ff,stroke:#3f51b5
```

**形式化表述（可直接放入论文）：**

> 给定静态三元组 $(q, y^*, \mathcal{D})$，其中 $q$ 为用户查询、$y^*$ 为专家设计交付物、$\mathcal{D}$ 为过程文档。RDTTS 的目标是合成一条显式推理轨迹 $\tau$，使得学习目标从 $p(y^* \mid q)$ 扩展为 $p(\tau, y^* \mid q)$，其中 $\tau$ 必须同时满足**发散覆盖性（divergent coverage）**与**约束一致性（constraint consistency）**。

---

## 图 2 · 四层约束架构：从自由生成到可训练轨迹的层级规约

```mermaid
flowchart TB
    RAW["自由生成空间<br/>Unconstrained Generation"] --> L1

    subgraph L1["L1 · 结构约束 Structural Constraint"]
        direction LR
        L1D["维度脚手架 Dimensional Scaffold<br/>D = {d₁, d₂, ..., d_K}<br/>序列化推进，覆盖性硬要求"]
    end

    subgraph L2["L2 · 语义约束 Semantic Constraint"]
        direction LR
        P1["Adaptive Granularity<br/>∝ importance(sᵢ)"]
        P2["Cognitive Scaffolding<br/>key-insight + bridging"]
        P3["Pervasive Verification<br/>micro-checks everywhere"]
    end

    subgraph L3["L3 · 元认知约束 Meta-cognitive Constraint"]
        direction LR
        MC1["Backtracking ℬ<br/>冲突检测→回溯修正<br/>(≥2, 带信号词)"]
        MC2["Verification 𝒱<br/>显式自查→就地修正<br/>(≥2, 带信号词)"]
        MC3["Negation 𝒩<br/>显式否定推理<br/>(≥1, 放弃备选)"]
    end

    subgraph L4["L4 · 输出约束 Output Constraint"]
        direction LR
        O1["Leakage-free<br/>无字段名/管线术语泄露"]
        O2["Language-aligned<br/>lang(τ) = lang(q)"]
        O3["Artifact-faithful<br/>τ 的决策 ↔ y* 的实现"]
    end

    L1 --> L2 --> L3 --> L4 --> OUT["✅ 可训练轨迹 τ*"]

    style L1 fill:#e1f5fe,stroke:#0288d1
    style L2 fill:#fff9c4,stroke:#fbc02d
    style L3 fill:#ffe0e0,stroke:#c62828
    style L4 fill:#e8f5e9,stroke:#388e3c
```

**论文语言版表述：**

| 约束层 | 形式化描述 | 方法论意义 |
|---|---|---|
| **L1 Structural** | $\tau$ 必须覆盖预设维度集 $D$，且遵循偏序 $\prec_D$ | 保证**思维广度**——不跳过关键决策面 |
| **L2 Semantic** | 每个推理步 $s_i$ 的长度、理由密度、自查密度满足函数约束 | 保证**思维质地**——不平铺、不跳理由、不无自查 |
| **L3 Meta-cognitive** | $\tau$ 中显式包含 $\mathcal{B}$、$\mathcal{V}$、$\mathcal{N}$ 三类带信号词的认知算子 | 保证**思维迭代性**——体现探索-评估-修正循环 |
| **L4 Output** | $\tau$ 对 $\mathcal{D}$ 不可逆（无溯源泄露）且对 $y^*$ 可兑现 | 保证**可训练性与泛化性** |

---

## 图 3 · 过程模型：每个决策维度上的微型 Double-Diamond

```mermaid
flowchart LR
    subgraph DIM["第 k 个决策维度 dₖ 的内部动力学"]
        direction LR
        IN["前置决策<br/>commitments<br/>from d₁..dₖ₋₁"] --> DIVERGE
        
        subgraph DIAMOND["Divergence ⬥ Convergence Micro-Cycle"]
            direction TB
            DIVERGE["🔀 Diverge<br/>生成候选 / 对比权衡<br/>(若风格模糊: 2-3 方向<br/>若风格明确: 深化分解)"]
            EVAL["⚖️ Evaluate<br/>否定推理 𝒩<br/>显式验证 𝒱"]
            DECIDE{"决策是否<br/>与前置一致?"}
            COMMIT["✅ Commit<br/>收敛为 dₖ 的决策"]
            BACK["🔄 Backtrack ℬ<br/>回改 dⱼ (j < k)"]
            
            DIVERGE --> EVAL --> DECIDE
            DECIDE -->|是| COMMIT
            DECIDE -->|否| BACK
            BACK -.重入.-> DIVERGE
        end
        
        COMMIT --> OUT["后置决策<br/>input to dₖ₊₁"]
    end

    style DIVERGE fill:#ffe6f0,stroke:#e91e63
    style EVAL fill:#fff3cd,stroke:#f5a623
    style COMMIT fill:#d4edda,stroke:#28a745
    style BACK fill:#f8d7da,stroke:#dc3545
    style DIAMOND fill:#fafafa,stroke:#9e9e9e,stroke-dasharray: 5 5
```

**核心论点（paper claim）：**

> 传统 CoT 数据假设推理是**单调前向（monotonic forward）**的；本方法显式引入**非单调性（non-monotonicity）**——即 $\mathcal{B}$ 算子允许 $\tau$ 回写已提交的决策 $d_j$，从而将设计思维的"探索-评估-修正-迭代"循环编码进训练信号。

---

## 图 4 · 方法论在连续谱上的定位（可作为 Related Work 对照图）

```mermaid
quadrantChart
    title 推理轨迹合成方法的二维定位
    x-axis "低结构 Low Structure" --> "高结构 High Structure"
    y-axis "单向推理 Monotonic" --> "非单向推理 Non-monotonic"
    quadrant-1 "结构化 + 含回溯<br/>(本工作 RDTTS)"
    quadrant-2 "自由式 + 含回溯<br/>(反思类 CoT)"
    quadrant-3 "自由式 + 单向<br/>(朴素 CoT 蒸馏)"
    quadrant-4 "结构化 + 单向<br/>(模板化 CoT)"
    "Vanilla CoT": [0.2, 0.2]
    "Self-Refine / Reflexion": [0.25, 0.75]
    "Tree/Graph-of-Thoughts": [0.55, 0.7]
    "Template CoT (fixed schema)": [0.75, 0.2]
    "RDTTS (ours)": [0.85, 0.85]
```

---

## 论文表述建议（可直接改写入 Methodology 章）

本方法可概括为一个**四元组 $\langle D, \Phi, \Omega, \Gamma \rangle$**：

- **$D$（Dimensional Schema）**：领域先验的决策维度集合，定义思维空间的**坐标轴**
- **$\Phi$（Semantic Principles）**：作用于推理文本的连续约束，定义思维的**质地函数**
- **$\Omega$（Meta-cognitive Operators）** = $\{\mathcal{B}, \mathcal{V}, \mathcal{N}\}$：定义思维的**动力学算子**
- **$\Gamma$（Output Gates）**：对最终轨迹的离散硬约束，定义样本的**可训练边界**

合成过程即为在 $(D \times \Phi)$ 的受约束轨迹空间中，以 $\Omega$ 为推进算子、以 $\Gamma$ 为终止判据，反演出一条从 $q$ 到 $y^*$ 的**既发散又自洽**的思维路径 $\tau^*$：

$$
\tau^* = \arg\max_{\tau} \; p(\tau, y^* \mid q) \quad \text{s.t.} \quad \tau \vDash D \wedge \Phi \wedge \Omega \wedge \Gamma
$$

---

## 三个关键学术贡献点（建议作为论文 Contribution 列表）

1. **显式建模非单调推理（Explicit Non-monotonic Reasoning）**——将 Backtracking 提升为一等公民的认知算子，而非隐式在错误样本中体现
2. **分层约束治理（Hierarchical Constraint Governance）**——L1–L4 的正交约束分解，使"推理质量"成为可审计、可量化的训练目标
3. **发散-约束对偶（Divergence-Constraint Duality）**——首次将设计思维的双钻石模型形式化为可用于 SFT 数据合成的算子对
