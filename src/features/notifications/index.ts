// Auto-generated barrel: re-exports all repositories for the notifications feature.
export * from "./repositories/notification.repository";

// Components
export { NotificationsClient } from "./components/notifications-client";

// Services
export { notificationsService } from "./services/notifications.service";
export type { NotificationsService } from "./services/notifications.service";

// Permissions
export { canNotifications as canNotifications, assertNotificationsAccess } from "./permissions/notifications.permissions";

// Contracts
export { createNotificationsSchema, updateNotificationsSchema, listNotificationsQuerySchema } from "./contracts/notifications.contract";
export type { CreateNotificationsInput, UpdateNotificationsInput, ListNotificationsQuery } from "./contracts/notifications.contract";

// Hooks
export {  useNotificationsList, useNotificationsDetail, useNotificationsCreate, useNotificationsUpdate, useNotificationsDelete } from "./hooks/use-notifications";

