
export { default as ForgotPasswordForm } from "./components/forgot-password-form";
export { default as LoginForm } from "./components/login-form";
export { default as RegisterForm } from "./components/register-form";
export { default as ResetPasswordForm } from "./components/reset-password-form";
export { default as SignOutButton } from "./components/signout-button";

export { canAuth, assertAuthAccess, isTeacherOrAdmin } from "./permissions/auth.permissions";

export { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, updateSettingsSchema, revokeSessionSchema } from "./contracts/auth.contract";
export type { RegisterInput, LoginInput, ForgotPasswordInput, ResetPasswordInput, UpdateSettingsInput, RevokeSessionInput } from "./contracts/auth.contract";


export { registerUser, loginUser, logoutCurrentSession, logoutAllSessions, logoutSession, requestPasswordReset, resetPassword, updateUserSettings, getSessionSecurityOverview, verifyEmail, sendVerificationEmail, updateUserRole } from "./actions/auth.actions";
