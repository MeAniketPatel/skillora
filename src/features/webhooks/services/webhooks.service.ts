// Auto-generated service wrapper for the webhooks feature.
// Delegates to the repositories by default (DI via default-param pattern
// per ADR-007). Mutation methods emit domain events on the in-process
// event bus for cross-feature side effects.
import { eventBus } from "@/shared/events";
import * as webhookRepo from "../repositories/webhook.repository";

export const webhooksService = {
  getWebhooks: webhookRepo.getWebhooks,
  getWebhookById: webhookRepo.getWebhookById,
  getActiveWebhooksByEvent: webhookRepo.getActiveWebhooksByEvent,
  async createWebhook(...args: Parameters<typeof webhookRepo.createWebhook>): Promise<Awaited<ReturnType<typeof webhookRepo.createWebhook>>> {
    const result = await webhookRepo.createWebhook(...args);
    await eventBus.emit({ name: "webhooks.createWebhook", feature: "webhooks", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async deleteWebhook(...args: Parameters<typeof webhookRepo.deleteWebhook>): Promise<Awaited<ReturnType<typeof webhookRepo.deleteWebhook>>> {
    const result = await webhookRepo.deleteWebhook(...args);
    await eventBus.emit({ name: "webhooks.deleteWebhook", feature: "webhooks", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async logWebhookDelivery(...args: Parameters<typeof webhookRepo.logWebhookDelivery>): Promise<Awaited<ReturnType<typeof webhookRepo.logWebhookDelivery>>> {
    const result = await webhookRepo.logWebhookDelivery(...args);
    await eventBus.emit({ name: "webhooks.logWebhookDelivery", feature: "webhooks", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
};

export type WebhooksService = typeof webhooksService;
