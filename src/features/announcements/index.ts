// Auto-generated barrel: re-exports all repositories for the announcements feature.

// Permissions
export { canAnnouncements as canAnnouncements, assertAnnouncementsAccess } from "./permissions/announcements.permissions";

// Contracts
export { createAnnouncementsSchema, updateAnnouncementsSchema, listAnnouncementsQuerySchema } from "./contracts/announcements.contract";
export type { CreateAnnouncementsInput, UpdateAnnouncementsInput, ListAnnouncementsQuery } from "./contracts/announcements.contract";

// Hooks
export {  useAnnouncementsList, useAnnouncementsDetail, useAnnouncementsCreate, useAnnouncementsUpdate, useAnnouncementsDelete } from "./hooks/use-announcements";

