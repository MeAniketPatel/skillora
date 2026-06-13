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
  getUserPasswordHash,
  getVerificationToken,
  markEmailVerified,
  deleteVerificationToken,
  updateUserRoleById,
} from "./repositories/user.repository";

import { authService as service } from "./services/auth.service";
export { service };

export * from "./permissions/auth.permissions";

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
