// Auto-generated barrel: re-exports all repositories for the webhooks feature.

// Permissions
export { canWebhooks as canWebhooks, assertWebhooksAccess } from "./permissions/webhooks.permissions";

// Contracts
export { createWebhooksSchema, updateWebhooksSchema, listWebhooksQuerySchema } from "./contracts/webhooks.contract";
export type { CreateWebhooksInput, UpdateWebhooksInput, ListWebhooksQuery } from "./contracts/webhooks.contract";

