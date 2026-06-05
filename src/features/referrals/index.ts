// Auto-generated barrel: re-exports all repositories for the referrals feature.
export * from "./repositories/referral.repository";

// Components
export { ReferralDashboard } from "./components/referral-dashboard";

// Services
export { referralsService } from "./services/referrals.service";
export type { ReferralsService } from "./services/referrals.service";

// Permissions
export { canReferrals as canReferrals, assertReferralsAccess } from "./permissions/referrals.permissions";
