import { describe, it, expect, beforeEach, vi } from "vitest";
import { eventBus } from "./event-bus";
import type { DomainEvent } from "./types";

const makeEvent = (type: string, payload: Record<string, unknown> = {}): DomainEvent => ({
  type,
  occurredAt: new Date().toISOString(),
  payload,
});

describe("event-bus", () => {
  beforeEach(() => {
    eventBus.clear();
  });

  describe("on / emit", () => {
    it("delivers event to subscriber by type", async () => {
      const received: DomainEvent[] = [];
      eventBus.on("test.event", "test", (e) => received.push(e));
      const ev = makeEvent("test.event");
      await eventBus.emit(ev);
      expect(received).toHaveLength(1);
      expect(received[0]).toBe(ev);
    });

    it("delivers event to subscriber by name (defensive)", async () => {
      const received: DomainEvent[] = [];
      eventBus.on("user.created", "test", (e) => received.push(e));
      // Publish using only `name` (no `type`).
      await eventBus.emit({
        name: "user.created",
        occurredAt: new Date().toISOString(),
        payload: {},
      } as unknown as DomainEvent);
      expect(received).toHaveLength(1);
    });

    it("delivers to multiple subscribers", async () => {
      const a: DomainEvent[] = [];
      const b: DomainEvent[] = [];
      eventBus.on("x", "feature-a", (e) => a.push(e));
      eventBus.on("x", "feature-b", (e) => b.push(e));
      await eventBus.emit(makeEvent("x"));
      expect(a).toHaveLength(1);
      expect(b).toHaveLength(1);
    });

    it("does not deliver to subscribers of other types", async () => {
      const a: DomainEvent[] = [];
      eventBus.on("a", "test", () => a.push(makeEvent("a")));
      await eventBus.emit(makeEvent("b"));
      expect(a).toHaveLength(0);
    });

    it("warns and returns when emit has no resolvable name/type", async () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      await eventBus.emit({ payload: {}, occurredAt: "" } as DomainEvent);
      expect(warn).toHaveBeenCalled();
      warn.mockRestore();
    });
  });

  describe("off", () => {
    it("removes a subscriber", async () => {
      const calls: DomainEvent[] = [];
      const cb = (e: DomainEvent) => calls.push(e);
      eventBus.on("x", "test", cb);
      eventBus.off("x", cb);
      await eventBus.emit(makeEvent("x"));
      expect(calls).toHaveLength(0);
    });

    it("is a no-op when removing a subscriber that was never added", () => {
      expect(() => eventBus.off("x", () => {})).not.toThrow();
    });
  });

  describe("listener fan-out", () => {
    it("runs all listeners and they all receive the event", async () => {
      const order: number[] = [];
      eventBus.on("x", "a", async () => {
        await new Promise((r) => setTimeout(r, 30));
        order.push(1);
      });
      eventBus.on("x", "b", async () => {
        await new Promise((r) => setTimeout(r, 5));
        order.push(2);
      });
      eventBus.on("x", "c", () => {
        order.push(3);
      });
      await eventBus.emit(makeEvent("x"));
      expect(order.sort()).toEqual([1, 2, 3]);
    });

    it("does not fail the bus when a listener throws", async () => {
      const a: DomainEvent[] = [];
      const b: DomainEvent[] = [];
      eventBus.on("x", "throws", () => {
        throw new Error("boom");
      });
      eventBus.on("x", "ok-a", (e) => a.push(e));
      eventBus.on("x", "ok-b", (e) => b.push(e));
      const err = vi.spyOn(console, "error").mockImplementation(() => {});
      await expect(eventBus.emit(makeEvent("x"))).resolves.not.toThrow();
      expect(a).toHaveLength(1);
      expect(b).toHaveLength(1);
      expect(err).toHaveBeenCalled();
      err.mockRestore();
    });
  });

  describe("listenerCount", () => {
    it("counts listeners per event", () => {
      eventBus.on("x", "a", () => {});
      eventBus.on("x", "b", () => {});
      expect(eventBus.listenerCount("x")).toBe(2);
      expect(eventBus.listenerCount("y")).toBe(0);
    });
  });
});
