// Auto-generated service wrapper for the referrals feature.
// Delegates to the repositories by default (DI via default-param pattern
// per ADR-007). Mutation methods emit domain events on the in-process
// event bus for cross-feature side effects.
import { eventBus } from "@/shared/events";
import * as referralRepo from "../repositories/referral.repository";

export const referralsService = {
  async createReferral(...args: Parameters<typeof referralRepo.createReferral>): Promise<Awaited<ReturnType<typeof referralRepo.createReferral>>> {
    const result = await referralRepo.createReferral(...args);
    await eventBus.emit({ name: "referrals.createReferral", feature: "referrals", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async convertReferral(...args: Parameters<typeof referralRepo.convertReferral>): Promise<Awaited<ReturnType<typeof referralRepo.convertReferral>>> {
    const result = await referralRepo.convertReferral(...args);
    await eventBus.emit({ name: "referrals.convertReferral", feature: "referrals", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  getReferralStats: referralRepo.getReferralStats,
};

export type ReferralsService = typeof referralsService;
