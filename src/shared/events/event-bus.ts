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
    const eventName = (event as { name?: string; type?: string }).name ?? event.type;
    if (!eventName) {
      console.warn("[event-bus] emit called without name/type field", event);
      return;
    }
    const arr = listeners.get(eventName) ?? [];
    if (arr.length === 0) return;
    const results = await Promise.allSettled(
      arr.map(async (entry) => {
        const start = Date.now();
        await entry.listener(event);
        const duration = Date.now() - start;
        if (duration > 500) {
          console.warn(
            `[event-bus] listener for ${eventName} from ${entry.feature} took ${duration}ms (>500ms); consider migrating to async queue`,
          );
        }
      }),
    );
    results.forEach((result, idx) => {
      if (result.status === "rejected") {
        const entry = arr[idx];
        console.error(
          `[event-bus] listener for ${eventName} from ${entry.feature} threw`,
          result.reason,
        );
      }
    });
  },
  off(eventName: string, listener: Listener) {
    const arr = listeners.get(eventName);
    if (!arr) return;
    const filtered = arr.filter((entry) => entry.listener !== listener);
    if (filtered.length === 0) {
      listeners.delete(eventName);
    } else {
      listeners.set(eventName, filtered);
    }
  },
  listenerCount(eventName: string): number {
    return (listeners.get(eventName) ?? []).length;
  },
  clear() {
    listeners.clear();
  },
};
