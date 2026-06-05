// Auto-generated barrel: re-exports all repositories for the enrollment feature.

// Permissions
export { canEnrollment as canEnrollment, assertEnrollmentAccess } from "./permissions/enrollment.permissions";

// Contracts
export { createEnrollmentSchema, updateEnrollmentSchema, listEnrollmentQuerySchema } from "./contracts/enrollment.contract";
export type { CreateEnrollmentInput, UpdateEnrollmentInput, ListEnrollmentQuery } from "./contracts/enrollment.contract";

// Hooks
export {  useEnrollmentList, useEnrollmentDetail, useEnrollmentCreate, useEnrollmentUpdate, useEnrollmentDelete } from "./hooks/use-enrollment";

