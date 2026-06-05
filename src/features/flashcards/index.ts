// Auto-generated barrel: re-exports all repositories for the flashcards feature.
export * from "./repositories/flashcard.repository";

// Components
export { DeckList } from "./components/deck-list";
export { FlashcardReviewer } from "./components/flashcard-reviewer";

// Services
export { flashcardsService } from "./services/flashcards.service";
export type { FlashcardsService } from "./services/flashcards.service";

// Permissions
export { canFlashcards as canFlashcards, assertFlashcardsAccess } from "./permissions/flashcards.permissions";
