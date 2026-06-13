export {
  getCourseById,
  getCoursesByIds,
  getCourseBySlug,
  getCourseByIdForOwner,
  getCourseWithCurriculum,
  getCourseWithFullDetails,
  getPublishedCourses,
  getTeacherCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  requireCourseOwnership,
  getCoursesForAdmin,
  getCourseCount,
  getTeacherAnalyticsCourses,
  getCourseWithPublishedCurriculum,
  getCourseForPublishing,
  getCourseCountByStatus,
  getCourseCountByCategory,
  getTeacherPublishedCourses,
  getCourseInsights,
} from "./repositories/course.repository";
export {
  createLesson,
  updateLesson,
  deleteLesson,
  reorderLessons,
  getLessonWithContent,
  getLessonWithSection,
  getLessonWithCourse,
  getLearningLesson,
} from "./repositories/lesson.repository";

export {
  createSection,
  updateSection,
  deleteSection,
  reorderSections,
} from "./repositories/section.repository";

import { coursesService as service } from "./services/courses.service";
export { service };

export { canCourses, assertCoursesAccess } from "./permissions/courses.permissions";

export {
  courseCreateSchema,
  courseUpdateSchema,
  sectionCreateSchema,
  lessonUpdateSchema,
} from "./contracts/course.contract";
export type {
  CourseCreateInput,
  CourseUpdateInput,
  SectionCreateInput,
  LessonUpdateInput,
} from "./contracts/course.contract";
export {
  createCoursesSchema,
  updateCoursesSchema,
  listCoursesQuerySchema,
} from "./contracts/courses.contract";
export type {
  CreateCoursesInput,
  UpdateCoursesInput,
  ListCoursesQuery,
} from "./contracts/courses.contract";
