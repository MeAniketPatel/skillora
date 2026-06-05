// Server-only barrel. Import this from server actions, route handlers,
// server components, and middleware. NEVER import from "use client" files.

// Repository functions
export { createDeck, addCardToDeck, getDecksForUser, getDeckDetails, getReviewCardsForUser, getSpacedRepetitionProgress, updateCardRepetitionProgress } from "./repositories/flashcard.repository";

// Service

// Service
import { flashcardsService as service } from "./services/flashcards.service";
export { service };

export * from './index';
