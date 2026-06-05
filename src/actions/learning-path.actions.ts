"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/lib/action-utils";
import { requireAuth } from "@/lib/auth-helpers";
import { enrollInLearningPath } from "@/data";

export async function enrollInLearningPathAction(pathId: string) {
  return actionHandler(async () => {
    const user = await requireAuth();
    const enrollment = await enrollInLearningPath(pathId, user.id!);
    revalidatePath(`/learning-paths/${pathId}`);
    return enrollment;
  });
}
