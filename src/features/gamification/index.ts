// Auto-generated barrel: re-exports all repositories for the gamification feature.
export * from "./repositories/gamification.repository";

// Components
export { BadgeShowcase } from "./components/badge-showcase";
export { Leaderboard } from "./components/leaderboard";
export { XPProgressBar as XPProgressBar, XPProgressBar as XpProgressBar } from "./components/xp-progress-bar";

// Services
export { gamificationService } from "./services/gamification.service";
export type { GamificationService } from "./services/gamification.service";

// Permissions
export { canGamification as canGamification, assertGamificationAccess } from "./permissions/gamification.permissions";

// Contracts
export { createGamificationSchema, updateGamificationSchema, listGamificationQuerySchema } from "./contracts/gamification.contract";
export type { CreateGamificationInput, UpdateGamificationInput, ListGamificationQuery } from "./contracts/gamification.contract";

// Hooks
export {  useGamificationList, useGamificationDetail, useGamificationCreate, useGamificationUpdate, useGamificationDelete } from "./hooks/use-gamification";

