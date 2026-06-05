// Auto-generated barrel: re-exports all repositories for the wishlist feature.
export * from "./repositories/wishlist.repository";

// Services
export { wishlistService } from "./services/wishlist.service";
export type { WishlistService } from "./services/wishlist.service";

// Permissions
export { canWishlist as canWishlist, assertWishlistAccess } from "./permissions/wishlist.permissions";

// Contracts
export { createWishlistSchema, updateWishlistSchema, listWishlistQuerySchema } from "./contracts/wishlist.contract";
export type { CreateWishlistInput, UpdateWishlistInput, ListWishlistQuery } from "./contracts/wishlist.contract";

// Hooks
export {  useWishlistList, useWishlistDetail, useWishlistCreate, useWishlistUpdate, useWishlistDelete } from "./hooks/use-wishlist";

