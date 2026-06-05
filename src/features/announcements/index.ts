// Auto-generated barrel: re-exports all repositories for the announcements feature.

// Permissions
export { canAnnouncements as canAnnouncements, assertAnnouncementsAccess } from "./permissions/announcements.permissions";




// Contracts
export { announcementSchema } from "./contracts/announcement.contract";
export { createAnnouncementsSchema, updateAnnouncementsSchema, listAnnouncementsQuerySchema } from "./contracts/announcements.contract";
export type { CreateAnnouncementsInput, UpdateAnnouncementsInput } from "./contracts/announcements.contract";

// Hooks
export { useAnnouncements } from "./hooks/use-announcements";


export { createGlobalAnnouncement, deleteGlobalAnnouncement, createAnnouncement, deleteAnnouncement } from "./actions/announcement.actions";
