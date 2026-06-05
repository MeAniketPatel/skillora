export { default as LoginForm } from "./components/login-form";
export { default as RegisterForm } from "./components/register-form";
export { default as ForgotPasswordForm } from "./components/forgot-password-form";
export { default as ResetPasswordForm } from "./components/reset-password-form";
export { default as SignOutButton } from "./components/signout-button";

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

export {
  userRepository,
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
} from "./repositories/user.repository";
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
