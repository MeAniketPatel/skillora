# ADR 001: Feature-Based Architecture

## Status
Accepted (v8.0 — Final Approved Blueprint)

## Context
The original Skillora codebase organized code by technical type (`actions/`, `data/`, `components/`, `hooks/`). This created cross-cutting concerns where domain logic for a single feature (e.g. courses) was scattered across many folders, making the codebase hard to navigate, test, and refactor.

## Decision
We adopt a **feature-based architecture** where all code related to a single business domain lives under `src/features/<feature>/`:

```
src/features/<feature>/
├── actions/      # Server actions
├── components/   # Feature UI
├── contracts/    # Zod input/output schemas
├── hooks/        # React Query + local hooks
├── repositories/ # Data access (interface + Prisma implementation)
├── services/     # Business logic (commands/ & queries/ when split)
├── permissions/  # RBAC + ownership guards
├── stores/       # Feature-owned Zustand stores
├── constants/    # Feature-local constants
├── types/        # Feature-specific types
├── utils/        # Feature helpers
└── index.ts      # Public API barrel
```

Cross-feature imports **must** go through the feature's `index.ts` barrel. Deep imports are forbidden via ESLint rules.

## Consequences
- **Positive:** Each feature is self-contained, easy to extract to a micro-service, and easy to test in isolation.
- **Positive:** Tier-based dependency rules (Tier 1: shared/core/auth → Tier 2: domain features → Tier 3: admin) prevent circular dependencies.
- **Negative:** Some boilerplate (one barrel per feature).
- **Negative:** Initial refactor cost (20 phases of migration).

## Alternatives Considered
- **Module-per-package monorepo:** Rejected — too heavy for current scale.
- **Vertical slices within `app/`:** Rejected — `app/` is reserved for routing; domain code belongs in `features/`.
