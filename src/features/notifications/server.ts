// Server-only barrel. Import this from server actions, route handlers,
// server components, and middleware. NEVER import from "use client" files.

// Repository functions
export { createNotification, getUserNotifications, markAsRead, markAllAsRead, getUnreadCount, deleteNotification } from "./repositories/notification.repository";
