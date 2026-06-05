"use server";

import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { service as referralsService } from "@/features/referrals/server";
import { revalidatePath } from "next/cache";

import { assertReferralsAccess } from "@/features/referrals/permissions/referrals.permissions";
export async function trackReferralSignupAction(referrerId: string) {
  return actionHandler(async () => {
    const user = await requireAuth();
    
    if (user.id === referrerId) {
      throw new Error("You cannot refer yourself.");
    }
    
    // Create the referral link in the DB
    const referral = await referralsService.createReferral(referrerId, user.id!);
    
    // Auto-convert immediately for mock testing ease
    await referralsService.convertReferral(user.id!);
    
    revalidatePath("/student/referrals");
    return referral;
  });
}
