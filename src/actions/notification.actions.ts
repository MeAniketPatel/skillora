"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { getUserNotifications, markAsRead, markAllAsRead, createNotification as createNotificationData } from "@/features/notifications/server";
export async function getNotifications() {
  return actionHandler(async () => {
    const user = await requireAuth();
    const notifications = await getUserNotifications(user.id, {});
    return notifications;
  });
}

export async function markNotificationAsRead(id: string) {
  return actionHandler(async () => {
    const user = await requireAuth();
    await markAsRead(id, user.id);
    revalidatePath("/dashboard");
    return true;
  });
}

export async function markAllNotificationsAsRead() {
  return actionHandler(async () => {
    const user = await requireAuth();
    await markAllAsRead(user.id);
    revalidatePath("/dashboard");
    return true;
  });
}

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
  link?: string
) {
  return actionHandler(async () => {
    const notification = await createNotificationData(userId, type, title, message, link);
    return notification;
  });
}
