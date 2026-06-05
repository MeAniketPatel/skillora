# ADR 002: Service Layer with CQRS

## Status
Accepted

## Context
Server actions in the original codebase contained business logic mixed with Prisma calls, validation, authorization, and revalidation. This made actions hard to test and impossible to reuse across non-HTTP entry points (CLI, jobs, API routes).

## Decision
Introduce a **service layer** under `src/features/<feature>/services/`. Services:
- Receive an injected repository (default parameter DI: `createCourseService(repo = courseRepository)`).
- Own all `prisma.$transaction()` calls (services are the sole transaction owner).
- Contain pure business logic; no Next.js/HTTP coupling.
- Split into `commands/` and `queries/` when handling **>5 operations** or **>250 lines** (CQRS threshold).

Actions become thin orchestrators:
```ts
export async function createCourseAction(input: CreateCourseInput) {
  const session = await requireTeacher();
  return createCourseService(courseRepository)(input);
}
```

## Consequences
- **Positive:** Services are testable in isolation (mock repo).
- **Positive:** Services can be called from actions, jobs, API routes, and tests.
- **Positive:** Transaction policy enforced at the service layer.
- **Negative:** Two layers to navigate; CQRS split can feel premature.

## Implementation Status
Phase 6 established the pattern (see `src/features/courses/services/` for a reference). Full service extraction across all 46 actions is incremental; existing actions call repositories directly via the `@/data` back-compat shim.
