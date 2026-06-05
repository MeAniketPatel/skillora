// Auto-generated barrel: re-exports all repositories for the social feature.

// Components
export { FollowButton } from "./components/follow-button";
export { ProfileActivityFeed } from "./components/profile-activity-feed";
export { ProfileCard } from "./components/profile-card";
export { ProfilePortfolio } from "./components/profile-portfolio";

// Permissions
export { canSocial as canSocial, assertSocialAccess } from "./permissions/social.permissions";




// Contracts
export { createSocialSchema, updateSocialSchema, listSocialQuerySchema } from "./contracts/social.contract";
export type { CreateSocialInput, UpdateSocialInput } from "./contracts/social.contract";
