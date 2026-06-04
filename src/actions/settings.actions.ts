"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/lib/action-utils";
import { requireAdmin } from "@/lib/auth-helpers";
import { setSetting } from "@/data";
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
