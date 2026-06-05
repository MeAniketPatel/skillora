// Auto-generated barrel: re-exports all repositories for the notifications feature.

// Components
export { NotificationsClient } from "./components/notifications-client";

// Permissions
export { canNotifications as canNotifications, assertNotificationsAccess } from "./permissions/notifications.permissions";




// Contracts
export { createNotificationsSchema, updateNotificationsSchema, listNotificationsQuerySchema } from "./contracts/notifications.contract";
export type { CreateNotificationsInput, UpdateNotificationsInput } from "./contracts/notifications.contract";



// Hooks
export { useNotifications } from "./hooks/use-notifications";
