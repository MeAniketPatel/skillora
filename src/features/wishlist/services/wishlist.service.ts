// Auto-generated service wrapper for the wishlist feature.
// Delegates to the repositories by default (DI via default-param pattern
// per ADR-007). Mutation methods emit domain events on the in-process
// event bus for cross-feature side effects.
import { eventBus } from "@/shared/events";
import * as wishlistRepo from "../repositories/wishlist.repository";

export const wishlistService = {
  getUserWishlist: wishlistRepo.getUserWishlist,
  isWishlisted: wishlistRepo.isWishlisted,
  async toggleWishlist(...args: Parameters<typeof wishlistRepo.toggleWishlist>): Promise<Awaited<ReturnType<typeof wishlistRepo.toggleWishlist>>> {
    const result = await wishlistRepo.toggleWishlist(...args);
    await eventBus.emit({ name: "wishlist.toggleWishlist", feature: "wishlist", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
};

export type WishlistService = typeof wishlistService;
