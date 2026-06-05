"use server";

import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { createGoalSchema, updateGoalProgressSchema } from "@/validations/learning-goal.schema";
import { createGoal, updateGoalProgress, deleteGoal } from "@/data/learning-goal.data";
import { revalidatePath } from "next/cache";

export async function createGoalAction(values: any) {
  return actionHandler(async () => {
    const user = await requireAuth();
    const validated = createGoalSchema.parse(values);

    const result = await createGoal(user.id, validated);
    revalidatePath("/student/goals");
    revalidatePath("/student/dashboard");
    return result;
  });
}

export async function updateGoalProgressAction(goalId: string, progress: number) {
  return actionHandler(async () => {
    const user = await requireAuth();
    const validated = updateGoalProgressSchema.parse({ progress });

    const result = await updateGoalProgress(goalId, user.id, validated.progress);
    revalidatePath("/student/goals");
    revalidatePath("/student/dashboard");
    return result;
  });
}

export async function deleteGoalAction(goalId: string) {
  return actionHandler(async () => {
    const user = await requireAuth();
    const result = await deleteGoal(goalId, user.id);
    revalidatePath("/student/goals");
    revalidatePath("/student/dashboard");
    return result;
  });
}
