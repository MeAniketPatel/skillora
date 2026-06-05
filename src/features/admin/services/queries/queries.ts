import * as auditRepo from "../../repositories/audit.repository";
import * as couponRepo from "../../repositories/coupon.repository";
import * as moderationRepo from "../../repositories/moderation.repository";

export const getAuditLogs = auditRepo.getAuditLogs;
export const getCouponByCode = couponRepo.getCouponByCode;
export const getAllCoupons = couponRepo.getAllCoupons;
export const validateCoupon = couponRepo.validateCoupon;
export const getTeacherCoupons = couponRepo.getTeacherCoupons;
export const getPendingModerationItems = moderationRepo.getPendingModerationItems;
export const getModerationItems = moderationRepo.getModerationItems;
export const getModerationStats = moderationRepo.getModerationStats;
