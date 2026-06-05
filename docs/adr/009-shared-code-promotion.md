# ADR 009: Shared Code Promotion Policy

## Status
Accepted

## Context
A `src/shared/` directory is a natural dumping ground. Without promotion criteria, anything that "might be reused" lands in `shared/`, polluting the foundational layer.

## Decision
Code moves to `src/shared/` **only if**:
1. The asset is explicitly used by **3 or more distinct features**, OR
2. The asset is verified as core system infrastructure (e.g. Prisma singleton, core CSS files, shadcn UI primitives, global providers).

Otherwise, the code remains local to the feature folder.

**Examples that should NOT be in `shared/`:**
- A component used by 2 features → keep local, possibly duplicate.
- A hook used by 1 feature → keep local.
- A util used by 1 feature → keep local.

**Examples that SHOULD be in `shared/`:**
- `Button`, `Card`, `Input` (shadcn primitives) — used by 15+ features.
- `prisma.ts` — the database singleton.
- `logger.ts` — used by every service.

## Promotion Process
1. The asset is local to a feature.
2. A second feature needs it → copy locally; do NOT promote yet.
3. A third feature needs it → promote to `shared/`, refactor all three call sites.

## Consequences
- **Positive:** `shared/` stays small and intentional.
- **Positive:** Avoids premature abstraction.
- **Negative:** Some duplication until the third use case arrives.
