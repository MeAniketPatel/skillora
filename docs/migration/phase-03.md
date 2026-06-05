# Phase 3 — Core Domain Layer Setup

**Status:** ✅ Complete (`5701366`)

## Objective
Create `src/core/` for cross-feature foundational business entities (`User`, `Role`) and shared value objects (`Money`, `Slug`, `Email`). Define domain event type contracts.

## Files Created
- `src/core/entities/user.ts` — `UserCore`, `UserProfileCore`, `USER_SOCIAL_PLATFORMS`
- `src/core/entities/role.ts` — `Role` type, `ROLES`, `isRole`, `isTeacher`, `isAdmin`
- `src/core/entities/index.ts` — barrel
- `src/core/value-objects/money.ts` — `Money` class with USD factory
- `src/core/value-objects/slug.ts` — `Slug` class with parse + fromTrusted
- `src/core/value-objects/email.ts` — `Email` class with parse + fromTrusted + domain()
- `src/core/events/course-published.event.ts` — re-exports + `EventEnvelope<TType, TPayload>`
- `src/core/events/index.ts` — barrel

## Verification
- `npx tsc --noEmit` → 0 errors
- 8 files changed, 160 insertions
