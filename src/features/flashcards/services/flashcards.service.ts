// Auto-generated service wrapper for the flashcards feature.
// Delegates to the repositories by default (DI via default-param pattern
// per ADR-007). Mutation methods emit domain events on the in-process
// event bus for cross-feature side effects.
import { eventBus } from "@/shared/events";
import * as flashcardRepo from "../repositories/flashcard.repository";

export const flashcardsService = {
  async createDeck(...args: Parameters<typeof flashcardRepo.createDeck>): Promise<Awaited<ReturnType<typeof flashcardRepo.createDeck>>> {
    const result = await flashcardRepo.createDeck(...args);
    await eventBus.emit({ name: "flashcards.createDeck", feature: "flashcards", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async addCardToDeck(...args: Parameters<typeof flashcardRepo.addCardToDeck>): Promise<Awaited<ReturnType<typeof flashcardRepo.addCardToDeck>>> {
    const result = await flashcardRepo.addCardToDeck(...args);
    await eventBus.emit({ name: "flashcards.addCardToDeck", feature: "flashcards", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  getDecksForUser: flashcardRepo.getDecksForUser,
  getDeckDetails: flashcardRepo.getDeckDetails,
  getReviewCardsForUser: flashcardRepo.getReviewCardsForUser,
  getSpacedRepetitionProgress: flashcardRepo.getSpacedRepetitionProgress,
  async updateCardRepetitionProgress(...args: Parameters<typeof flashcardRepo.updateCardRepetitionProgress>): Promise<Awaited<ReturnType<typeof flashcardRepo.updateCardRepetitionProgress>>> {
    const result = await flashcardRepo.updateCardRepetitionProgress(...args);
    await eventBus.emit({ name: "flashcards.updateCardRepetitionProgress", feature: "flashcards", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
};

export type FlashcardsService = typeof flashcardsService;
