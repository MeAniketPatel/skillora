# ADR 003: Event-Driven Design (Synchronous In-Process)

## Status
Accepted

## Context
Cross-feature side effects (e.g. when a course is published, notify followers, log audit, update search index) were implemented as direct service-to-service calls, creating tight coupling and circular dependencies.

## Decision
Adopt **domain events** with a synchronous, in-process event bus for Phase 1:

```ts
// src/shared/events/event-bus.ts
eventBus.on("course.published", "notifications", async (event) => {
  await sendNotifications(event.payload);
});

eventBus.on("course.published", "admin", async (event) => {
  await logAudit(event);
});
```

**Constraints:**
- Events are fire-and-forget (`emit()` returns `void`; no return values).
- Listeners are decoupled side effects and cannot block the publisher.
- Cross-feature interaction preference: **Event → Contract → Direct service call.**

## Async Migration Triggers
Migrate a specific event workflow to an async queue (BullMQ / pg-boss) when:
- A listener takes **>500ms** to execute.
- An event has **>5 listeners** registered.

Both are auto-warned by the event bus in `src/shared/events/event-bus.ts`.

## Consequences
- **Positive:** Publishers don't know about subscribers; features stay isolated.
- **Positive:** Easy to add new side effects without modifying the publisher.
- **Negative:** Event flow is harder to trace (mitigated by the structured logger in `src/shared/observability/`).
- **Negative:** Listeners execute on the request thread (mitigated by the 500ms/5-listener migration triggers).
