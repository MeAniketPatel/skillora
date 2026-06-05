// Auto-generated service wrapper for the subscriptions feature.
// Delegates to the repositories by default (DI via default-param pattern
// per ADR-007). Mutation methods emit domain events on the in-process
// event bus for cross-feature side effects.
import { eventBus } from "@/shared/events";
import * as subscriptionRepo from "../repositories/subscription.repository";

export const subscriptionsService = {
  getUserSubscription: subscriptionRepo.getUserSubscription,
  async createSubscription(...args: Parameters<typeof subscriptionRepo.createSubscription>): Promise<Awaited<ReturnType<typeof subscriptionRepo.createSubscription>>> {
    const result = await subscriptionRepo.createSubscription(...args);
    await eventBus.emit({ name: "subscriptions.createSubscription", feature: "subscriptions", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
};

export type SubscriptionsService = typeof subscriptionsService;
