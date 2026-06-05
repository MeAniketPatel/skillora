// Stub service for the cart feature. This feature has no
// data-access layer of its own; it composes state from other features.
import { eventBus } from "@/shared/events";

export const cartService = {} as const;

export type CartService = typeof cartService;
