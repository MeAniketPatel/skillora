# ADR 004: Boundary Enforcement

## Status
Accepted

## Context
Feature-based architecture only works if cross-feature imports are disciplined. Without enforcement, deep imports (`@/features/courses/repositories/course.repository` from outside the `courses` feature) quickly erode the public API.

## Decision
Enforce feature boundaries with **two layers**:

1. **Code review convention** — every cross-feature import must use the barrel: `import { x } from "@/features/<feature>"`.
2. **ESLint rules** — see `eslint-boundary-rules.cjs`:
   - Block deep imports from `@/features/*/repositories/*`, `@/features/*/actions/*`, `@/features/*/components/*`.
   - Block legacy `@/data/*` imports (Phase 17 cleanup target).
   - Block legacy `@/components/<domain>/*` paths.

3. **Architecture fitness function** — `scripts/check-architecture.sh`:
   - madge circular dep check
   - `@prisma/client` isolation check
   - Legacy `@/data` detection

## Consequences
- **Positive:** Public API stays small and intentional.
- **Positive:** Circular dependencies are caught at lint/CI time, not in production.
- **Negative:** Lint failures can feel pedantic during early migration.
