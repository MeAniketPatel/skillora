// Auto-generated service wrapper for the courses feature.
// Delegates to the repositories by default (DI via default-param pattern
// per ADR-007). Mutation methods emit domain events on the in-process
// event bus for cross-feature side effects.
import { eventBus } from "@/shared/events";
import * as courseRepo from "../repositories/course.repository";
import * as lessonRepo from "../repositories/lesson.repository";
import * as liveSessionRepo from "../repositories/live-session.repository";
import * as peerReviewRepo from "../repositories/peer-review.repository";
import * as quizRepo from "../repositories/quiz.repository";
import * as resourceRepo from "../repositories/resource.repository";
import * as sectionRepo from "../repositories/section.repository";

export const coursesService = {
  getCourseById: courseRepo.getCourseById,
  getCoursesByIds: courseRepo.getCoursesByIds,
  getCourseBySlug: courseRepo.getCourseBySlug,
  getCourseByIdForOwner: courseRepo.getCourseByIdForOwner,
  getCourseWithCurriculum: courseRepo.getCourseWithCurriculum,
  getCourseWithFullDetails: courseRepo.getCourseWithFullDetails,
  getPublishedCourses: courseRepo.getPublishedCourses,
  getTeacherCourses: courseRepo.getTeacherCourses,
  async createCourse(...args: Parameters<typeof courseRepo.createCourse>): Promise<Awaited<ReturnType<typeof courseRepo.createCourse>>> {
    const result = await courseRepo.createCourse(...args);
    await eventBus.emit({ name: "courses.createCourse", feature: "courses", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async updateCourse(...args: Parameters<typeof courseRepo.updateCourse>): Promise<Awaited<ReturnType<typeof courseRepo.updateCourse>>> {
    const result = await courseRepo.updateCourse(...args);
    await eventBus.emit({ name: "courses.updateCourse", feature: "courses", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async deleteCourse(...args: Parameters<typeof courseRepo.deleteCourse>): Promise<Awaited<ReturnType<typeof courseRepo.deleteCourse>>> {
    const result = await courseRepo.deleteCourse(...args);
    await eventBus.emit({ name: "courses.deleteCourse", feature: "courses", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  requireCourseOwnership: courseRepo.requireCourseOwnership,
  getCoursesForAdmin: courseRepo.getCoursesForAdmin,
  getCourseCount: courseRepo.getCourseCount,
  getTeacherAnalyticsCourses: courseRepo.getTeacherAnalyticsCourses,
  getCourseWithPublishedCurriculum: courseRepo.getCourseWithPublishedCurriculum,
  getCourseForPublishing: courseRepo.getCourseForPublishing,
  getCourseCountByStatus: courseRepo.getCourseCountByStatus,
  getCourseCountByCategory: courseRepo.getCourseCountByCategory,
  getTeacherPublishedCourses: courseRepo.getTeacherPublishedCourses,
  getCourseInsights: courseRepo.getCourseInsights,
  async createLesson(...args: Parameters<typeof lessonRepo.createLesson>): Promise<Awaited<ReturnType<typeof lessonRepo.createLesson>>> {
    const result = await lessonRepo.createLesson(...args);
    await eventBus.emit({ name: "courses.createLesson", feature: "courses", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async updateLesson(...args: Parameters<typeof lessonRepo.updateLesson>): Promise<Awaited<ReturnType<typeof lessonRepo.updateLesson>>> {
    const result = await lessonRepo.updateLesson(...args);
    await eventBus.emit({ name: "courses.updateLesson", feature: "courses", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async deleteLesson(...args: Parameters<typeof lessonRepo.deleteLesson>): Promise<Awaited<ReturnType<typeof lessonRepo.deleteLesson>>> {
    const result = await lessonRepo.deleteLesson(...args);
    await eventBus.emit({ name: "courses.deleteLesson", feature: "courses", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  reorderLessons: lessonRepo.reorderLessons,
  getLessonWithContent: lessonRepo.getLessonWithContent,
  getLessonWithSection: lessonRepo.getLessonWithSection,
  getLessonWithCourse: lessonRepo.getLessonWithCourse,
  getLearningLesson: lessonRepo.getLearningLesson,
  getLiveSessions: liveSessionRepo.getLiveSessions,
  getLiveSessionById: liveSessionRepo.getLiveSessionById,
  async createLiveSession(...args: Parameters<typeof liveSessionRepo.createLiveSession>): Promise<Awaited<ReturnType<typeof liveSessionRepo.createLiveSession>>> {
    const result = await liveSessionRepo.createLiveSession(...args);
    await eventBus.emit({ name: "courses.createLiveSession", feature: "courses", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async deleteLiveSession(...args: Parameters<typeof liveSessionRepo.deleteLiveSession>): Promise<Awaited<ReturnType<typeof liveSessionRepo.deleteLiveSession>>> {
    const result = await liveSessionRepo.deleteLiveSession(...args);
    await eventBus.emit({ name: "courses.deleteLiveSession", feature: "courses", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  getPeerReviewConfig: peerReviewRepo.getPeerReviewConfig,
  async upsertPeerReviewConfig(...args: Parameters<typeof peerReviewRepo.upsertPeerReviewConfig>): Promise<Awaited<ReturnType<typeof peerReviewRepo.upsertPeerReviewConfig>>> {
    const result = await peerReviewRepo.upsertPeerReviewConfig(...args);
    await eventBus.emit({ name: "courses.upsertPeerReviewConfig", feature: "courses", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async deletePeerReviewConfig(...args: Parameters<typeof peerReviewRepo.deletePeerReviewConfig>): Promise<Awaited<ReturnType<typeof peerReviewRepo.deletePeerReviewConfig>>> {
    const result = await peerReviewRepo.deletePeerReviewConfig(...args);
    await eventBus.emit({ name: "courses.deletePeerReviewConfig", feature: "courses", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  getQuizByLessonId: quizRepo.getQuizByLessonId,
  getQuizWithQuestions: quizRepo.getQuizWithQuestions,
  async createQuiz(...args: Parameters<typeof quizRepo.createQuiz>): Promise<Awaited<ReturnType<typeof quizRepo.createQuiz>>> {
    const result = await quizRepo.createQuiz(...args);
    await eventBus.emit({ name: "courses.createQuiz", feature: "courses", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async updateQuizWithQuestions(...args: Parameters<typeof quizRepo.updateQuizWithQuestions>): Promise<Awaited<ReturnType<typeof quizRepo.updateQuizWithQuestions>>> {
    const result = await quizRepo.updateQuizWithQuestions(...args);
    await eventBus.emit({ name: "courses.updateQuizWithQuestions", feature: "courses", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  getQuizAttempts: quizRepo.getQuizAttempts,
  async createQuizAttempt(...args: Parameters<typeof quizRepo.createQuizAttempt>): Promise<Awaited<ReturnType<typeof quizRepo.createQuizAttempt>>> {
    const result = await quizRepo.createQuizAttempt(...args);
    await eventBus.emit({ name: "courses.createQuizAttempt", feature: "courses", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async createResource(...args: Parameters<typeof resourceRepo.createResource>): Promise<Awaited<ReturnType<typeof resourceRepo.createResource>>> {
    const result = await resourceRepo.createResource(...args);
    await eventBus.emit({ name: "courses.createResource", feature: "courses", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  getCourseResources: resourceRepo.getCourseResources,
  async deleteResource(...args: Parameters<typeof resourceRepo.deleteResource>): Promise<Awaited<ReturnType<typeof resourceRepo.deleteResource>>> {
    const result = await resourceRepo.deleteResource(...args);
    await eventBus.emit({ name: "courses.deleteResource", feature: "courses", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async createSection(...args: Parameters<typeof sectionRepo.createSection>): Promise<Awaited<ReturnType<typeof sectionRepo.createSection>>> {
    const result = await sectionRepo.createSection(...args);
    await eventBus.emit({ name: "courses.createSection", feature: "courses", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async updateSection(...args: Parameters<typeof sectionRepo.updateSection>): Promise<Awaited<ReturnType<typeof sectionRepo.updateSection>>> {
    const result = await sectionRepo.updateSection(...args);
    await eventBus.emit({ name: "courses.updateSection", feature: "courses", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async deleteSection(...args: Parameters<typeof sectionRepo.deleteSection>): Promise<Awaited<ReturnType<typeof sectionRepo.deleteSection>>> {
    const result = await sectionRepo.deleteSection(...args);
    await eventBus.emit({ name: "courses.deleteSection", feature: "courses", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  reorderSections: sectionRepo.reorderSections,
};

export type CoursesService = typeof coursesService;
