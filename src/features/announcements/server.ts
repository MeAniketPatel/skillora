// Server-only barrel. Import this from server actions, route handlers,
// server components, and middleware. NEVER import from "use client" files.

// Repository functions
export { getAnnouncementsByCourseId, createAnnouncement, getAnnouncementById, deleteAnnouncement, getGlobalAnnouncements } from "./repositories/announcement.repository";

// Service

// Service
import { announcementsService as service } from "./services/announcements.service";
export { service };

export * from './index';
