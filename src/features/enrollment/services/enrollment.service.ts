// Auto-generated service wrapper for the enrollment feature.
// Delegates to the repositories by default (DI via default-param pattern
// per ADR-007). Mutation methods emit domain events on the in-process
// event bus for cross-feature side effects.
import { eventBus } from "@/shared/events";
import * as enrollmentRepo from "../repositories/enrollment.repository";

export const enrollmentService = {
  getEnrollment: enrollmentRepo.getEnrollment,
  async createEnrollment(...args: Parameters<typeof enrollmentRepo.createEnrollment>): Promise<Awaited<ReturnType<typeof enrollmentRepo.createEnrollment>>> {
    const result = await enrollmentRepo.createEnrollment(...args);
    await eventBus.emit({ name: "enrollment.createEnrollment", feature: "enrollment", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  getUserEnrollments: enrollmentRepo.getUserEnrollments,
  getCourseEnrollments: enrollmentRepo.getCourseEnrollments,
  getEnrollmentWithProgress: enrollmentRepo.getEnrollmentWithProgress,
  getEnrollmentWithUserAndCourse: enrollmentRepo.getEnrollmentWithUserAndCourse,
  async updateEnrollmentProgress(...args: Parameters<typeof enrollmentRepo.updateEnrollmentProgress>): Promise<Awaited<ReturnType<typeof enrollmentRepo.updateEnrollmentProgress>>> {
    const result = await enrollmentRepo.updateEnrollmentProgress(...args);
    await eventBus.emit({ name: "enrollment.updateEnrollmentProgress", feature: "enrollment", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  getEnrollmentCount: enrollmentRepo.getEnrollmentCount,
  getTotalEnrollmentCount: enrollmentRepo.getTotalEnrollmentCount,
  getUserEnrollmentCount: enrollmentRepo.getUserEnrollmentCount,
  getResumeLessonId: enrollmentRepo.getResumeLessonId,
  getTeacherRecentEnrollments: enrollmentRepo.getTeacherRecentEnrollments,
  getTeacherStudentCount: enrollmentRepo.getTeacherStudentCount,
  getEnrolledStudentIds: enrollmentRepo.getEnrolledStudentIds,
  getEnrollmentTrends: enrollmentRepo.getEnrollmentTrends,
};

export type EnrollmentService = typeof enrollmentService;
