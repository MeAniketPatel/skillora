// Auto-generated barrel: re-exports all repositories for the gamification feature.

// Components
export { BadgeShowcase } from "./components/badge-showcase";
export { Leaderboard } from "./components/leaderboard";
export { XPProgressBar as XPProgressBar, XPProgressBar as XpProgressBar } from "./components/xp-progress-bar";

// Permissions
export { canGamification as canGamification, assertGamificationAccess } from "./permissions/gamification.permissions";




// Contracts
export { createGamificationSchema, updateGamificationSchema, listGamificationQuerySchema } from "./contracts/gamification.contract";
export type { CreateGamificationInput, UpdateGamificationInput } from "./contracts/gamification.contract";

export { getUserXPPoints, getLeaderboardRankings, getUserBadgesList } from "./server";
