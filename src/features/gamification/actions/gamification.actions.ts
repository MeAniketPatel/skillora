"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { service as gamificationService } from "@/features/gamification/server";
export async function awardXPAction(amount: number, reason: string) {
  return actionHandler(async () => {
    const user = await requireAuth();
    
    // Log points transaction
    const tx = await gamificationService.awardXPPoints(user.id!, amount, reason);

    // Dynamic checks for Badge triggers based on points
    // (e.g. unlock "dedicated_learner" if points > 1000)
    const totalXP = await gamificationService.awardXPPoints(user.id!, 0, "CHECK_XP"); // fetch without incrementing
    if (totalXP.amount >= 1000) {
      await gamificationService.unlockBadgeForUser(user.id!, "dedicated_learner");
    }

    revalidatePath("/leaderboard");
    return tx;
  });
}
