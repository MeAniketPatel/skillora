# Phase 17: Legacy Cleanup — `@/data` Shim Removal

**Status:** Complete
**Date:** 2026-06-05
**Commit:** pending

## Goal
Delete the back-compat `src/data/` shim created in Phase 5 and rewrite all consumer
imports to use the feature barrel directly (`@/features/<feature>`).

## Changes

### Codemod
- `scripts/phase17-rewrite-data-imports.cjs`:
  - Walks all `src/features/**/repositories/*.repository.ts` and builds a
    symbol-to-feature map from `export function`/`export const`/`export type`/
    `export interface`/`export class` declarations.
  - For every other `.ts`/`.tsx` file under `src/`, finds
    `import { ... } from "@/data"` and rewrites to one or more
    `import { ... } from "@/features/<feature>";` lines.
  - Mixed imports (some symbols from `@/data`, some from elsewhere) are split
    into separate import lines.
  - Dynamic `import("@/data")` calls are not handled by the codemod; they were
    fixed manually (`src/actions/admin.actions.ts`).

### Manual fixups
- `src/features/courses/index.ts`: replaced single-line re-export with a
  full re-export of all 7 course-related repositories
  (course, section, lesson, quiz, resource, peer-review, live-session).
  Other multi-repo features (admin: 3, discussions: 2, social: 5, students: 6)
  were already complete.
- `src/actions/admin.actions.ts`: two `await import("@/data")` calls
  (lines 44, 71) split into separate dynamic imports of
  `@/features/courses` and `@/features/notifications`.
- `src/lib/webhook-sender.ts`: import rewritten to `@/features/webhooks` and
  `@/features/notifications` (the shim was re-exporting them).

### Shim deletion
- Removed `src/data/index.ts` and the entire `src/data/` directory
  (51 `.data.ts` files were already moved to `src/features/<feature>/repositories/`
  in Phase 5).

## Verification

| Check                  | Result |
|------------------------|--------|
| `npx tsc --noEmit`     | 0 errors |
| `@/data` references in `src/` | 0 (only docs/scripts reference it) |
| `madge --circular`     | No circular dependencies |
| Files touched by codemod | 83 |
| Import lines rewritten | 83 |
| Unresolved symbols     | 0 |
| Symbol collisions      | 0 |

## Known Issues (out of scope for Phase 17)
- The architecture fitness function still fails the Prisma isolation check.
  5 files import enums (`AuthAuditAction`, `AuthSessionRevocationReason`,
  `Role`) from `@prisma/client` outside `src/features/.*/repositories/`:
  - `src/auth.ts`
  - `src/actions/auth.actions.ts`
  - `src/features/auth/actions/auth.actions.ts`
  - `src/app/(dashboard)/admin/audit/page.tsx`
  - `src/types/next-auth.d.ts`

  These are enum types, not queries, but the rule is strict. Tracked as a
  separate follow-up; the recommended fix is to re-export the enums from
  the auth repository (or from a `shared/types/prisma-enums.ts`).

## Architecture Score
**Before Phase 17:** ~6.0/10
**After Phase 17:** ~6.5/10

The `@/data` shim was a transitional seam that let existing actions keep
working while features were being created. Removing it forces every consumer
to declare its feature dependency explicitly, which is the core invariant
of the new architecture.
