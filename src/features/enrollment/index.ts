// Auto-generated barrel: re-exports all repositories for the enrollment feature.
export * from "./repositories/enrollment.repository";

// Services
export { enrollmentService } from "./services/enrollment.service";
export type { EnrollmentService } from "./services/enrollment.service";

// Permissions
export { canEnrollment as canEnrollment, assertEnrollmentAccess } from "./permissions/enrollment.permissions";
