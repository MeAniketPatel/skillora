// Auto-generated barrel: re-exports all repositories for the webhooks feature.

// Permissions
export { canWebhooks as canWebhooks, assertWebhooksAccess } from "./permissions/webhooks.permissions";




// Contracts
export { webhookSchema } from "./contracts/webhook.contract";
export type { WebhookInput } from "./contracts/webhook.contract";
export { createWebhooksSchema, updateWebhooksSchema, listWebhooksQuerySchema } from "./contracts/webhooks.contract";
export type { CreateWebhooksInput, UpdateWebhooksInput } from "./contracts/webhooks.contract";

