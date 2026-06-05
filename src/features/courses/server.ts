// Server-only barrel. Import this from server actions, route handlers,
// server components, and middleware. NEVER import from "use client" files.

// Repository functions
export { getCourseById, getCoursesByIds, getCourseBySlug, getCourseByIdForOwner, getCourseWithCurriculum, getCourseWithFullDetails, getPublishedCourses, getTeacherCourses, createCourse, updateCourse, deleteCourse, requireCourseOwnership, getCoursesForAdmin, getCourseCount, getTeacherAnalyticsCourses, getCourseWithPublishedCurriculum, getCourseForPublishing, getCourseCountByStatus, getCourseCountByCategory, getTeacherPublishedCourses, getCourseInsights } from "./repositories/course.repository";
export { createLesson, updateLesson, deleteLesson, reorderLessons, getLessonWithContent, getLessonWithSection, getLessonWithCourse, getLearningLesson } from "./repositories/lesson.repository";
export { getLiveSessions, getLiveSessionById, createLiveSession, deleteLiveSession } from "./repositories/live-session.repository";
export { getPeerReviewConfig, upsertPeerReviewConfig, deletePeerReviewConfig } from "./repositories/peer-review.repository";
export { getQuizByLessonId, getQuizWithQuestions, createQuiz, updateQuizWithQuestions, getQuizAttempts, createQuizAttempt } from "./repositories/quiz.repository";
export { createResource, getCourseResources, deleteResource } from "./repositories/resource.repository";
export { createSection, updateSection, deleteSection, reorderSections } from "./repositories/section.repository";

// Service

// Service
import { coursesService as service } from "./services/courses.service";
export { service };

export { canCourses, assertCoursesAccess } from "./permissions/courses.permissions";

export * from './index';
