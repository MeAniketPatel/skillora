// Auto-generated barrel: re-exports all repositories for the social feature.
export * from "./repositories/activity.repository";
export * from "./repositories/follow.repository";
export * from "./repositories/message.repository";
export * from "./repositories/profile.repository";
export * from "./repositories/study-group.repository";

// Components
export { FollowButton } from "./components/follow-button";
export { ProfileActivityFeed } from "./components/profile-activity-feed";
export { ProfileCard } from "./components/profile-card";
export { ProfilePortfolio } from "./components/profile-portfolio";

// Services
export { socialService } from "./services/social.service";
export type { SocialService } from "./services/social.service";

// Permissions
export { canSocial as canSocial, assertSocialAccess } from "./permissions/social.permissions";

// Contracts
export { createSocialSchema, updateSocialSchema, listSocialQuerySchema } from "./contracts/social.contract";
export type { CreateSocialInput, UpdateSocialInput, ListSocialQuery } from "./contracts/social.contract";

// Hooks
export {  useSocialList, useSocialDetail, useSocialCreate, useSocialUpdate, useSocialDelete } from "./hooks/use-social";

