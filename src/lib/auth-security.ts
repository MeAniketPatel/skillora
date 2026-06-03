import { createHash, randomBytes, randomUUID } from "crypto";

import {
  AuthAuditAction,
  AuthSessionRevocationReason,
  Prisma,
} from "@prisma/client";

import db from "@/lib/prisma";

export type AuthRequestMetadata = {
  ipAddress?: string | null;
  userAgent?: string | null;
};

export const AUTH_SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;
export const PASSWORD_RESET_TOKEN_TTL_MINUTES = 30;

const LAST_SEEN_UPDATE_INTERVAL_MS = 5 * 60 * 1000;

function addSeconds(date: Date, seconds: number) {
  return new Date(date.getTime() + seconds * 1000);
}

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export function getAuthRequestMetadata(
  headers?: Pick<Headers, "get"> | null
): AuthRequestMetadata {
  if (!headers) return {};

  const forwardedFor = headers.get("x-forwarded-for");
  const ipAddress =
    forwardedFor?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    null;

  return {
    ipAddress,
    userAgent: headers.get("user-agent"),
  };
}

export function createPasswordResetTokenValue() {
  return randomBytes(32).toString("hex");
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function getAppUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.AUTH_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

export async function logAuthAudit(params: {
  action: AuthAuditAction;
  userId?: string | null;
  email?: string | null;
  metadata?: Prisma.InputJsonValue;
  request?: AuthRequestMetadata;
}) {
  try {
    await db.authAuditLog.create({
      data: {
        action: params.action,
        userId: params.userId ?? undefined,
        email: params.email?.toLowerCase() ?? undefined,
        ipAddress: params.request?.ipAddress ?? undefined,
        userAgent: params.request?.userAgent ?? undefined,
        metadata: params.metadata ?? undefined,
      },
    });
  } catch (error) {
    console.error("[AUTH_AUDIT_ERROR]", error);
  }
}

export async function createAuthSession(params: {
  userId: string;
  provider?: string | null;
  request?: AuthRequestMetadata;
  maxAgeSeconds?: number;
}) {
  const now = new Date();
  const sessionId = randomUUID();
  const expiresAt = addSeconds(
    now,
    params.maxAgeSeconds ?? AUTH_SESSION_MAX_AGE_SECONDS
  );

  await db.authSession.create({
    data: {
      sessionId,
      userId: params.userId,
      provider: params.provider ?? undefined,
      ipAddress: params.request?.ipAddress ?? undefined,
      userAgent: params.request?.userAgent ?? undefined,
      expiresAt,
      lastSeenAt: now,
    },
  });

  return { sessionId, expiresAt };
}

export async function ensureAuthSession(params: {
  sessionId?: string | null;
  userId: string;
  provider?: string | null;
  request?: AuthRequestMetadata;
}) {
  if (!params.sessionId) {
    return createAuthSession({
      userId: params.userId,
      provider: params.provider,
      request: params.request,
    });
  }

  const existing = await db.authSession.findUnique({
    where: { sessionId: params.sessionId },
    select: { sessionId: true, expiresAt: true },
  });

  if (existing) {
    return existing;
  }

  const now = new Date();
  const expiresAt = addSeconds(now, AUTH_SESSION_MAX_AGE_SECONDS);

  await db.authSession.create({
    data: {
      sessionId: params.sessionId,
      userId: params.userId,
      provider: params.provider ?? undefined,
      ipAddress: params.request?.ipAddress ?? undefined,
      userAgent: params.request?.userAgent ?? undefined,
      expiresAt,
      lastSeenAt: now,
    },
  });

  return { sessionId: params.sessionId, expiresAt };
}

export async function validateAuthSession(params: {
  sessionId?: string | null;
  userId?: string | null;
}) {
  if (!params.sessionId || !params.userId) return false;

  const now = new Date();
  const [session, blacklist] = await db.$transaction([
    db.authSession.findUnique({
      where: { sessionId: params.sessionId },
      select: {
        userId: true,
        expiresAt: true,
        revokedAt: true,
        lastSeenAt: true,
      },
    }),
    db.authTokenBlacklist.findUnique({
      where: { sessionId: params.sessionId },
      select: { expiresAt: true },
    }),
  ]);

  if (blacklist && blacklist.expiresAt > now) return false;
  if (!session) return false;
  if (session.userId !== params.userId) return false;
  if (session.revokedAt || session.expiresAt <= now) return false;

  if (now.getTime() - session.lastSeenAt.getTime() > LAST_SEEN_UPDATE_INTERVAL_MS) {
    await db.authSession
      .update({
        where: { sessionId: params.sessionId },
        data: { lastSeenAt: now },
      })
      .catch((error) => console.error("[AUTH_SESSION_TOUCH_ERROR]", error));
  }

  return true;
}

export async function blacklistAuthSession(params: {
  sessionId: string;
  userId: string;
  reason: AuthSessionRevocationReason;
  expiresAt: Date;
}) {
  await db.authTokenBlacklist.upsert({
    where: { sessionId: params.sessionId },
    update: {
      reason: params.reason,
      expiresAt: params.expiresAt,
    },
    create: {
      sessionId: params.sessionId,
      userId: params.userId,
      reason: params.reason,
      expiresAt: params.expiresAt,
    },
  });
}

export async function revokeAuthSession(params: {
  sessionId?: string | null;
  userId: string;
  reason: AuthSessionRevocationReason;
  request?: AuthRequestMetadata;
  audit?: boolean;
}) {
  if (!params.sessionId) return { revoked: false };

  const session = await db.authSession.findUnique({
    where: { sessionId: params.sessionId },
    select: {
      userId: true,
      expiresAt: true,
      revokedAt: true,
    },
  });

  if (!session || session.userId !== params.userId) {
    return { revoked: false };
  }

  const now = new Date();

  await db.authSession.update({
    where: { sessionId: params.sessionId },
    data: {
      revokedAt: session.revokedAt ?? now,
      revokeReason: params.reason,
    },
  });

  await blacklistAuthSession({
    sessionId: params.sessionId,
    userId: params.userId,
    reason: params.reason,
    expiresAt: session.expiresAt > now ? session.expiresAt : addSeconds(now, 60),
  });

  if (params.audit ?? true) {
    await logAuthAudit({
      action: AuthAuditAction.LOGOUT_SESSION,
      userId: params.userId,
      request: params.request,
      metadata: { reason: params.reason, sessionId: params.sessionId },
    });
  }

  return { revoked: true };
}

export async function revokeAllAuthSessions(params: {
  userId: string;
  reason: AuthSessionRevocationReason;
  request?: AuthRequestMetadata;
  exceptSessionId?: string | null;
}) {
  const now = new Date();
  const sessions = await db.authSession.findMany({
    where: {
      userId: params.userId,
      revokedAt: null,
      expiresAt: { gt: now },
      ...(params.exceptSessionId
        ? { sessionId: { not: params.exceptSessionId } }
        : {}),
    },
    select: {
      sessionId: true,
      expiresAt: true,
    },
  });

  if (sessions.length === 0) {
    await logAuthAudit({
      action:
        params.reason === AuthSessionRevocationReason.LOGOUT_ALL
          ? AuthAuditAction.LOGOUT_ALL_SESSIONS
          : AuthAuditAction.SESSION_REVOKED,
      userId: params.userId,
      request: params.request,
      metadata: { reason: params.reason, revokedCount: 0 },
    });
    return { revokedCount: 0 };
  }

  await db.$transaction([
    db.authSession.updateMany({
      where: {
        sessionId: { in: sessions.map((session) => session.sessionId) },
      },
      data: {
        revokedAt: now,
        revokeReason: params.reason,
      },
    }),
    ...sessions.map((session) =>
      db.authTokenBlacklist.upsert({
        where: { sessionId: session.sessionId },
        update: {
          reason: params.reason,
          expiresAt: session.expiresAt,
        },
        create: {
          sessionId: session.sessionId,
          userId: params.userId,
          reason: params.reason,
          expiresAt: session.expiresAt,
        },
      })
    ),
  ]);

  await logAuthAudit({
    action:
      params.reason === AuthSessionRevocationReason.LOGOUT_ALL
        ? AuthAuditAction.LOGOUT_ALL_SESSIONS
        : AuthAuditAction.SESSION_REVOKED,
    userId: params.userId,
    request: params.request,
    metadata: {
      reason: params.reason,
      revokedCount: sessions.length,
      exceptSessionId: params.exceptSessionId,
    },
  });

  return { revokedCount: sessions.length };
}

export async function getUserAuthSessions(userId: string) {
  const now = new Date();

  return db.authSession.findMany({
    where: {
      userId,
      revokedAt: null,
      expiresAt: { gt: now },
    },
    orderBy: { lastSeenAt: "desc" },
    select: {
      sessionId: true,
      provider: true,
      ipAddress: true,
      userAgent: true,
      createdAt: true,
      lastSeenAt: true,
      expiresAt: true,
      revokedAt: true,
      revokeReason: true,
    },
  });
}

export async function createPasswordReset(params: {
  userId: string;
  request?: AuthRequestMetadata;
}) {
  const rawToken = createPasswordResetTokenValue();
  const tokenHash = hashToken(rawToken);
  const now = new Date();
  const expiresAt = addMinutes(now, PASSWORD_RESET_TOKEN_TTL_MINUTES);

  await db.$transaction([
    db.passwordResetToken.updateMany({
      where: {
        userId: params.userId,
        usedAt: null,
        expiresAt: { gt: now },
      },
      data: { usedAt: now },
    }),
    db.passwordResetToken.create({
      data: {
        tokenHash,
        userId: params.userId,
        expiresAt,
        ipAddress: params.request?.ipAddress ?? undefined,
        userAgent: params.request?.userAgent ?? undefined,
      },
    }),
  ]);

  return {
    token: rawToken,
    expiresAt,
    resetUrl: `${getAppUrl()}/reset-password?token=${rawToken}`,
  };
}

export async function completePasswordReset(params: {
  token: string;
  passwordHash: string;
  request?: AuthRequestMetadata;
}) {
  const tokenHash = hashToken(params.token);
  const now = new Date();
  const resetToken = await db.passwordResetToken.findUnique({
    where: { tokenHash },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt <= now) {
    return { error: "This password reset link is invalid or has expired." };
  }

  await db.$transaction([
    db.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: now },
    }),
    db.user.update({
      where: { id: resetToken.userId },
      data: { password: params.passwordHash },
    }),
  ]);

  await revokeAllAuthSessions({
    userId: resetToken.userId,
    reason: AuthSessionRevocationReason.PASSWORD_RESET,
    request: params.request,
  });

  await logAuthAudit({
    action: AuthAuditAction.PASSWORD_RESET_COMPLETED,
    userId: resetToken.userId,
    email: resetToken.user.email,
    request: params.request,
  });

  return {
    success: true,
    user: resetToken.user,
  };
}

export async function cleanupExpiredAuthArtifacts() {
  const now = new Date();

  await db.$transaction([
    db.authTokenBlacklist.deleteMany({
      where: { expiresAt: { lt: now } },
    }),
    db.passwordResetToken.deleteMany({
      where: {
        expiresAt: { lt: now },
        usedAt: { not: null },
      },
    }),
  ]);
}
