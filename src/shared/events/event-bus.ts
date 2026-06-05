import type { DomainEvent } from "./types";

type Listener<T extends DomainEvent = DomainEvent> = (event: T) => void | Promise<void>;

interface ListenerEntry {
  feature: string;
  eventName: string;
  listener: Listener;
  registeredAt: number;
}

const listeners: Map<string, ListenerEntry[]> = new Map();
const ASYNC_MIGRATION_LISTENER_THRESHOLD = 5;

export const eventBus = {
  on<T extends DomainEvent>(eventName: string, feature: string, listener: Listener<T>) {
    const arr = listeners.get(eventName) ?? [];
    arr.push({ feature, eventName, listener: listener as Listener, registeredAt: Date.now() });
    listeners.set(eventName, arr);
    if (arr.length > ASYNC_MIGRATION_LISTENER_THRESHOLD) {
      console.warn(
        `[event-bus] event ${eventName} has ${arr.length} listeners (>${ASYNC_MIGRATION_LISTENER_THRESHOLD}); consider migrating to async queue`,
      );
    }
  },
  async emit<T extends DomainEvent>(event: T): Promise<void> {
    const eventName = event.type;
    const arr = listeners.get(eventName) ?? [];
    for (const entry of arr) {
      const start = Date.now();
      try {
        await entry.listener(event);
        const duration = Date.now() - start;
        if (duration > 500) {
          console.warn(
            `[event-bus] listener for ${eventName} from ${entry.feature} took ${duration}ms (>500ms); consider migrating to async queue`,
          );
        }
      } catch (err) {
        console.error(`[event-bus] listener for ${eventName} from ${entry.feature} threw`, err);
      }
    }
  },
  listenerCount(eventName: string): number {
    return (listeners.get(eventName) ?? []).length;
  },
  clear() {
    listeners.clear();
  },
};
