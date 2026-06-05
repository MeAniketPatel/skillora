// Auto-generated service wrapper for the payments feature.
// Delegates to the repositories by default (DI via default-param pattern
// per ADR-007). Mutation methods emit domain events on the in-process
// event bus for cross-feature side effects.
import { eventBus } from "@/shared/events";
import * as paymentRepo from "../repositories/payment.repository";

export const paymentsService = {
  async createPurchase(...args: Parameters<typeof paymentRepo.createPurchase>): Promise<Awaited<ReturnType<typeof paymentRepo.createPurchase>>> {
    const result = await paymentRepo.createPurchase(...args);
    await eventBus.emit({ name: "payments.createPurchase", feature: "payments", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  getPurchaseByStripeId: paymentRepo.getPurchaseByStripeId,
  getUserPurchases: paymentRepo.getUserPurchases,
  getTeacherEarnings: paymentRepo.getTeacherEarnings,
  getPlatformRevenue: paymentRepo.getPlatformRevenue,
  getRevenueTimeSeries: paymentRepo.getRevenueTimeSeries,
  getRecentPurchases: paymentRepo.getRecentPurchases,
  getRevenueByTeacher: paymentRepo.getRevenueByTeacher,
  getRevenueByCourse: paymentRepo.getRevenueByCourse,
};

export type PaymentsService = typeof paymentsService;
