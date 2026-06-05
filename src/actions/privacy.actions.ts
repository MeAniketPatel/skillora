"use server";

import { z } from "zod";
import { actionHandler } from "@/lib/action-utils";
import { requireAuth } from "@/lib/auth-helpers";
import { privacySettingsSchema } from "@/validations";
import db from "@/lib/prisma";
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
