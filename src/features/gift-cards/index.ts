// Auto-generated barrel: re-exports all repositories for the gift-cards feature.

// Permissions
export { canGiftCards as canGiftCards, assertGiftCardsAccess } from "./permissions/gift-cards.permissions";




// Contracts
export { purchaseGiftCardSchema, redeemGiftCardSchema } from "./contracts/gift-card.contract";
export { createGiftCardsSchema, updateGiftCardsSchema, listGiftCardsQuerySchema } from "./contracts/gift-cards.contract";
export type { CreateGiftCardsInput, UpdateGiftCardsInput } from "./contracts/gift-cards.contract";
