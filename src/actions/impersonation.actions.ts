"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAdmin } from "@/shared/lib/auth-helpers";
import { setImpersonatedUserId, clearImpersonatedUserId } from "@/lib/impersonation";

export async function impersonateUserAction(targetUserId: string) {
  return actionHandler(async () => {
    // Make sure the calling user is an actual admin
    await requireAdmin();
    
    await setImpersonatedUserId(targetUserId);
    revalidatePath("/");
    return { success: true };
  });
}

export async function stopImpersonationAction() {
  return actionHandler(async () => {
    // Only real admin sessions can stop impersonation since the request context will resolve it
    await clearImpersonatedUserId();
    revalidatePath("/");
    return { success: true };
  });
}
