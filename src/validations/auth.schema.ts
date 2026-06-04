import { z } from "zod";
import { APP } from "@/constants/app";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(APP.PASSWORD_MIN_LENGTH, `Password must be at least ${APP.PASSWORD_MIN_LENGTH} characters`),
  confirmPassword: z.string(),
  role: z.enum(["STUDENT", "TEACHER"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(APP.PASSWORD_MIN_LENGTH),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(32, "Invalid reset token"),
  password: z.string().min(APP.PASSWORD_MIN_LENGTH),
});

export const updateSettingsSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(APP.PASSWORD_MIN_LENGTH).optional().or(z.literal("")),
  bio: z.string().max(500).optional(),
  headline: z.string().max(100).optional(),
  image: z.string().url().optional().or(z.literal("")),
});

export const revokeSessionSchema = z.object({
  sessionId: z.string().min(1, "Session id is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
export type RevokeSessionInput = z.infer<typeof revokeSessionSchema>;
