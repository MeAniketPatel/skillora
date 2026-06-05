// Server-only barrel. Import this from server actions, route handlers,
// server components, and middleware. NEVER import from "use client" files.

// Repository functions
export { recordActivity, getUserActivities } from "./repositories/activity.repository";
export { isFollowing, followUser, unfollowUser, getFollowers, getFollowing } from "./repositories/follow.repository";
export { getConversations, getOrCreateConversation, getMessages, sendDirectMessage } from "./repositories/message.repository";
export { getUserProfileCard, getUserPortfolio, createPortfolioProject, deletePortfolioProject } from "./repositories/profile.repository";
export { getStudyGroups, createStudyGroup, getStudyGroupById, isGroupMember, joinStudyGroup, leaveStudyGroup, sendStudyGroupMessage } from "./repositories/study-group.repository";

// Service

// Service
import { socialService as service } from "./services/social.service";
export { service };

export * from './permissions/social.permissions';

export * from './index';
