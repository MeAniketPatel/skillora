"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { profileUpdateSchema } from "../contracts/profile.contract";
import { service as authService } from "@/features/auth/server";

export async function updateProfileAction(values: z.infer<typeof profileUpdateSchema>) {
  return actionHandler(async () => {
    const user = await requireAuth();
    const validated = profileUpdateSchema.parse(values);

    const socialLinks = {
      twitter: validated.twitter || null,
      linkedin: validated.linkedin || null,
      github: validated.github || null,
    };

    await authService.updateUser(user.id!, {
      name: validated.name,
      headline: validated.headline,
      bio: validated.bio,
      socialLinks,
      image: validated.image || undefined,
    });

    revalidatePath("/profile");
    return { success: true };
  });
}
