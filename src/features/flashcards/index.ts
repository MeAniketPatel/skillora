// Auto-generated barrel: re-exports all repositories for the flashcards feature.

// Components
export { DeckList } from "./components/deck-list";
export { FlashcardReviewer } from "./components/flashcard-reviewer";

// Permissions
export { canFlashcards as canFlashcards, assertFlashcardsAccess } from "./permissions/flashcards.permissions";

// Contracts
export { createFlashcardsSchema, updateFlashcardsSchema, listFlashcardsQuerySchema } from "./contracts/flashcards.contract";
export type { CreateFlashcardsInput, UpdateFlashcardsInput, ListFlashcardsQuery } from "./contracts/flashcards.contract";

