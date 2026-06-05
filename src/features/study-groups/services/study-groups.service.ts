// Stub service for the study-groups feature. This feature has no
// data-access layer of its own; it composes state from other features.
import { eventBus } from "@/shared/events";

export const studyGroupsService = {} as const;

export type StudyGroupsService = typeof studyGroupsService;
