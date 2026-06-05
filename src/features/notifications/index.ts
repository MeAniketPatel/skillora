// Auto-generated barrel: re-exports all repositories for the notifications feature.
export * from "./repositories/notification.repository";

// Components
export { NotificationsClient } from "./components/notifications-client";

// Services
export { notificationsService } from "./services/notifications.service";
export type { NotificationsService } from "./services/notifications.service";

// Permissions
export { canNotifications as canNotifications, assertNotificationsAccess } from "./permissions/notifications.permissions";
