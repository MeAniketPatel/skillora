// Auto-generated service wrapper for the admin feature.
// Delegates to the repositories by default (DI via default-param pattern
// per ADR-007). Mutation methods emit domain events on the in-process
// event bus for cross-feature side effects.
import { eventBus } from "@/shared/events";
import * as auditRepo from "../repositories/audit.repository";
import * as couponRepo from "../repositories/coupon.repository";
import * as moderationRepo from "../repositories/moderation.repository";

export const adminService = {
  getAuditLogs: auditRepo.getAuditLogs,
  getCouponByCode: couponRepo.getCouponByCode,
  getAllCoupons: couponRepo.getAllCoupons,
  async createCoupon(...args: Parameters<typeof couponRepo.createCoupon>): Promise<Awaited<ReturnType<typeof couponRepo.createCoupon>>> {
    const result = await couponRepo.createCoupon(...args);
    await eventBus.emit({ name: "admin.createCoupon", feature: "admin", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async updateCoupon(...args: Parameters<typeof couponRepo.updateCoupon>): Promise<Awaited<ReturnType<typeof couponRepo.updateCoupon>>> {
    const result = await couponRepo.updateCoupon(...args);
    await eventBus.emit({ name: "admin.updateCoupon", feature: "admin", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async deleteCoupon(...args: Parameters<typeof couponRepo.deleteCoupon>): Promise<Awaited<ReturnType<typeof couponRepo.deleteCoupon>>> {
    const result = await couponRepo.deleteCoupon(...args);
    await eventBus.emit({ name: "admin.deleteCoupon", feature: "admin", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async incrementCouponUsage(...args: Parameters<typeof couponRepo.incrementCouponUsage>): Promise<Awaited<ReturnType<typeof couponRepo.incrementCouponUsage>>> {
    const result = await couponRepo.incrementCouponUsage(...args);
    await eventBus.emit({ name: "admin.incrementCouponUsage", feature: "admin", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  validateCoupon: couponRepo.validateCoupon,
  getTeacherCoupons: couponRepo.getTeacherCoupons,
  getPendingModerationItems: moderationRepo.getPendingModerationItems,
  getModerationItems: moderationRepo.getModerationItems,
  async createModerationItem(...args: Parameters<typeof moderationRepo.createModerationItem>): Promise<Awaited<ReturnType<typeof moderationRepo.createModerationItem>>> {
    const result = await moderationRepo.createModerationItem(...args);
    await eventBus.emit({ name: "admin.createModerationItem", feature: "admin", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async approveModerationItem(...args: Parameters<typeof moderationRepo.approveModerationItem>): Promise<Awaited<ReturnType<typeof moderationRepo.approveModerationItem>>> {
    const result = await moderationRepo.approveModerationItem(...args);
    await eventBus.emit({ name: "admin.approveModerationItem", feature: "admin", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async rejectModerationItem(...args: Parameters<typeof moderationRepo.rejectModerationItem>): Promise<Awaited<ReturnType<typeof moderationRepo.rejectModerationItem>>> {
    const result = await moderationRepo.rejectModerationItem(...args);
    await eventBus.emit({ name: "admin.rejectModerationItem", feature: "admin", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  getModerationStats: moderationRepo.getModerationStats,
};

export type AdminService = typeof adminService;
