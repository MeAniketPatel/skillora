// Auto-generated service wrapper for the gift-cards feature.
// Delegates to the repositories by default (DI via default-param pattern
// per ADR-007). Mutation methods emit domain events on the in-process
// event bus for cross-feature side effects.
import { eventBus } from "@/shared/events";
import * as giftCardRepo from "../repositories/gift-card.repository";

export const giftCardsService = {
  async createGiftCard(...args: Parameters<typeof giftCardRepo.createGiftCard>): Promise<Awaited<ReturnType<typeof giftCardRepo.createGiftCard>>> {
    const result = await giftCardRepo.createGiftCard(...args);
    await eventBus.emit({ name: "gift-cards.createGiftCard", feature: "gift-cards", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async redeemGiftCard(...args: Parameters<typeof giftCardRepo.redeemGiftCard>): Promise<Awaited<ReturnType<typeof giftCardRepo.redeemGiftCard>>> {
    const result = await giftCardRepo.redeemGiftCard(...args);
    await eventBus.emit({ name: "gift-cards.redeemGiftCard", feature: "gift-cards", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
};

export type GiftCardsService = typeof giftCardsService;
