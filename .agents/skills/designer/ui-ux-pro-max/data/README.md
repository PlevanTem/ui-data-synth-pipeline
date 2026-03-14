# Data Layer Guide

`ui-ux-pro-max/data/` is the structured retrieval layer of the design knowledge system.

It should be read together with:

- `web-design-pipeline/references/uiux-asset-library/`

These two layers are complementary:

- `data/` gives stable, queryable, low-ambiguity recall
- `references/` gives synthesis, context, tradeoffs, and reusable higher-order rules

## Recommended sync flow

When assets in `web-design-pipeline/references/uiux-asset-library/` become stable:

1. regenerate `catalog.json`
2. generate `uiuxmax-sync-candidates.json`
3. review candidates manually
4. selectively port stable rows into `data/*.csv`

Do not directly auto-overwrite CSV files from asset Markdown without review.

## What belongs in `data/`

Good fits for CSV rows:

- product type mappings
- palette recommendations
- typography pairings
- chart/library recommendations
- UX best-practice rules
- stack-specific implementation notes
- reusable prompts/tags

## What belongs in `references/`

Better fits for Markdown assets:

- trend notes
- style recipes
- motion patterns
- generative combinations
- anti-patterns
- nuanced implementation boundaries
- narrative explanations of why a direction works

## Sync rule

When a new pattern emerges:

1. write the richer narrative version to `references/`
2. extract stable fields back into `data/` when the pattern proves reusable
3. avoid creating two different recommendation systems

## Current stack knowledge to keep aligned

When `data/stacks/*.csv` is updated, keep it aligned with the current interaction-oriented baseline:

- `Next.js 15`
- `React 19`
- `Tailwind CSS 4`
- `shadcn/ui`
- `Radix UI`
- `React Aria`
- `motion` (`motion/react`)
- `GSAP`
- `TanStack Query`
- `Zustand`
- `React Hook Form`
- `Zod`
- `Sonner`
- `Recharts`
- `D3`
- `Three.js` / `@react-three/fiber`
- `Spline`
- `pnpm`

This does not mean every project should use all of them. It means the structured retrieval layer should know they are current ecosystem primitives.
