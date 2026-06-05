// Server-only barrel. Import this from server actions, route handlers,
// server components, and middleware. NEVER import from "use client" files.

// Repository functions
export { createGiftCard, redeemGiftCard } from "./repositories/gift-card.repository";

// Service

// Service
import { giftCardsService as service } from "./services/gift-cards.service";
export { service };

export * from './index';
