// Server-only barrel. Import this from server actions, route handlers,
// server components, and middleware. NEVER import from "use client" files.

// Repository functions
export { getUserById, getUserByEmail, createUser, getUserProfile, getAllUsers, getUserCount, getUserCountByRole, updateUser, banUser, unbanUser, getUserGrowthTimeline, getAllInstructors, getInstructorProfile } from "./repositories/user.repository";

// Actions
export { loginUser, registerUser, logoutCurrentSession, logoutAllSessions, logoutSession, requestPasswordReset, resetPassword, updateUserSettings, getSessionSecurityOverview } from "./actions/auth.actions";
export { AuthAuditAction, AuthSessionRevocationReason } from "./repositories/user.repository";

// Service

// Service
import { authService as service } from "./services/auth.service";
export { service };

export * from './permissions/auth.permissions';

export * from './index';
