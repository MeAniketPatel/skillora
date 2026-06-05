// Auto-generated barrel: re-exports all repositories for the admin feature.
export * from "./repositories/audit.repository";
export * from "./repositories/coupon.repository";
export * from "./repositories/moderation.repository";

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

// Services
export { adminService } from "./services/admin.service";
export type { AdminService } from "./services/admin.service";

// Permissions
export { canAdmin as canAdmin, assertAdminAccess } from "./permissions/admin.permissions";
