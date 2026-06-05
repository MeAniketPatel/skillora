"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { directMessageSchema } from "@/validations/message.schema";
import { getOrCreateConversation, sendDirectMessage } from "@/data";

export async function startConversationAction(targetUserId: string) {
  return actionHandler(async () => {
    const user = await requireAuth();
    if (user.id === targetUserId) {
      throw new Error("You cannot start a conversation with yourself.");
    }
    const conversation = await getOrCreateConversation(user.id!, targetUserId);
    revalidatePath("/messages");
    return conversation;
  });
}

export async function sendMessageAction(conversationId: string, values: z.infer<typeof directMessageSchema>) {
  return actionHandler(async () => {
    const user = await requireAuth();
    const validated = directMessageSchema.parse(values);

    const message = await sendDirectMessage(conversationId, user.id!, validated.content);
    revalidatePath(`/messages/${conversationId}`);
    revalidatePath("/messages");
    return message;
  });
}
