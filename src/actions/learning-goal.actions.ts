"use server";

import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { createGoalSchema, updateGoalProgressSchema } from "@/features/learning-goals/contracts/learning-goal.contract";
import { service as studentsService } from "@/features/students/server";
import { revalidatePath } from "next/cache";

export async function createGoalAction(values: any) {
  return actionHandler(async () => {
    const user = await requireAuth();
    const validated = createGoalSchema.parse(values);

    const result = await studentsService.createGoal(user.id, validated);
    revalidatePath("/student/goals");
    revalidatePath("/student/dashboard");
    return result;
  });
}

export async function updateGoalProgressAction(goalId: string, progress: number) {
  return actionHandler(async () => {
    const user = await requireAuth();
    const validated = updateGoalProgressSchema.parse({ progress });

    const result = await studentsService.updateGoalProgress(goalId, user.id, validated.progress);
    revalidatePath("/student/goals");
    revalidatePath("/student/dashboard");
    return result;
  });
}

export async function deleteGoalAction(goalId: string) {
  return actionHandler(async () => {
    const user = await requireAuth();
    const result = await studentsService.deleteGoal(goalId, user.id);
    revalidatePath("/student/goals");
    revalidatePath("/student/dashboard");
    return result;
  });
}
