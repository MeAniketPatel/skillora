"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAdmin } from "@/shared/lib/auth-helpers";
import { setSetting } from "@/features/settings/server";
import { settingSchema } from "@/validations";

export async function updateSetting(values: any) {
  return actionHandler(async () => {
    await requireAdmin();
    const validated = settingSchema.parse(values);
    
    const setting = await setSetting(validated.key, validated.value);
    revalidatePath(`/admin/settings`);
    return setting;
  });
}
