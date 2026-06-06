// Server-only barrel. Import this from server actions, route handlers,
// server components, and middleware. NEVER import from "use client" files.
// Client components (forms, buttons) must be imported from "@/features/auth".

// Repository functions
export {
  getUserById,
  getUserByEmail,
  createUser,
  getUserProfile,
  getAllUsers,
  getUserCount,
  getUserCountByRole,
  updateUser,
  banUser,
  unbanUser,
  getUserGrowthTimeline,
  getAllInstructors,
  getInstructorProfile,
  AuthAuditAction,
  AuthSessionRevocationReason,
} from "./repositories/user.repository";

// Actions
export {
  loginUser,
  registerUser,
  logoutCurrentSession,
  logoutAllSessions,
  logoutSession,
  requestPasswordReset,
  resetPassword,
  updateUserSettings,
  getSessionSecurityOverview,
} from "./actions/auth.actions";

// Service
import { authService as service } from "./services/auth.service";
export { service };

// Permissions (server-safe pure functions)
export * from "./permissions/auth.permissions";

// Contracts (schemas + types — safe in both contexts)
export {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateSettingsSchema,
  revokeSessionSchema,
} from "./contracts/auth.contract";
export type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  UpdateSettingsInput,
  RevokeSessionInput,
} from "./contracts/auth.contract";
