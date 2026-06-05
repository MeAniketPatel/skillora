// Server-only barrel. Import this from server actions, route handlers,
// server components, and middleware. NEVER import from "use client" files.

// Repository functions
export { getUserWishlist, isWishlisted, toggleWishlist } from "./repositories/wishlist.repository";

// Service

// Service
import { wishlistService as service } from "./services/wishlist.service";
export { service };

export * from './index';
