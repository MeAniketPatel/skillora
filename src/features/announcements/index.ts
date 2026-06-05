// Auto-generated barrel: re-exports all repositories for the announcements feature.
export * from "./repositories/announcement.repository";

// Services
export { announcementsService } from "./services/announcements.service";
export type { AnnouncementsService } from "./services/announcements.service";

// Permissions
export { canAnnouncements as canAnnouncements, assertAnnouncementsAccess } from "./permissions/announcements.permissions";
