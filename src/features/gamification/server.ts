// Server-only barrel. Import this from server actions, route handlers,
// server components, and middleware. NEVER import from "use client" files.

// Repository functions
export { getUserXPPoints, awardXPPoints, getUserBadgesList, unlockBadgeForUser, getLeaderboardRankings } from "./repositories/gamification.repository";

// Service

// Service
import { gamificationService as service } from "./services/gamification.service";
export { service };
