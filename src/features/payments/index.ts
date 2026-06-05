// Auto-generated barrel: re-exports all repositories for the payments feature.
export * from "./repositories/payment.repository";

// Services
export { paymentsService } from "./services/payments.service";
export type { PaymentsService } from "./services/payments.service";

// Permissions
export { canPayments as canPayments, assertPaymentsAccess } from "./permissions/payments.permissions";
