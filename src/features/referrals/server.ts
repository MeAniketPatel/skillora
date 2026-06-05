// Server-only barrel. Import this from server actions, route handlers,
// server components, and middleware. NEVER import from "use client" files.

// Repository functions
export { createReferral, convertReferral, getReferralStats } from "./repositories/referral.repository";

// Service

// Service
import { referralsService as service } from "./services/referrals.service";
export { service };
