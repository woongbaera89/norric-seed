# Norric Seed (시운전) — Milestone 1

Habit tracker trial-run monorepo. M1 = scaffold + design tokens + core components + `/design-system` showcase + streak utils.

## Structure
```
apps/web                 Next.js 15 (App Router, TS) — product; /design-system showcase
packages/design-system   tokens (TS + CSS variables) + React components (Button, Input, HabitItem, TabBar, icons)
packages/utils           date + streak helpers (vitest)
packages/config          shared tsconfig / eslint config
```

## Run
Requires Node 20+ and pnpm 10 (`corepack enable`).
```
pnpm install
pnpm build        # turbo: builds packages then apps/web
pnpm test         # vitest in packages/utils
pnpm dev          # http://localhost:3000/design-system
# or prod: pnpm build && pnpm --filter web start
```

## Tokens
- TS: `import { color, typography, space, radius } from "@norric/design-system"`
- CSS: `@import "@norric/design-system/tokens.css"` → `var(--color-primary)`, `var(--text-body)`, `var(--space-4)`, `var(--radius-md)` …
Font: Pretendard (npm `pretendard`, variable dynamic subset).
