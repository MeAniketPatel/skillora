"use server";

import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { service as subscriptionsService } from "@/features/subscriptions/server";
import { revalidatePath } from "next/cache";

import { assertSubscriptionsAccess } from "@/features/subscriptions/permissions/subscriptions.permissions";
export async function subscribeToPlanAction(plan: "FREE" | "PRO" | "ENTERPRISE") {
  return actionHandler(async () => {
    const user = await requireAuth();
    
    // Default mock duration of 30 days
    const subscription = await subscriptionsService.createSubscription(user.id!, plan, 30);
    
    revalidatePath("/pricing");
    revalidatePath("/settings/privacy"); // or wherever subscriptions are viewed
    return subscription;
  });
}
