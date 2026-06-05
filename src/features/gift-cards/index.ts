// Auto-generated barrel: re-exports all repositories for the gift-cards feature.
export * from "./repositories/gift-card.repository";

// Services
export { giftCardsService } from "./services/gift-cards.service";
export type { GiftCardsService } from "./services/gift-cards.service";

// Permissions
export { canGiftCards as canGiftCards, assertGiftCardsAccess } from "./permissions/gift-cards.permissions";

// Contracts
export { createGiftCardsSchema, updateGiftCardsSchema, listGiftCardsQuerySchema } from "./contracts/gift-cards.contract";
export type { CreateGiftCardsInput, UpdateGiftCardsInput, ListGiftCardsQuery } from "./contracts/gift-cards.contract";

// Hooks
export {  useGiftCardsList, useGiftCardsDetail, useGiftCardsCreate, useGiftCardsUpdate, useGiftCardsDelete } from "./hooks/use-gift-cards";

