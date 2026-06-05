// Stub service for the code-playground feature. This feature has no
// data-access layer of its own; it composes state from other features.
import { eventBus } from "@/shared/events";

export const codePlaygroundService = {} as const;

export type CodePlaygroundService = typeof codePlaygroundService;
