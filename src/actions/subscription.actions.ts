"use server";

import { actionHandler } from "@/lib/action-utils";
import { requireAuth } from "@/lib/auth-helpers";
import { createSubscription } from "@/data";
import { revalidatePath } from "next/cache";

export async function subscribeToPlanAction(plan: "FREE" | "PRO" | "ENTERPRISE") {
  return actionHandler(async () => {
    const user = await requireAuth();
    
    // Default mock duration of 30 days
    const subscription = await createSubscription(user.id!, plan, 30);
    
    revalidatePath("/pricing");
    revalidatePath("/settings/privacy"); // or wherever subscriptions are viewed
    return subscription;
  });
}
