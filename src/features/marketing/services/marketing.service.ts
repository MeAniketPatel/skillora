// Stub service for the marketing feature. This feature has no
// data-access layer of its own; it composes state from other features.
import { eventBus } from "@/shared/events";

export const marketingService = {} as const;

export type MarketingService = typeof marketingService;
