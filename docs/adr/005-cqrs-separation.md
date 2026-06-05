# ADR 005: CQRS Separation

## Status
Accepted

## Context
Services that mix reads and writes become hard to reason about. As a service grows past a threshold, the responsibility split between command and query becomes blurred.

## Decision
Adopt a **CQRS threshold rule**:
- Services split into `commands/` and `queries/` folders when they handle **>5 distinct operations** OR exceed **~250 lines**, whichever comes first.
- Commands emit domain events for read-model invalidation.
- Queries are read-only and never call mutation methods on repositories.

```ts
src/features/courses/services/
├── commands/
│   ├── create-course.ts
│   ├── update-course.ts
│   └── publish-course.ts
└── queries/
    ├── get-course.ts
    └── list-courses.ts
```

## Consequences
- **Positive:** Clear responsibility split.
- **Positive:** Read and write paths can be optimized independently.
- **Negative:** Premature splitting can over-fragment a service; we err on the side of consolidated services until the threshold is reached.
