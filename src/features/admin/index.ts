// Auto-generated barrel: re-exports all repositories for the admin feature.

// Components
export { AuditLogTable } from "./components/audit-log-table";
export { ContentModerationQueue } from "./components/content-moderation-queue";
export { CouponManager } from "./components/coupon-manager";
export { CourseModeration } from "./components/course-moderation";
export { FeatureFlagsPanel } from "./components/feature-flags-panel";
export { MaintenanceBanner } from "./components/maintenance-banner";
export { PlatformAnnouncements } from "./components/platform-announcements";
export { ReportsDashboard } from "./components/reports-dashboard";
export { RevenueCharts } from "./components/revenue-charts";
export { ImpersonateButton as ImpersonateButton, ImpersonateButton as UserImpersonation, StopImpersonationBanner } from "./components/user-impersonation";

// Permissions
export { canAdmin as canAdmin, assertAdminAccess, isAdmin } from "./permissions/admin.permissions";




// Contracts
export { userRoleUpdateSchema, categoryCreateSchema, categoryUpdateSchema, couponCreateSchema } from "./contracts/admin.contract";
export type { UserRoleUpdateInput, CategoryCreateInput, CategoryUpdateInput, CouponCreateInput } from "./contracts/admin.contract";

// Hooks
export { useAdminActions } from "./hooks/use-admin";


export { updateUserRole, banUser, unbanUser } from "./actions/admin.actions";
