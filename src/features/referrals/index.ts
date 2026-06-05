// Auto-generated barrel: re-exports all repositories for the referrals feature.

// Components
export { ReferralDashboard } from "./components/referral-dashboard";

// Permissions
export { canReferrals as canReferrals, assertReferralsAccess } from "./permissions/referrals.permissions";

// Contracts
export { createReferralsSchema, updateReferralsSchema, listReferralsQuerySchema } from "./contracts/referrals.contract";
export type { CreateReferralsInput, UpdateReferralsInput, ListReferralsQuery } from "./contracts/referrals.contract";

