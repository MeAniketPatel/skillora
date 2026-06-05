// Auto-generated barrel: re-exports all repositories for the subscriptions feature.
export * from "./repositories/subscription.repository";

// Services
export { subscriptionsService } from "./services/subscriptions.service";
export type { SubscriptionsService } from "./services/subscriptions.service";

// Permissions
export { canSubscriptions as canSubscriptions, assertSubscriptionsAccess } from "./permissions/subscriptions.permissions";

// Contracts
export { createSubscriptionsSchema, updateSubscriptionsSchema, listSubscriptionsQuerySchema } from "./contracts/subscriptions.contract";
export type { CreateSubscriptionsInput, UpdateSubscriptionsInput, ListSubscriptionsQuery } from "./contracts/subscriptions.contract";

// Hooks
export {  useSubscriptionsList, useSubscriptionsDetail, useSubscriptionsCreate, useSubscriptionsUpdate, useSubscriptionsDelete } from "./hooks/use-subscriptions";

