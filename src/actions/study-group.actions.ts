"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { createStudyGroupSchema, studyGroupMessageSchema } from "@/features/study-groups/contracts/study-group.contract";
import { service as socialService } from "@/features/social/server";
export async function createStudyGroupAction(values: z.infer<typeof createStudyGroupSchema>) {
  return actionHandler(async () => {
    const user = await requireAuth();
    const validated = createStudyGroupSchema.parse(values);

    const group = await socialService.createStudyGroup(
      user.id!,
      validated.name,
      validated.description,
      validated.isPrivate
    );

    revalidatePath("/student/study-groups");
    return group;
  });
}

export async function joinStudyGroupAction(studyGroupId: string) {
  return actionHandler(async () => {
    const user = await requireAuth();
    await socialService.joinStudyGroup(studyGroupId, user.id!);
    revalidatePath("/student/study-groups");
    return { success: true };
  });
}

export async function leaveStudyGroupAction(studyGroupId: string) {
  return actionHandler(async () => {
    const user = await requireAuth();
    await socialService.leaveStudyGroup(studyGroupId, user.id!);
    revalidatePath("/student/study-groups");
    return { success: true };
  });
}

export async function sendStudyGroupMessageAction(studyGroupId: string, values: z.infer<typeof studyGroupMessageSchema>) {
  return actionHandler(async () => {
    const user = await requireAuth();
    const validated = studyGroupMessageSchema.parse(values);

    const msg = await socialService.sendStudyGroupMessage(studyGroupId, user.id!, validated.content);
    revalidatePath(`/student/study-groups/${studyGroupId}`);
    return msg;
  });
}
