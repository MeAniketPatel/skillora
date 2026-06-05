// Stub service for the learn feature. This feature has no
// data-access layer of its own; it composes state from other features.
import { eventBus } from "@/shared/events";

export const learnService = {} as const;

export type LearnService = typeof learnService;
