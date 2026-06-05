// Server-only barrel. Import this from server actions, route handlers,
// server components, and middleware. NEVER import from "use client" files.

// Repository functions
export { getAuditLogs } from "./repositories/audit.repository";
export { getCouponByCode, getAllCoupons, createCoupon, updateCoupon, deleteCoupon, incrementCouponUsage, validateCoupon, getTeacherCoupons } from "./repositories/coupon.repository";
export { getPendingModerationItems, getModerationItems, createModerationItem, approveModerationItem, rejectModerationItem, getModerationStats } from "./repositories/moderation.repository";

// Service

// Service
import { adminService as service } from "./services/admin.service";
export { service };

export * from './permissions/admin.permissions';

export * from './contracts/admin.contract';

export * from './index';
