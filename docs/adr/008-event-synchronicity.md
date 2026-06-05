# ADR 008: Event Bus Synchronicity

## Status
Accepted

## Context
A domain event can have many listeners. If any single listener is slow, the entire request path is slowed. The question is: when do we move from in-process synchronous to a background queue (BullMQ, pg-boss)?

## Decision
Phase 1 uses **synchronous, in-process events** with two automatic migration triggers:

1. **Latency trigger:** any listener taking **>500ms** to execute.
2. **Fan-out trigger:** any event with **>5 registered listeners**.

When either trigger fires, the event bus emits a structured warning. The team can then migrate that specific event to an async queue while leaving other events synchronous.

## Implementation
The auto-warning is built into `src/shared/events/event-bus.ts`:
```ts
if (duration > 500) {
  console.warn(`[event-bus] listener for ${eventName} from ${feature} took ${duration}ms (>500ms); consider migrating to async queue`);
}
if (arr.length > 5) {
  console.warn(`[event-bus] event ${eventName} has ${arr.length} listeners (>5); consider migrating to async queue`);
}
```

## Consequences
- **Positive:** No infrastructure cost for the common case.
- **Positive:** Clear migration path to async when needed.
- **Negative:** A bad listener can degrade request latency (mitigated by the 500ms warning).
