"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth, requireTeacher } from "@/shared/lib/auth-helpers";
import { pollSchema } from "@/validations/poll.schema";
import { createPoll as createPollDAL, voteInPoll as voteInPollDAL, closePoll as closePollDAL, deletePoll as deletePollDAL, getPollById } from "@/features/polls/server";
import { getCourseByIdForOwner } from "@/features/courses/server";
import { z } from "zod";

export async function createPollAction(
  courseId: string,
  values: z.infer<typeof pollSchema>
) {
  return actionHandler(async () => {
    const user = await requireTeacher();
    const validated = pollSchema.parse(values);

    // Verify course ownership
    await getCourseByIdForOwner(courseId, user.id);

    const poll = await createPollDAL(
      user.id,
      courseId,
      validated.question,
      validated.options
    );

    revalidatePath(`/teacher/courses/${courseId}/polls`);
    return poll;
  });
}

export async function voteInPollAction(courseId: string, pollId: string, optionId: string) {
  return actionHandler(async () => {
    const user = await requireAuth();

    const poll = await getPollById(pollId);
    if (!poll) throw new Error("Poll not found");
    if (poll.closedAt) throw new Error("Poll is closed");

    const vote = await voteInPollDAL(user.id, pollId, optionId);

    revalidatePath(`/teacher/courses/${courseId}/polls`);
    revalidatePath(`/learn/${courseId}`); // Revalidate student view
    return vote;
  });
}

export async function closePollAction(courseId: string, pollId: string) {
  return actionHandler(async () => {
    const user = await requireTeacher();

    // Verify course ownership
    await getCourseByIdForOwner(courseId, user.id);

    const poll = await closePollDAL(pollId);

    revalidatePath(`/teacher/courses/${courseId}/polls`);
    return poll;
  });
}

export async function deletePollAction(courseId: string, pollId: string) {
  return actionHandler(async () => {
    const user = await requireTeacher();

    // Verify course ownership
    await getCourseByIdForOwner(courseId, user.id);

    await deletePollDAL(pollId);

    revalidatePath(`/teacher/courses/${courseId}/polls`);
    return { success: true };
  });
}
