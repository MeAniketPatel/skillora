"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth, requireAdmin } from "@/shared/lib/auth-helpers";
import { service as settingsService } from "@/features/settings/server";
import { settingSchema } from "../contracts/settings.contract";

export async function updateSetting(values: any) {
  return actionHandler(async () => {
    await requireAdmin();
    const validated = settingSchema.parse(values);
    
    const setting = await settingsService.setSetting(validated.key, validated.value);
    revalidatePath(`/admin/settings`);
    return setting;
  });
}

export async function updateUserPrivacySettings(values: {
  profileVisible: boolean;
  activityVisible: boolean;
  messagingPreference: string;
}) {
  return actionHandler(async () => {
    const user = await requireAuth();

    await settingsService.updateUserPrivacySettings(user.id, values);

    return { success: true };
  });
}

export async function updateUserNotificationSettings(values: {
  digestType: string;
  enrollment: boolean;
  certificates: boolean;
  promotions: boolean;
}) {
  return actionHandler(async () => {
    const user = await requireAuth();

    await settingsService.updateUserNotificationSettings(user.id, values);

    return { success: true };
  });
}
