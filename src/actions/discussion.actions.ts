"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { createDiscussionSchema, discussionReplySchema } from "@/validations/discussion.schema";
import { createDiscussion, addDiscussionReply } from "@/data";

export async function createDiscussionAction(values: z.infer<typeof createDiscussionSchema>) {
  return actionHandler(async () => {
    const user = await requireAuth();
    const validated = createDiscussionSchema.parse(values);

    const discussion = await createDiscussion(
      user.id!,
      validated.title,
      validated.content,
      validated.category
    );

    revalidatePath("/discussions");
    return discussion;
  });
}

export async function addDiscussionReplyAction(
  discussionId: string,
  values: z.infer<typeof discussionReplySchema>
) {
  return actionHandler(async () => {
    const user = await requireAuth();
    const validated = discussionReplySchema.parse(values);

    const reply = await addDiscussionReply(discussionId, user.id!, validated.content);
    revalidatePath(`/discussions/${discussionId}`);
    return reply;
  });
}
