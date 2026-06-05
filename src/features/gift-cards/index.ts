// Auto-generated barrel: re-exports all repositories for the gift-cards feature.
export * from "./repositories/gift-card.repository";

// Services
export { giftCardsService } from "./services/gift-cards.service";
export type { GiftCardsService } from "./services/gift-cards.service";

// Permissions
export { canGiftCards as canGiftCards, assertGiftCardsAccess } from "./permissions/gift-cards.permissions";
