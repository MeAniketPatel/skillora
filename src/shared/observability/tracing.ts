import { randomUUID } from "crypto";
import { logger } from "./logger";

interface Span {
  traceId: string;
  spanId: string;
  name: string;
  startMs: number;
  endMs?: number;
  meta?: Record<string, unknown>;
}

const activeSpans: Map<string, Span> = new Map();

export const tracing = {
  start(name: string, meta?: Record<string, unknown>): string {
    const traceId = randomUUID();
    const span: Span = {
      traceId,
      spanId: randomUUID(),
      name,
      startMs: Date.now(),
      meta,
    };
    activeSpans.set(traceId, span);
    logger.debug(`trace.start ${name}`, { traceId, ...meta });
    return traceId;
  },
  end(traceId: string, meta?: Record<string, unknown>) {
    const span = activeSpans.get(traceId);
    if (!span) return;
    span.endMs = Date.now();
    const duration = span.endMs - span.startMs;
    activeSpans.delete(traceId);
    logger.debug(`trace.end ${span.name} (${duration}ms)`, { traceId, duration, ...meta });
    if (duration > 500) {
      logger.warn(`trace.slow ${span.name} (${duration}ms) — async migration candidate`, { traceId, duration });
    }
  },
  async withSpan<T>(name: string, fn: () => Promise<T>, meta?: Record<string, unknown>): Promise<T> {
    const id = tracing.start(name, meta);
    try {
      return await fn();
    } finally {
      tracing.end(id);
    }
  },
};
