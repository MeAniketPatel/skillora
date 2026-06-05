// Auto-generated barrel: re-exports all repositories for the enrollment feature.

// Permissions
export { canEnrollment as canEnrollment, assertEnrollmentAccess } from "./permissions/enrollment.permissions";




// Contracts
export { createEnrollmentSchema, updateEnrollmentSchema, listEnrollmentQuerySchema } from "./contracts/enrollment.contract";
export type { CreateEnrollmentInput, UpdateEnrollmentInput } from "./contracts/enrollment.contract";

export { getTotalEnrollmentCount, getEnrollmentTrends, getUserEnrollments, getUserEnrollmentCount, getResumeLessonId, getCourseEnrollments, getTeacherStudentCount, getTeacherRecentEnrollments, getEnrollment, getEnrollmentWithProgress, service } from "./server";

export { enrollInFreeCourse, toggleLessonCompletion, updateVideoProgress } from "./actions/enrollment.actions";
