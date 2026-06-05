// Server-only barrel. Import this from server actions, route handlers,
// server components, and middleware. NEVER import from "use client" files.

// Repository functions
export { getWebhooks, getWebhookById, getActiveWebhooksByEvent, createWebhook, deleteWebhook, logWebhookDelivery } from "./repositories/webhook.repository";

// Service

// Service
import { webhooksService as service } from "./services/webhooks.service";
export { service };
