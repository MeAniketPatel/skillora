import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { z } from "zod";
import {
  AuthAuditAction,
  AuthSessionRevocationReason,
  Role,
} from "@prisma/client";

import db from "@/lib/prisma";
import { authConfig } from "./auth.config";
import {
  AUTH_SESSION_MAX_AGE_SECONDS,
  createAuthSession,
  ensureAuthSession,
  getAuthRequestMetadata,
  logAuthAudit,
  revokeAuthSession,
  validateAuthSession,
} from "@/lib/auth-security";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { auth, handlers, signIn, signOut } = NextAuth((request) => {
  const requestMetadata = getAuthRequestMetadata(request?.headers);

  return {
    ...authConfig,
    adapter: PrismaAdapter(db),
    session: {
      strategy: "jwt",
      maxAge: AUTH_SESSION_MAX_AGE_SECONDS,
    },
    providers: [
      Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
      }),
      Github({
        clientId: process.env.AUTH_GITHUB_ID,
        clientSecret: process.env.AUTH_GITHUB_SECRET,
      }),
      Credentials({
        async authorize(credentials) {
          const parsedCredentials = credentialsSchema.safeParse(credentials);

          if (!parsedCredentials.success) {
            await logAuthAudit({
              action: AuthAuditAction.LOGIN_FAILED,
              request: requestMetadata,
              metadata: { reason: "invalid_credentials_shape" },
            });
            return null;
          }

          const { password } = parsedCredentials.data;
          const email = parsedCredentials.data.email.toLowerCase();
          const user = await db.user.findUnique({ where: { email } });

          if (!user || !user.password) {
            await logAuthAudit({
              action: AuthAuditAction.LOGIN_FAILED,
              email,
              request: requestMetadata,
              metadata: { reason: "user_not_found_or_password_unset" },
            });
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) {
            await logAuthAudit({
              action: AuthAuditAction.LOGIN_FAILED,
              userId: user.id,
              email,
              request: requestMetadata,
              metadata: { reason: "password_mismatch" },
            });
            return null;
          }

          return user;
        },
      }),
    ],
    callbacks: {
      ...authConfig.callbacks,
      async jwt({ token, user, account }) {
        const userId = (user?.id || token.id) as string | undefined;

        if (!userId) return token;

        if (user) {
          const dbUser = await db.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, role: true },
          });
          const authSession = await createAuthSession({
            userId,
            provider: account?.provider ?? "credentials",
            request: requestMetadata,
          });

          token.id = userId;
          token.role = user.role ?? dbUser?.role ?? "STUDENT";
          token.sessionId = authSession.sessionId;
          token.authSessionExpires = authSession.expiresAt.toISOString();

          await logAuthAudit({
            action: AuthAuditAction.LOGIN_SUCCESS,
            userId,
            email: dbUser?.email ?? user.email ?? null,
            request: requestMetadata,
            metadata: {
              provider: account?.provider ?? "credentials",
              sessionId: authSession.sessionId,
            },
          });

          return token;
        }

        const authSession = await ensureAuthSession({
          sessionId: token.sessionId as string | undefined,
          userId,
          request: requestMetadata,
        });
        token.sessionId = authSession.sessionId;
        token.authSessionExpires = authSession.expiresAt.toISOString();

        const isValid = await validateAuthSession({
          sessionId: token.sessionId as string,
          userId,
        });

        if (!isValid) return null;

        return token;
      },
      async session({ session, token }) {
        if (token.id && session.user) {
          session.user.id = token.id as string;
          session.user.role = token.role as Role;
          session.user.sessionId = token.sessionId as string | undefined;
        }
        return session;
      },
    },
    events: {
      async signOut(message) {
        if ("token" in message && message.token?.id && message.token.sessionId) {
          await revokeAuthSession({
            sessionId: message.token.sessionId as string,
            userId: message.token.id as string,
            reason: AuthSessionRevocationReason.LOGOUT,
            request: requestMetadata,
          });
        }
      },
    },
  };
});
