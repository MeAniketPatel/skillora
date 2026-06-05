// Auto-generated service wrapper for the gamification feature.
// Delegates to the repositories by default (DI via default-param pattern
// per ADR-007). Mutation methods emit domain events on the in-process
// event bus for cross-feature side effects.
import { eventBus } from "@/shared/events";
import * as gamificationRepo from "../repositories/gamification.repository";

export const gamificationService = {
  getUserXPPoints: gamificationRepo.getUserXPPoints,
  awardXPPoints: gamificationRepo.awardXPPoints,
  getUserBadgesList: gamificationRepo.getUserBadgesList,
  async unlockBadgeForUser(...args: Parameters<typeof gamificationRepo.unlockBadgeForUser>): Promise<Awaited<ReturnType<typeof gamificationRepo.unlockBadgeForUser>>> {
    const result = await gamificationRepo.unlockBadgeForUser(...args);
    await eventBus.emit({ name: "gamification.unlockBadgeForUser", feature: "gamification", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  getLeaderboardRankings: gamificationRepo.getLeaderboardRankings,
};

export type GamificationService = typeof gamificationService;
