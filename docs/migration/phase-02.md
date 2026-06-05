# Phase 2 — Shared Library, Observability, Events, Cache, Jobs

**Status:** ✅ Complete (`89109e1`)

## Objective
Move singletons (Prisma, Stripe, Resend, UploadThing), global hooks, shared UI, global UI stores, and providers into `shared/`. Bootstrap observability, domain event bus, caching layer, and background jobs infrastructure.

## Files Affected
- Move `src/lib/*` → `src/shared/lib/*` (prisma, stripe, uploadthing, mail, action-utils, auth-helpers, auth-security, utils, errors)
- Move `src/hooks/*` → `src/shared/hooks/*` (6 hooks)
- Move `src/components/ui/*` → `src/shared/components/ui/*` (~30 shadcn primitives)
- Move `src/components/shared/*` → `src/shared/components/shared/*` (~15 shared components)
- Move `src/components/layout/*` → `src/shared/components/layout/*` (navbar, footer, sidebar, breadcrumbs)
- Move `src/components/providers/*` → `src/shared/components/providers/*` (theme-provider, providers index)
- Move `src/stores/sidebar.store.ts` → `src/shared/stores/sidebar.store.ts`

## Files Created
- `src/shared/observability/logger.ts` — structured logger with secret redaction
- `src/shared/observability/metrics.ts` — in-process counter/gauge store
- `src/shared/observability/tracing.ts` — span-based tracing with auto-warn at >500ms
- `src/shared/observability/index.ts` — barrel
- `src/shared/events/event-bus.ts` — synchronous event bus with migration triggers
- `src/shared/events/types.ts` — DomainEvent + CoursePublished/PaymentSucceeded/CertificateIssued
- `src/shared/events/index.ts` — barrel
- `src/shared/cache/index.ts` — Next.js unstable_cache wrapper + CACHE_TAGS
- `src/shared/jobs/queues/email.queue.ts` — email queue
- `src/shared/jobs/workers/email.worker.ts` — email worker
- `src/shared/jobs/index.ts` — barrel

## Files Modified
- 800+ import sites rewritten to `@/shared/...`
- Includes both static `from "..."` and dynamic `import("...")` patterns

## Verification
- `npx tsc --noEmit` → 0 errors
- 366 files changed, 1108 insertions, 747 deletions
- 56 component files moved, 9 lib files moved, 6 hooks moved
