import * as courseRepo from "../../repositories/course.repository";
import * as lessonRepo from "../../repositories/lesson.repository";

export const getCourseById = courseRepo.getCourseById;
export const getCoursesByIds = courseRepo.getCoursesByIds;
export const getCourseBySlug = courseRepo.getCourseBySlug;
export const getCourseByIdForOwner = courseRepo.getCourseByIdForOwner;
export const getCourseWithCurriculum = courseRepo.getCourseWithCurriculum;
export const getCourseWithFullDetails = courseRepo.getCourseWithFullDetails;
export const getPublishedCourses = courseRepo.getPublishedCourses;
export const getTeacherCourses = courseRepo.getTeacherCourses;
export const requireCourseOwnership = courseRepo.requireCourseOwnership;
export const getCoursesForAdmin = courseRepo.getCoursesForAdmin;
export const getCourseCount = courseRepo.getCourseCount;
export const getTeacherAnalyticsCourses = courseRepo.getTeacherAnalyticsCourses;
export const getCourseWithPublishedCurriculum = courseRepo.getCourseWithPublishedCurriculum;
export const getCourseForPublishing = courseRepo.getCourseForPublishing;
export const getCourseCountByStatus = courseRepo.getCourseCountByStatus;
export const getCourseCountByCategory = courseRepo.getCourseCountByCategory;
export const getTeacherPublishedCourses = courseRepo.getTeacherPublishedCourses;
export const getCourseInsights = courseRepo.getCourseInsights;

export const getLessonWithContent = lessonRepo.getLessonWithContent;
export const getLessonWithSection = lessonRepo.getLessonWithSection;
export const getLessonWithCourse = lessonRepo.getLessonWithCourse;
export const getLearningLesson = lessonRepo.getLearningLesson;
