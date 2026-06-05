"use server";

import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { createReferral, convertReferral } from "@/data";
import { revalidatePath } from "next/cache";

export async function trackReferralSignupAction(referrerId: string) {
  return actionHandler(async () => {
    const user = await requireAuth();
    
    if (user.id === referrerId) {
      throw new Error("You cannot refer yourself.");
    }
    
    // Create the referral link in the DB
    const referral = await createReferral(referrerId, user.id!);
    
    // Auto-convert immediately for mock testing ease
    await convertReferral(user.id!);
    
    revalidatePath("/student/referrals");
    return referral;
  });
}
