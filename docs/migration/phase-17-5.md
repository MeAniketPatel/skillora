# Phase 17.5: Final Architecture Audit

**Status:** Complete
**Date:** 2026-06-05
**Commit:** pending

## Goal
Verify that the new feature-based architecture is fully enforced and run a
final fitness function audit. Eliminate cross-feature deep imports.

## Changes

### Deep-import cleanup
47 cross-feature deep imports (e.g.
`@/features/<f>/repositories/<r>.repository`) were rewritten to use the
feature barrel (`@/features/<f>`) directly.

- `scripts/phase17.5-rewrite-deep-imports.cjs`: scans all repository exports,
  builds a symbol-to-feature map, then rewrites every
  `import { ... } from "@/features/<f>/<sub>/<file>"` to a barrel import.
  Handles `import type { ... }` form and dynamic `import()` calls.
- `scripts/phase17.5-deep-import-check.cjs`: lightweight audit script that
  re-runs the check. Reports any deep import whose source feature differs
  from the target feature.

### Untouched (out of scope, documented as future work)
- `src/components/<domain>/*` (103 files across 22 directories): these are
  feature-grouped but still under the old `src/components/` root. They are
  scheduled to move to `src/features/<feature>/components/` in Phase 8. The
  current locations do not violate the boundary — components import only
  from their own feature's barrel and from `@/shared/`.

## Verification

| Check                                            | Result |
|--------------------------------------------------|--------|
| `npx tsc --noEmit`                               | 0 errors |
| `node scripts/phase17.5-deep-import-check.cjs`   | OK: no cross-feature deep imports |
| `npx madge --circular`                           | No circular dependencies |
| Files rewritten by codemod                       | 32 |
| Deep imports rewritten                           | 47 |
| Unresolved symbols                               | 0 |

## Architecture Score
**Before Phase 17.5:** ~6.5/10
**After Phase 17.5:** ~7.0/10

The boundary rule "imports between features must go through the public
barrel" is now machine-enforceable.

## Known Issues (still open)
- 5 files import enums from `@prisma/client` outside `src/features/.*/repositories/`:
  - `src/auth.ts`
  - `src/actions/auth.actions.ts`
  - `src/features/auth/actions/auth.actions.ts`
  - `src/app/(dashboard)/admin/audit/page.tsx`
  - `src/types/next-auth.d.ts`
  Tracked as Phase 8 follow-up; recommended fix is to re-export the enums
  from the auth repository.

- 103 component files in `src/components/<domain>/` should be moved to
  `src/features/<feature>/components/` (Phase 8 work).

- Phases 11–15 (App Router alignment, ESLint integration, event-driven
  wiring) are still in the queue.
