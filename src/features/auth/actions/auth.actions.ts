"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { headers } from "next/headers";
import { service as authService, AuthAuditAction, AuthSessionRevocationReason } from "@/features/auth/server";

import { ZodError } from "zod";

import { signIn, signOut, auth } from "@/auth";
import { sendPasswordResetEmail } from "@/shared/lib/mail";
import {
  PASSWORD_RESET_TOKEN_TTL_MINUTES,
  completePasswordReset,
  createPasswordReset,
  getAuthRequestMetadata,
  getUserAuthSessions,
  logAuthAudit,
  revokeAllAuthSessions,
  revokeAuthSession,
} from "@/shared/lib/auth-security";

import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";

import { ConflictError, ValidationError } from "@/shared/lib/errors";
import type { Role } from "@/core/entities/role";
import { APP } from "@/shared/constants/app";

import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  revokeSessionSchema,
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  RevokeSessionInput
} from "@/features/auth";



async function getActionRequestMetadata() {
  const requestHeaders = await headers();
  return getAuthRequestMetadata(requestHeaders);
}

export async function registerUser(values: RegisterInput) {
  return actionHandler(async () => {
    const requestMetadata = await getActionRequestMetadata();
    const validated = registerSchema.parse(values);

    const { name, password, role } = validated;
    const email = validated.email.toLowerCase();
    
    const existingUser = await authService.getUserByEmail(email);
    if (existingUser) {
      throw new ConflictError("Email already registered.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await authService.createUser({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await logAuthAudit({
      action: AuthAuditAction.REGISTER,
      userId: user.id,
      email,
      request: requestMetadata,
      metadata: { role },
    });

    try {
      const { sendWelcomeEmail } = await import("@/shared/lib/mail");
      await sendWelcomeEmail(email, name);
    } catch (err) {
      console.error("Failed to send welcome email:", err);
    }

    // Since actionHandler wraps, and signIn can throw redirects/errors, we don't catch it
    // Wait, signIn throws an error to redirect. We should return a success, or let it throw.
    // Actually next-auth's signIn in server actions throws to redirect.
    return { success: "Account created successfully!", email };
  });
}

// Since loginUser uses NextAuth signIn which throws on success (to redirect),
// wrapping it in actionHandler might swallow the redirect. 
// So we keep loginUser without actionHandler or handle the error specifically.
export async function loginUser(values: LoginInput) {
  try {
    const validated = loginSchema.parse(values);
    const { password } = validated;
    const email = validated.email.toLowerCase();

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: "Logged in successfully!" };
  } catch (error) {
    console.error("[LOGIN_ACTION_ERROR]", error);
    if (error instanceof AuthError) {
      console.error("[LOGIN_ACTION_AUTHERROR_TYPE]", error.type);
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password." };
        default:
          return { error: "Something went wrong with sign in." };
      }
    }
    // if it's a zod error
    if (error instanceof ZodError) {
      return { error: "Invalid login credentials." };
    }
    throw error;
  }
}

export async function updateUserSettings(values: {
  name?: string;
  email?: string;
  password?: string;
  oldPassword?: string;
  image?: string | null;
  headline?: string | null;
  bio?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  github?: string | null;
}) {
  return actionHandler(async () => {
    const requestMetadata = await getActionRequestMetadata();
    const user = await requireAuth();

    const { name, password, oldPassword, image, headline, bio, twitter, linkedin, github } = values;
    const email = values.email?.toLowerCase();
    const updateData: {
      name?: string;
      email?: string;
      password?: string;
      image?: string | null;
      headline?: string | null;
      bio?: string | null;
      socialLinks?: { twitter?: string | null; linkedin?: string | null; github?: string | null };
    } = {};

    if (name) updateData.name = name;
    if (image !== undefined) updateData.image = image;
    if (headline !== undefined) updateData.headline = headline;
    if (bio !== undefined) updateData.bio = bio;

    if (twitter !== undefined || linkedin !== undefined || github !== undefined) {
      updateData.socialLinks = {
        twitter: twitter || null,
        linkedin: linkedin || null,
        github: github || null,
      };
    }

    if (email && email !== user.email) {
      const existingUser = await authService.getUserByEmail(email);
      if (existingUser) {
        throw new ConflictError("Email already in use.");
      }
      updateData.email = email;
    }

    if (password) {
      const dbUser = await authService.getUserPasswordHash(user.id);

      if (dbUser?.password) {
        if (!oldPassword) {
          throw new ValidationError("Current password is required to set a new password.");
        }
        const isValid = await bcrypt.compare(oldPassword, dbUser.password);
        if (!isValid) {
          throw new ValidationError("Current password is incorrect.");
        }
      }

      if (password.length < APP.PASSWORD_MIN_LENGTH) {
        throw new ValidationError(`Password must be at least ${APP.PASSWORD_MIN_LENGTH} characters.`);
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(updateData).length > 0) {
      await authService.updateUser(user.id, updateData);
    }

    if (updateData.password) {
      await revokeAllAuthSessions({
        userId: user.id,
        reason: AuthSessionRevocationReason.PASSWORD_CHANGE,
        request: requestMetadata,
        exceptSessionId: user.sessionId,
      });
      await logAuthAudit({
        action: AuthAuditAction.PASSWORD_CHANGED,
        userId: user.id,
        email: updateData.email ?? user.email!,
        request: requestMetadata,
      });
    }

    if (
      updateData.name ||
      updateData.email ||
      updateData.image !== undefined ||
      updateData.headline !== undefined ||
      updateData.bio !== undefined ||
      updateData.socialLinks !== undefined
    ) {
      await logAuthAudit({
        action: AuthAuditAction.PROFILE_UPDATED,
        userId: user.id,
        email: updateData.email ?? user.email!,
        request: requestMetadata,
        metadata: {
          changedName: Boolean(updateData.name),
          changedEmail: Boolean(updateData.email),
          changedProfileDetails: Boolean(
            updateData.image !== undefined ||
              updateData.headline !== undefined ||
              updateData.bio !== undefined ||
              updateData.socialLinks !== undefined
          ),
        },
      });
    }

    return { success: "Settings updated successfully!" };
  });
}

export async function requestPasswordReset(values: ForgotPasswordInput) {
  return actionHandler(async () => {
    const requestMetadata = await getActionRequestMetadata();
    const validated = forgotPasswordSchema.parse(values);
    const email = validated.email.toLowerCase();

    const user = await authService.getUserByEmail(email);

    await logAuthAudit({
      action: AuthAuditAction.PASSWORD_RESET_REQUESTED,
      userId: user?.id,
      email,
      request: requestMetadata,
      metadata: { accountFound: Boolean(user) },
    });

    if (user) {
      const reset = await createPasswordReset({
        userId: user.id,
        request: requestMetadata,
      });

      const mailResult = await sendPasswordResetEmail(
        user.email,
        user.name || "there",
        reset.resetUrl,
        PASSWORD_RESET_TOKEN_TTL_MINUTES
      );

      if ("error" in mailResult) {
        console.error("[PASSWORD_RESET_EMAIL_ERROR]", mailResult.error);
      }
    }

    return { success: "If an account exists for that email, a password reset link has been sent." };
  });
}

export async function resetPassword(values: ResetPasswordInput) {
  return actionHandler(async () => {
    const requestMetadata = await getActionRequestMetadata();
    const validated = resetPasswordSchema.parse(values);

    const passwordHash = await bcrypt.hash(validated.password, 10);
    const result = await completePasswordReset({
      token: validated.token,
      passwordHash,
      request: requestMetadata,
    });

    if (result.error) {
      throw new Error(result.error);
    }

    return { success: "Password updated successfully. Please sign in with your new password." };
  });
}

export async function getSessionSecurityOverview() {
  return actionHandler(async () => {
    const user = await requireAuth();
    const sessions = await getUserAuthSessions(user.id);

    return sessions.map((authSession) => ({
      sessionId: authSession.sessionId,
      provider: authSession.provider,
      ipAddress: authSession.ipAddress,
      userAgent: authSession.userAgent,
      createdAt: authSession.createdAt.toISOString(),
      lastSeenAt: authSession.lastSeenAt.toISOString(),
      expiresAt: authSession.expiresAt.toISOString(),
      revokedAt: authSession.revokedAt?.toISOString() ?? null,
      revokeReason: authSession.revokeReason,
      isCurrent: authSession.sessionId === user.sessionId,
    }));
  });
}

export async function logoutSession(values: RevokeSessionInput) {
  return actionHandler(async () => {
    const requestMetadata = await getActionRequestMetadata();
    const validated = revokeSessionSchema.parse(values);
    const user = await requireAuth();

    if (validated.sessionId === user.sessionId) {
      throw new ValidationError("Use the main sign out button for your current session.");
    }

    await revokeAuthSession({
      sessionId: validated.sessionId,
      userId: user.id,
      reason: AuthSessionRevocationReason.SECURITY,
      request: requestMetadata,
    });

    await logAuthAudit({
      action: AuthAuditAction.SESSION_BLACKLISTED,
      userId: user.id,
      request: requestMetadata,
      metadata: { sessionId: validated.sessionId },
    });

    return { success: "Session signed out successfully." };
  });
}

// NextAuth signOut redirects, so do not wrap in actionHandler
export async function logoutCurrentSession() {
  const requestMetadata = await getActionRequestMetadata();
  const session = await auth();

  if (session?.user?.id) {
    await revokeAuthSession({
      sessionId: session.user.sessionId,
      userId: session.user.id,
      reason: AuthSessionRevocationReason.LOGOUT,
      request: requestMetadata,
    });
  }

  await signOut({ redirectTo: "/" });
}

export async function logoutAllSessions() {
  const requestMetadata = await getActionRequestMetadata();
  const session = await auth();

  if (session?.user?.id) {
    await revokeAllAuthSessions({
      userId: session.user.id,
      reason: AuthSessionRevocationReason.LOGOUT_ALL,
      request: requestMetadata,
    });
  }

  await signOut({ redirectTo: "/" });
}

export async function verifyEmail(token: string) {
  return actionHandler(async () => {
    const record = await authService.getVerificationToken(token);

    if (!record) {
      throw new ValidationError("Invalid or expired verification token.");
    }

    if (record.expires < new Date()) {
      throw new ValidationError("Verification token has expired.");
    }

    await authService.markEmailVerified(record.identifier);
    await authService.deleteVerificationToken(record.identifier, token);

    return { success: "Email verified successfully!" };
  });
}

export async function sendVerificationEmail(email: string) {
  return actionHandler(async () => {
    const user = await authService.getUserByEmail(email);
    if (!user) {
      throw new ValidationError("User not found.");
    }

    console.log(`[MAIL MOCK] Verification email sent to ${email}`);
    return { success: "Verification email sent." };
  });
}

export async function updateUserRole(values: { role: Role }) {
  return actionHandler(async () => {
    const user = await requireAuth();

    const validRoles: Role[] = ["STUDENT", "TEACHER"];
    if (!validRoles.includes(values.role)) {
      throw new ValidationError("Invalid role selected");
    }

    await authService.updateUserRoleById(user.id, values.role);

    return { role: values.role };
  });
}

