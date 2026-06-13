import { eventBus } from "@/shared/events";
import * as notificationRepo from "../repositories/notification.repository";

export const notificationsService = {
  async createNotification(...args: Parameters<typeof notificationRepo.createNotification>): Promise<Awaited<ReturnType<typeof notificationRepo.createNotification>>> {
    const result = await notificationRepo.createNotification(...args);
    await eventBus.emit({ name: "notifications.createNotification", feature: "notifications", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  getUserNotifications: notificationRepo.getUserNotifications,
  async markAsRead(...args: Parameters<typeof notificationRepo.markAsRead>): Promise<Awaited<ReturnType<typeof notificationRepo.markAsRead>>> {
    const result = await notificationRepo.markAsRead(...args);
    await eventBus.emit({ name: "notifications.markAsRead", feature: "notifications", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async markAllAsRead(...args: Parameters<typeof notificationRepo.markAllAsRead>): Promise<Awaited<ReturnType<typeof notificationRepo.markAllAsRead>>> {
    const result = await notificationRepo.markAllAsRead(...args);
    await eventBus.emit({ name: "notifications.markAllAsRead", feature: "notifications", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  getUnreadCount: notificationRepo.getUnreadCount,
  async deleteNotification(...args: Parameters<typeof notificationRepo.deleteNotification>): Promise<Awaited<ReturnType<typeof notificationRepo.deleteNotification>>> {
    const result = await notificationRepo.deleteNotification(...args);
    await eventBus.emit({ name: "notifications.deleteNotification", feature: "notifications", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
};

export type NotificationsService = typeof notificationsService;
