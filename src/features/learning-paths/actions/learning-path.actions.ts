"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { service as learningPathsService } from "@/features/learning-paths/server";
import { assertLearningPathsAccess } from "@/features/learning-paths/permissions/learning-paths.permissions";
export async function enrollInLearningPathAction(pathId: string) {
  return actionHandler(async () => {
    const user = await requireAuth();
    const enrollment = await learningPathsService.enrollInLearningPath(pathId, user.id!);
    revalidatePath(`/learning-paths/${pathId}`);
    return enrollment;
  });
}
