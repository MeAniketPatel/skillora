"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { actionHandler } from "@/lib/action-utils";
import { requireAdmin } from "@/lib/auth-helpers";
import { flagContentSchema } from "@/validations/moderation.schema";
import {
  approveModerationItem,
  rejectModerationItem,
  createModerationItem,
} from "@/data";

export async function approveModerationItemAction(id: string) {
  return actionHandler(async () => {
    const user = await requireAdmin();
    await approveModerationItem(id, user.id!);
    revalidatePath("/admin/moderation");
    return { success: true };
  });
}

export async function rejectModerationItemAction(id: string) {
  return actionHandler(async () => {
    const user = await requireAdmin();
    await rejectModerationItem(id, user.id!);
    revalidatePath("/admin/moderation");
    return { success: true };
  });
}

export async function flagContentAction(values: z.infer<typeof flagContentSchema>) {
  return actionHandler(async () => {
    const validated = flagContentSchema.parse(values);
    const item = await createModerationItem(validated as any);
    revalidatePath("/admin/moderation");
    return item;
  });
}
