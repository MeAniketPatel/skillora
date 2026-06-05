// Server-only barrel. Import this from server actions, route handlers,
// server components, and middleware. NEVER import from "use client" files.

// Repository functions
export { submitAssignment, getSubmission, getSubmissionsForLesson, gradeSubmission, getTeacherPendingSubmissions, getAllTeacherSubmissions, getCourseSubmissions } from "./repositories/assignment.repository";

// Service

// Service
import { assignmentsService as service } from "./services/assignments.service";
export { service };
