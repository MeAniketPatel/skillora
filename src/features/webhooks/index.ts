// Auto-generated barrel: re-exports all repositories for the webhooks feature.
export * from "./repositories/webhook.repository";

// Services
export { webhooksService } from "./services/webhooks.service";
export type { WebhooksService } from "./services/webhooks.service";

// Permissions
export { canWebhooks as canWebhooks, assertWebhooksAccess } from "./permissions/webhooks.permissions";

// Contracts
export { createWebhooksSchema, updateWebhooksSchema, listWebhooksQuerySchema } from "./contracts/webhooks.contract";
export type { CreateWebhooksInput, UpdateWebhooksInput, ListWebhooksQuery } from "./contracts/webhooks.contract";

// Hooks
export {  useWebhooksList, useWebhooksDetail, useWebhooksCreate, useWebhooksUpdate, useWebhooksDelete } from "./hooks/use-webhooks";

