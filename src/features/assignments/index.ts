// Auto-generated barrel: re-exports all repositories for the assignments feature.
export * from "./repositories/assignment.repository";

// Services
export { assignmentsService } from "./services/assignments.service";
export type { AssignmentsService } from "./services/assignments.service";

// Permissions
export { canAssignments as canAssignments, assertAssignmentsAccess } from "./permissions/assignments.permissions";

// Contracts
export { createAssignmentsSchema, updateAssignmentsSchema, listAssignmentsQuerySchema } from "./contracts/assignments.contract";
export type { CreateAssignmentsInput, UpdateAssignmentsInput, ListAssignmentsQuery } from "./contracts/assignments.contract";

// Hooks
export {  useAssignmentsList, useAssignmentsDetail, useAssignmentsCreate, useAssignmentsUpdate, useAssignmentsDelete } from "./hooks/use-assignments";

