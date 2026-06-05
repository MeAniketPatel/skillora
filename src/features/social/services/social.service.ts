// Auto-generated service wrapper for the social feature.
// Delegates to the repositories by default (DI via default-param pattern
// per ADR-007). Mutation methods emit domain events on the in-process
// event bus for cross-feature side effects.
import { eventBus } from "@/shared/events";
import * as activityRepo from "../repositories/activity.repository";
import * as followRepo from "../repositories/follow.repository";
import * as messageRepo from "../repositories/message.repository";
import * as profileRepo from "../repositories/profile.repository";
import * as studyGroupRepo from "../repositories/study-group.repository";

export const socialService = {
  async recordActivity(...args: Parameters<typeof activityRepo.recordActivity>): Promise<Awaited<ReturnType<typeof activityRepo.recordActivity>>> {
    const result = await activityRepo.recordActivity(...args);
    await eventBus.emit({ name: "social.recordActivity", feature: "social", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  getUserActivities: activityRepo.getUserActivities,
  isFollowing: followRepo.isFollowing,
  async followUser(...args: Parameters<typeof followRepo.followUser>): Promise<Awaited<ReturnType<typeof followRepo.followUser>>> {
    const result = await followRepo.followUser(...args);
    await eventBus.emit({ name: "social.followUser", feature: "social", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async unfollowUser(...args: Parameters<typeof followRepo.unfollowUser>): Promise<Awaited<ReturnType<typeof followRepo.unfollowUser>>> {
    const result = await followRepo.unfollowUser(...args);
    await eventBus.emit({ name: "social.unfollowUser", feature: "social", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  getFollowers: followRepo.getFollowers,
  getFollowing: followRepo.getFollowing,
  getConversations: messageRepo.getConversations,
  getOrCreateConversation: messageRepo.getOrCreateConversation,
  getMessages: messageRepo.getMessages,
  sendDirectMessage: messageRepo.sendDirectMessage,
  getUserProfileCard: profileRepo.getUserProfileCard,
  getUserPortfolio: profileRepo.getUserPortfolio,
  async createPortfolioProject(...args: Parameters<typeof profileRepo.createPortfolioProject>): Promise<Awaited<ReturnType<typeof profileRepo.createPortfolioProject>>> {
    const result = await profileRepo.createPortfolioProject(...args);
    await eventBus.emit({ name: "social.createPortfolioProject", feature: "social", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async deletePortfolioProject(...args: Parameters<typeof profileRepo.deletePortfolioProject>): Promise<Awaited<ReturnType<typeof profileRepo.deletePortfolioProject>>> {
    const result = await profileRepo.deletePortfolioProject(...args);
    await eventBus.emit({ name: "social.deletePortfolioProject", feature: "social", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  getStudyGroups: studyGroupRepo.getStudyGroups,
  async createStudyGroup(...args: Parameters<typeof studyGroupRepo.createStudyGroup>): Promise<Awaited<ReturnType<typeof studyGroupRepo.createStudyGroup>>> {
    const result = await studyGroupRepo.createStudyGroup(...args);
    await eventBus.emit({ name: "social.createStudyGroup", feature: "social", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  getStudyGroupById: studyGroupRepo.getStudyGroupById,
  isGroupMember: studyGroupRepo.isGroupMember,
  joinStudyGroup: studyGroupRepo.joinStudyGroup,
  leaveStudyGroup: studyGroupRepo.leaveStudyGroup,
  sendStudyGroupMessage: studyGroupRepo.sendStudyGroupMessage,
};

export type SocialService = typeof socialService;
