"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { questionCreateSchema, answerCreateSchema } from "@/features/qa/contracts/qa.contract";
import { service as discussionsService } from "@/features/discussions/server";
import { assertDiscussionsAccess } from "@/features/discussions/permissions/discussions.permissions";
export async function createQuestion(values: any) {
  return actionHandler(async () => {
    const user = await requireAuth();
    assertDiscussionsAccess(user.role, "update");
    const validated = questionCreateSchema.parse(values);

    const question = await discussionsService.createQuestion(user.id, validated.lessonId, validated.title, validated.body);
    revalidatePath(`/learn`);
    return question;
  });
}

export async function createAnswer(values: any) {
  return actionHandler(async () => {
    const user = await requireAuth();
    assertDiscussionsAccess(user.role, "update");
    const validated = answerCreateSchema.parse(values);

    const answer = await discussionsService.createAnswer(user.id, validated.questionId, validated.body);
    revalidatePath(`/learn`);
    return answer;
  });
}

export async function resolveQuestion(questionId: string) {
  return actionHandler(async () => {
    await requireAuth(); // Could check if user is the teacher or the person who asked
    await discussionsService.markQuestionResolved(questionId);
    revalidatePath(`/learn`);
    return true;
  });
}

export async function acceptAnswerAction(answerId: string, questionId: string) {
  return actionHandler(async () => {
    await requireAuth(); // Could check ownership
    await discussionsService.acceptAnswer(answerId, questionId);
    revalidatePath(`/learn`);
    return true;
  });
}
