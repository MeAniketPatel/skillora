export { submitAssignment, getSubmission, getSubmissionById, getSubmissionsForLesson, gradeSubmission, getTeacherPendingSubmissions, getAllTeacherSubmissions, getCourseSubmissions } from "./repositories/assignment.repository";

import { assignmentsService as service } from "./services/assignments.service";
export { service };

