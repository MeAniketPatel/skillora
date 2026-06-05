"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAdmin } from "@/shared/lib/auth-helpers";
import { flagContentSchema } from "@/features/moderation/contracts/moderation.contract";
import { service as adminService } from "@/features/admin/server";
import { assertAdminAccess } from "@/features/admin/server";
export async function approveModerationItemAction(id: string) {
  return actionHandler(async () => {
    const user = await requireAdmin();
    await adminService.approveModerationItem(id, user.id!);
    revalidatePath("/admin/moderation");
    return { success: true };
  });
}

export async function rejectModerationItemAction(id: string) {
  return actionHandler(async () => {
    const user = await requireAdmin();
    await adminService.rejectModerationItem(id, user.id!);
    revalidatePath("/admin/moderation");
    return { success: true };
  });
}

export async function flagContentAction(values: z.infer<typeof flagContentSchema>) {
  return actionHandler(async () => {
    const validated = flagContentSchema.parse(values);
    const item = await adminService.createModerationItem(validated as any);
    revalidatePath("/admin/moderation");
    return item;
  });
}
