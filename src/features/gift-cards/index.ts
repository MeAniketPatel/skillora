// Auto-generated barrel: re-exports all repositories for the gift-cards feature.

// Permissions
export { canGiftCards as canGiftCards, assertGiftCardsAccess } from "./permissions/gift-cards.permissions";

// Contracts
export { createGiftCardsSchema, updateGiftCardsSchema, listGiftCardsQuerySchema } from "./contracts/gift-cards.contract";
export type { CreateGiftCardsInput, UpdateGiftCardsInput, ListGiftCardsQuery } from "./contracts/gift-cards.contract";

