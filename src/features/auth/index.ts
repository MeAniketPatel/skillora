// Auto-generated barrel: re-exports all repositories for the auth feature.

// Components
export { default as ForgotPasswordForm } from "./components/forgot-password-form";
export { default as LoginForm } from "./components/login-form";
export { default as RegisterForm } from "./components/register-form";
export { default as ResetPasswordForm } from "./components/reset-password-form";
export { default as SignOutButton, default as SignoutButton } from "./components/signout-button";

// Contracts
export { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, updateSettingsSchema, revokeSessionSchema } from "./contracts/auth.contract";
export type { RegisterInput, LoginInput, ForgotPasswordInput, ResetPasswordInput, UpdateSettingsInput, RevokeSessionInput } from "./contracts/auth.contract";

// Permissions
export { canAuth as canAuth, assertAuthAccess } from "./permissions/auth.permissions";



