"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { questionCreateSchema, answerCreateSchema } from "@/features/qa/contracts/qa.contract";
import { createQuestion as createQuestionData, createAnswer as createAnswerData, markQuestionResolved, acceptAnswer } from "@/features/discussions/server";
export async function createQuestion(values: any) {
  return actionHandler(async () => {
    const user = await requireAuth();
    const validated = questionCreateSchema.parse(values);

    const question = await createQuestionData(user.id, validated.lessonId, validated.title, validated.body);
    revalidatePath(`/learn`);
    return question;
  });
}

export async function createAnswer(values: any) {
  return actionHandler(async () => {
    const user = await requireAuth();
    const validated = answerCreateSchema.parse(values);

    const answer = await createAnswerData(user.id, validated.questionId, validated.body);
    revalidatePath(`/learn`);
    return answer;
  });
}

export async function resolveQuestion(questionId: string) {
  return actionHandler(async () => {
    await requireAuth(); // Could check if user is the teacher or the person who asked
    await markQuestionResolved(questionId);
    revalidatePath(`/learn`);
    return true;
  });
}

export async function acceptAnswerAction(answerId: string, questionId: string) {
  return actionHandler(async () => {
    await requireAuth(); // Could check ownership
    await acceptAnswer(answerId, questionId);
    revalidatePath(`/learn`);
    return true;
  });
}
