"use server";

import { z } from "zod";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { emailPreferenceSchema } from "@/validations";
import { updateEmailPreferences } from "@/features/email-preferences/server";
import { revalidatePath } from "next/cache";

export async function updateEmailPreferencesAction(values: z.infer<typeof emailPreferenceSchema>) {
  return actionHandler(async () => {
    const user = await requireAuth();
    const validated = emailPreferenceSchema.parse(values);
    
    const prefs = await updateEmailPreferences(user.id, validated);
    
    revalidatePath("/settings/notifications");
    
    return prefs;
  });
}
