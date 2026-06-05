// Auto-generated service wrapper for the announcements feature.
// Delegates to the repositories by default (DI via default-param pattern
// per ADR-007). Mutation methods emit domain events on the in-process
// event bus for cross-feature side effects.
import { eventBus } from "@/shared/events";
import * as announcementRepo from "../repositories/announcement.repository";

export const announcementsService = {
  getAnnouncementsByCourseId: announcementRepo.getAnnouncementsByCourseId,
  async createAnnouncement(...args: Parameters<typeof announcementRepo.createAnnouncement>): Promise<Awaited<ReturnType<typeof announcementRepo.createAnnouncement>>> {
    const result = await announcementRepo.createAnnouncement(...args);
    await eventBus.emit({ name: "announcements.createAnnouncement", feature: "announcements", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  getAnnouncementById: announcementRepo.getAnnouncementById,
  async deleteAnnouncement(...args: Parameters<typeof announcementRepo.deleteAnnouncement>): Promise<Awaited<ReturnType<typeof announcementRepo.deleteAnnouncement>>> {
    const result = await announcementRepo.deleteAnnouncement(...args);
    await eventBus.emit({ name: "announcements.deleteAnnouncement", feature: "announcements", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  getGlobalAnnouncements: announcementRepo.getGlobalAnnouncements,
};

export type AnnouncementsService = typeof announcementsService;
