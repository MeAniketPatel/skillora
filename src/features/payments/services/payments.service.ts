import { eventBus } from "@/shared/events";
import * as paymentRepo from "../repositories/payment.repository";

export const paymentsService = {
  async createPurchase(...args: Parameters<typeof paymentRepo.createPurchase>): Promise<Awaited<ReturnType<typeof paymentRepo.createPurchase>>> {
    const result = await paymentRepo.createPurchase(...args);
    await eventBus.emit({ name: "payments.createPurchase", feature: "payments", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  getPurchaseByMockId: paymentRepo.getPurchaseByMockId,
  getUserPurchases: paymentRepo.getUserPurchases,
  getTeacherEarnings: paymentRepo.getTeacherEarnings,
  getPlatformRevenue: paymentRepo.getPlatformRevenue,
  getRevenueTimeSeries: paymentRepo.getRevenueTimeSeries,
  getRecentPurchases: paymentRepo.getRecentPurchases,
  getRevenueByTeacher: paymentRepo.getRevenueByTeacher,
  getRevenueByCourse: paymentRepo.getRevenueByCourse,
};

export type PaymentsService = typeof paymentsService;
