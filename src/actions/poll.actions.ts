"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth, requireTeacher } from "@/shared/lib/auth-helpers";
import { pollSchema } from "@/features/polls/contracts/poll.contract";
import { service as pollsService } from "@/features/polls/server";
import { service as coursesService } from "@/features/courses/server";
import { z } from "zod";

import { assertCoursesAccess } from "@/features/courses/permissions/courses.permissions";
export async function createPollAction(
  courseId: string,
  values: z.infer<typeof pollSchema>
) {
  return actionHandler(async () => {
    const user = await requireTeacher();
    const validated = pollSchema.parse(values);

    // Verify course ownership
    await coursesService.getCourseByIdForOwner(courseId, user.id);

    const poll = await pollsService.createPoll(
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

    const poll = await pollsService.getPollById(pollId);
    if (!poll) throw new Error("Poll not found");
    if (poll.closedAt) throw new Error("Poll is closed");

    const vote = await pollsService.voteInPoll(user.id, pollId, optionId);

    revalidatePath(`/teacher/courses/${courseId}/polls`);
    revalidatePath(`/learn/${courseId}`); // Revalidate student view
    return vote;
  });
}

export async function closePollAction(courseId: string, pollId: string) {
  return actionHandler(async () => {
    const user = await requireTeacher();

    // Verify course ownership
    await coursesService.getCourseByIdForOwner(courseId, user.id);

    const poll = await pollsService.closePoll(pollId);

    revalidatePath(`/teacher/courses/${courseId}/polls`);
    return poll;
  });
}

export async function deletePollAction(courseId: string, pollId: string) {
  return actionHandler(async () => {
    const user = await requireTeacher();

    // Verify course ownership
    await coursesService.getCourseByIdForOwner(courseId, user.id);

    await pollsService.deletePoll(pollId);

    revalidatePath(`/teacher/courses/${courseId}/polls`);
    return { success: true };
  });
}
