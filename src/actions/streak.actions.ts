"use server";

import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { recordStudySessionSchema } from "@/features/streaks/contracts/streak.contract";
import { recordStudySession, buyStreakFreeze } from "@/features/students/server";
import { revalidatePath } from "next/cache";

export async function recordStudyActivity(values: { durationSeconds: number }) {
  return actionHandler(async () => {
    const user = await requireAuth();
    const validated = recordStudySessionSchema.parse(values);

    const result = await recordStudySession(user.id, validated.durationSeconds);
    revalidatePath("/student/dashboard");
    return result;
  });
}

export async function purchaseStreakFreezeAction() {
  return actionHandler(async () => {
    const user = await requireAuth();
    const result = await buyStreakFreeze(user.id);
    
    revalidatePath("/student/dashboard");
    return result;
  });
}
