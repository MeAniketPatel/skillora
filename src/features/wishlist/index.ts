// Auto-generated barrel: re-exports all repositories for the wishlist feature.

// Permissions
export { canWishlist as canWishlist, assertWishlistAccess } from "./permissions/wishlist.permissions";




// Contracts
export { createWishlistSchema, updateWishlistSchema, listWishlistQuerySchema } from "./contracts/wishlist.contract";
export type { CreateWishlistInput, UpdateWishlistInput } from "./contracts/wishlist.contract";



export { toggleWishlist } from "./actions/wishlist.actions";
