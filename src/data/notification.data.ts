import db from "@/lib/prisma";

export async function createNotification(userId: string, type: string, title: string, message: string, link?: string) {
  return db.notification.create({
    data: { userId, type, title, message, link },
  });
}

export async function getUserNotifications(userId: string, params: { limit?: number; unreadOnly?: boolean }) {
  const where: any = { userId };
  if (params.unreadOnly) where.isRead = false;

  return db.notification.findMany({
    where,
    take: params.limit,
    orderBy: { createdAt: "desc" },
  });
}

export async function markAsRead(notificationId: string, userId: string) {
  return db.notification.update({
    where: { id: notificationId, userId },
    data: { isRead: true },
  });
}

export async function markAllAsRead(userId: string) {
  return db.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
}

export async function getUnreadCount(userId: string) {
  return db.notification.count({
    where: { userId, isRead: false },
  });
}

export async function deleteNotification(notificationId: string, userId: string) {
  return db.notification.delete({
    where: { id: notificationId, userId },
  });
}
