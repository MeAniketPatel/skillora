"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { createDeckSchema, addCardSchema } from "@/features/flashcards/contracts/flashcard.contract";
import { service as flashcardsService } from "@/features/flashcards/server";
export async function createDeckAction(values: z.infer<typeof createDeckSchema>) {
  return actionHandler(async () => {
    const user = await requireAuth();
    const validated = createDeckSchema.parse(values);

    const deck = await flashcardsService.createDeck(user.id!, validated.title, validated.description);
    revalidatePath("/student/flashcards");
    return deck;
  });
}

export async function addCardAction(deckId: string, values: z.infer<typeof addCardSchema>) {
  return actionHandler(async () => {
    await requireAuth();
    const validated = addCardSchema.parse(values);

    const card = await flashcardsService.addCardToDeck(deckId, validated.front, validated.back);
    revalidatePath(`/student/flashcards/${deckId}`);
    return card;
  });
}

export async function reviewCardAction(cardId: string, score: number) {
  return actionHandler(async () => {
    const user = await requireAuth();
    if (score < 0 || score > 5) {
      throw new Error("Score must be between 0 and 5.");
    }

    const progress = await flashcardsService.updateCardRepetitionProgress(user.id!, cardId, score);
    revalidatePath("/student/flashcards");
    return progress;
  });
}
