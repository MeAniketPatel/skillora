"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { profileUpdateSchema, portfolioProjectSchema } from "@/validations/profile.schema";
import { updateUser } from "@/features/auth";
import { createPortfolioProject, deletePortfolioProject, recordActivity } from "@/features/social";

export async function updateProfileAction(values: z.infer<typeof profileUpdateSchema>) {
  return actionHandler(async () => {
    const user = await requireAuth();
    const validated = profileUpdateSchema.parse(values);

    const socialLinks = {
      twitter: validated.twitter || null,
      linkedin: validated.linkedin || null,
      github: validated.github || null,
    };

    await updateUser(user.id!, {
      name: validated.name,
      headline: validated.headline,
      bio: validated.bio,
      socialLinks,
    });

    revalidatePath("/profile");
    return { success: true };
  });
}

export async function addPortfolioProjectAction(values: z.infer<typeof portfolioProjectSchema>) {
  return actionHandler(async () => {
    const user = await requireAuth();
    const validated = portfolioProjectSchema.parse(values);

    const project = await createPortfolioProject(user.id!, {
      title: validated.title,
      description: validated.description,
      projectUrl: validated.projectUrl,
      imageUrl: validated.imageUrl,
    });

    // Record dynamic activity event
    await recordActivity(user.id!, "PROJECT_PUBLISHED", {
      projectTitle: validated.title,
      projectId: project.id,
    });

    revalidatePath("/profile");
    return project;
  });
}

export async function deletePortfolioProjectAction(projectId: string) {
  return actionHandler(async () => {
    const user = await requireAuth();
    await deletePortfolioProject(user.id!, projectId);
    revalidatePath("/profile");
    return { success: true };
  });
}
