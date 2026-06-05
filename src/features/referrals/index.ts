// Auto-generated barrel: re-exports all repositories for the referrals feature.
export * from "./repositories/referral.repository";

// Components
export { ReferralDashboard } from "./components/referral-dashboard";

// Services
export { referralsService } from "./services/referrals.service";
export type { ReferralsService } from "./services/referrals.service";

// Permissions
export { canReferrals as canReferrals, assertReferralsAccess } from "./permissions/referrals.permissions";

// Contracts
export { createReferralsSchema, updateReferralsSchema, listReferralsQuerySchema } from "./contracts/referrals.contract";
export type { CreateReferralsInput, UpdateReferralsInput, ListReferralsQuery } from "./contracts/referrals.contract";

// Hooks
export {  useReferralsList, useReferralsDetail, useReferralsCreate, useReferralsUpdate, useReferralsDelete } from "./hooks/use-referrals";

