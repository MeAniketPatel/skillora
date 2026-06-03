"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/lib/action-utils";
import { requireAdmin } from "@/lib/auth-helpers";
import { setSetting } from "@/data";
import { z } from "zod";

const settingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
});

export async function updateSetting(values: any) {
  return actionHandler(async () => {
    await requireAdmin();
    const validated = settingSchema.parse(values);
    
    const setting = await setSetting(validated.key, validated.value);
    revalidatePath(`/admin/settings`);
    return setting;
  });
}
