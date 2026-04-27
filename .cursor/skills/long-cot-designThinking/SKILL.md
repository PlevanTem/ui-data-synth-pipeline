---
name: design-thinking-cot
description: >
  Applies structured Design Thinking reasoning (Empathize → Define → Ideate →
  Prototype → Test) as a chain-of-thought process to solve ambiguous, human-
  centered problems. Use this skill whenever the user presents a product design
  challenge, UX problem, innovation brief, service design task, or any open-
  ended problem that benefits from empathy-first, iterative thinking. Trigger
  this skill even when users only mention "user needs", "pain points",
  "brainstorming", "solution design", or "how might we".
version: 1.0.0
tags: [chain-of-thought, design-thinking, reasoning, synthesis, ux, innovation]
---

# Design Thinking Chain-of-Thought Skill

## Context
You're given a web/mobile app design instruction as below: {query}. You must don't implement the final code. Just for design process. 针对用户的instruction，作为设计师助手视角进行心理独白，如同设计师在自言自语。

## Purpose

This skill teaches model to reason to generate better design using the **5-phase Design
Thinking framework** as an explicit chain-of-thought scaffold. Each phase maps
to a distinct cognitive mode, preventing premature convergence on solutions
before the problem is truly understood.

## Why Design Thinking as CoT?

Standard chain-of-thought reasoning is powerful but often jumps from problem →
solution too quickly. Design Thinking forces:
- **Divergent thinking** before convergent thinking
- **Human empathy** before technical feasibility
- **Multiple prototypes** before commitment
- **Evidence-based iteration** instead of assumption-driven decisions

This structure dramatically improves output quality for ambiguous, human-facing
problems.

## The 5-Phase CoT Structure

### Phase 1 — EMPATHIZE 🔍
**Cognitive mode:** Observation, suspension of judgment
- Who are the users/stakeholders?
- What are their explicit needs vs. latent needs?
- What emotional states, contexts, and constraints do they operate in?
- What would I observe if I watched them in their environment?

### Phase 2 — DEFINE 🎯
**Cognitive mode:** Synthesis, reframing
- What is the core problem? (not the surface symptom)
- Write a Point-of-View (POV) statement: "[User] needs [need] because [insight]"
- Write a "How Might We" (HMW) question that opens creative space
- What assumptions am I making? Which need challenging?

### Phase 3 — IDEATE 💡
**Cognitive mode:** Divergent, judgment-free generation
- Generate at least 5 distinct solution directions (breadth over depth)
- Include at least 1 "wild" / unconventional idea
- Consider: analogous domains, reversals, extreme user scenarios
- Do NOT evaluate yet — quantity first

### Phase 4 — PROTOTYPE 🛠️
**Cognitive mode:** Concretization, rapid materialization
- Select 2–3 most promising ideas based on: desirability / feasibility / viability
- Describe each as a tangible artifact: mockup, script, storyboard, workflow
- Identify the ONE riskiest assumption in each prototype
- Define the minimum fidelity needed to test that assumption

### Phase 5 — TEST & REFLECT 🔄
**Cognitive mode:** Critical evaluation, learning extraction
- How would real users interact with each prototype?
- What would success look like? What would failure look like?
- What did this reasoning process reveal about the original problem framing?
- What would the next iteration look like?

## Output Format

Always wrap reasoning in `<think>` tags followed by a clean summary.
- <think> [Full 5-phase reasoning process] </think>
- Summary: [Concise output derived from the thinking process]

输出 `chains.txt`：

```txt
<think>\n...\n</think>\n\n...\n
```

