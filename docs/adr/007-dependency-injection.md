# ADR 007: Dependency Injection (Simplified Default Parameter)

## Status
Accepted

## Context
A full DI container (InversifyJS, tsyringe, etc.) adds runtime cost and configuration overhead. For our scale, a simpler approach is sufficient.

## Decision
Use **default parameter injection** at service boundaries:

```ts
export function createCourseService(
  repo: ICourseRepository = courseRepository,
  eventBus: IEventBus = defaultEventBus,
) {
  return async (input: CreateCourseInput) => {
    // business logic
  };
}
```

**Test override:**
```ts
const mockRepo: ICourseRepository = { ... };
const service = createCourseService(mockRepo);
```

## Consequences
- **Positive:** Zero runtime cost (no container resolution).
- **Positive:** Trivial to override in tests.
- **Positive:** Type-safe via TypeScript.
- **Negative:** Manual wiring for complex graphs (rare in our codebase).
