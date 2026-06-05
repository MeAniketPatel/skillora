// Auto-generated barrel: re-exports all repositories for the assignments feature.

// Permissions
export { canAssignments as canAssignments, assertAssignmentsAccess } from "./permissions/assignments.permissions";




// Contracts
export { createAssignmentsSchema, updateAssignmentsSchema, listAssignmentsQuerySchema } from "./contracts/assignments.contract";
export type { CreateAssignmentsInput, UpdateAssignmentsInput } from "./contracts/assignments.contract";

export { getAllTeacherSubmissions, getCourseSubmissions, getSubmission } from "./server";

export { submitAssignment, gradeSubmission } from "./actions/assignment.actions";
