# Phases 7–15 — Permission, Hooks, Contracts, Barrels, App Alignment, Testing, Events, Security, Caching

**Status:** 🟡 Scaffolded; incremental migration recommended

## Implementation Notes
The full extraction across all 46 actions / 17 features is best done feature-by-feature rather than as a single sweeping refactor. The following infrastructure is in place to support incremental migration:

- **Phase 7 (Permissions):** Pattern documented in `docs/adr/004-boundary-enforcement.md`; reference implementation in `src/features/courses/permissions/course.guards.ts` (now removed; see `phase-05-6.md` for context). Re-introduce per feature as actions are migrated.
- **Phase 8 (Hooks):** No `react-query` in the current codebase; if introduced later, use `src/features/<feature>/hooks/`.
- **Phase 9 (Contracts):** Zod schemas live in `src/features/<feature>/contracts/`. Auth has the canonical example at `src/features/auth/contracts/auth.contract.ts`.
- **Phase 10 (Public API):** All 28 features have `index.ts` barrels (auto-generated in Phase 5; auth has the full content).
- **Phase 10.5 (Codemods):** Reference codemods are in `scripts/phase*-rewrite.cjs` for future use.
- **Phase 11 (App Router):** Most `app/` pages already use feature barrels from Phase 5. The remaining `@/data` imports are kept behind the back-compat shim until Phase 17.
- **Phase 12 (Testing):** `vitest.config.ts` and `vitest.setup.ts` are present. No tests written yet — recommend starting with `src/features/courses/services/__tests__/create-course.spec.ts` when services are extracted.
- **Phase 13 (Events):** `src/shared/events/event-bus.ts` and `src/core/events/` provide the runtime; the actual `eventBus.emit("course.published", ...)` wiring in services is the next concrete step.
- **Phase 14 (Security):** `src/shared/lib/action-utils.ts` already wraps `actionHandler` which catches exceptions. Rate limiting stubs can be added at the route level.
- **Phase 15 (Caching):** `src/shared/cache/index.ts` provides the `cache.cached()` wrapper. Use in DAL functions for expensive queries.

## Recommended Next Steps
1. Pick one feature (recommend `courses` — largest domain).
2. Create `src/features/courses/services/commands/create-course.ts` and `queries/list-courses.ts`.
3. Move the corresponding `src/actions/course.actions.ts` logic into the service.
4. Add `src/features/courses/permissions/` guards.
5. Add `src/features/courses/services/__tests__/create-course.spec.ts`.
6. Wire `eventBus.emit("course.published", ...)` in the publish service.
7. Repeat for the next feature.
