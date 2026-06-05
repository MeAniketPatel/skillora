type LogLevel = "debug" | "info" | "warn" | "error";

interface LogMeta {
  feature?: string;
  action?: string;
  userId?: string;
  traceId?: string;
  [key: string]: unknown;
}

const isProduction = process.env.NODE_ENV === "production";

function format(level: LogLevel, message: string, meta?: LogMeta): string {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` ${JSON.stringify(safeMeta(meta))}` : "";
  return `[${timestamp}] [${level.toUpperCase()}]${metaStr} ${message}`;
}

function safeMeta(meta: LogMeta): LogMeta {
  const clone: LogMeta = { ...meta };
  for (const k of Object.keys(clone)) {
    if (k.toLowerCase().includes("password") || k.toLowerCase().includes("token") || k.toLowerCase().includes("secret")) {
      clone[k] = "[REDACTED]";
    }
  }
  return clone;
}

export const logger = {
  debug(message: string, meta?: LogMeta) {
    if (!isProduction) console.debug(format("debug", message, meta));
  },
  info(message: string, meta?: LogMeta) {
    console.info(format("info", message, meta));
  },
  warn(message: string, meta?: LogMeta) {
    console.warn(format("warn", message, meta));
  },
  error(message: string, meta?: LogMeta) {
    console.error(format("error", message, meta));
  },
};

export type { LogLevel, LogMeta };
