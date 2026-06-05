// Auto-generated barrel: re-exports all repositories for the auth feature.
export * from "./repositories/user.repository";

// Components
export { default as ForgotPasswordForm } from "./components/forgot-password-form";
export { default as LoginForm } from "./components/login-form";
export { default as RegisterForm } from "./components/register-form";
export { default as ResetPasswordForm } from "./components/reset-password-form";
export { default as SignOutButton, default as SignoutButton } from "./components/signout-button";
// Contracts
export {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  revokeSessionSchema,
} from "./contracts/auth.contract";
export type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  RevokeSessionInput,
} from "./contracts/auth.contract";
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
// Repository types
export type {
  IUserRepository,
  UserSummary,
  UserWithPassword,
  CreateUserInput,
  UpdateUserInput,
  GetAllUsersParams,
  PaginatedUsers,
  UserProfile,
  InstructorListItem,
  GetAllInstructorsParams,
  PaginatedInstructors,
  InstructorProfile,
} from "./repositories/user.repository";

// Services
export { authService } from "./services/auth.service";
export type { AuthService } from "./services/auth.service";

// Permissions
export { canAuth as canAuth, assertAuthAccess } from "./permissions/auth.permissions";
