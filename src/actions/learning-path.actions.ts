"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { enrollInLearningPath } from "@/features/learning-paths/server";
export async function enrollInLearningPathAction(pathId: string) {
  return actionHandler(async () => {
    const user = await requireAuth();
    const enrollment = await enrollInLearningPath(pathId, user.id!);
    revalidatePath(`/learning-paths/${pathId}`);
    return enrollment;
  });
}
