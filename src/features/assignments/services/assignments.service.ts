// Auto-generated service wrapper for the assignments feature.
// Delegates to the repositories by default (DI via default-param pattern
// per ADR-007). Mutation methods emit domain events on the in-process
// event bus for cross-feature side effects.
import { eventBus } from "@/shared/events";
import * as assignmentRepo from "../repositories/assignment.repository";

export const assignmentsService = {
  async submitAssignment(...args: Parameters<typeof assignmentRepo.submitAssignment>): Promise<Awaited<ReturnType<typeof assignmentRepo.submitAssignment>>> {
    const result = await assignmentRepo.submitAssignment(...args);
    await eventBus.emit({ name: "assignments.submitAssignment", feature: "assignments", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  getSubmission: assignmentRepo.getSubmission,
  getSubmissionsForLesson: assignmentRepo.getSubmissionsForLesson,
  gradeSubmission: assignmentRepo.gradeSubmission,
  getTeacherPendingSubmissions: assignmentRepo.getTeacherPendingSubmissions,
  getAllTeacherSubmissions: assignmentRepo.getAllTeacherSubmissions,
  getCourseSubmissions: assignmentRepo.getCourseSubmissions,
};

export type AssignmentsService = typeof assignmentsService;
