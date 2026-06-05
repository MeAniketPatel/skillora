// Auto-generated service wrapper for the teachers feature.
// Delegates to the repositories by default (DI via default-param pattern
// per ADR-007). Mutation methods emit domain events on the in-process
// event bus for cross-feature side effects.
import { eventBus } from "@/shared/events";
import * as payoutRepo from "../repositories/payout.repository";

export const teachersService = {
  getPayoutHistory: payoutRepo.getPayoutHistory,
  getPayoutBalance: payoutRepo.getPayoutBalance,
  async createPayoutRequest(...args: Parameters<typeof payoutRepo.createPayoutRequest>): Promise<Awaited<ReturnType<typeof payoutRepo.createPayoutRequest>>> {
    const result = await payoutRepo.createPayoutRequest(...args);
    await eventBus.emit({ name: "teachers.createPayoutRequest", feature: "teachers", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
};

export type TeachersService = typeof teachersService;
