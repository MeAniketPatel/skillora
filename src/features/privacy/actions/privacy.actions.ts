"use server";

import { z } from "zod";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { privacySettingsSchema } from "@/features/privacy/contracts/privacy.contract";;
import db from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updatePrivacySettingsAction(values: z.infer<typeof privacySettingsSchema>) {
  return actionHandler(async () => {
    const user = await requireAuth();
    const validated = privacySettingsSchema.parse(values);

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        profileVisible: validated.profileVisible,
        activityVisible: validated.activityVisible,
        messagingPreference: validated.messagingPreference,
      },
    });

    revalidatePath("/settings/privacy");
    return updatedUser;
  });
}
