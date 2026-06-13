export { getUserBookmarks, isBookmarked, toggleBookmark } from "./repositories/bookmark.repository";
export { getUserCollections, createCollection, addCourseToCollection, removeCourseFromCollection, deleteCollection } from "./repositories/collection.repository";
export { getUserGoals, createGoal, updateGoalProgress, deleteGoal } from "./repositories/learning-goal.repository";
export { upsertLessonProgress, initializeEnrollmentProgress, getProgressForEnrollment, calculateCourseProgress, getLessonProgress, getUserCompletedLessonsCount } from "./repositories/lesson-progress.repository";
export { createNote, updateNote, deleteNote, getNotesForLesson, getAllUserNotes } from "./repositories/note.repository";
export { getStudyStreak, getStudySessions, recordStudySession, buyStreakFreeze } from "./repositories/streak.repository";

import { studentsService as service } from "./services/students.service";
export { service };

export * from "./permissions/students.permissions";

export {
  createStudentsSchema,
  updateStudentsSchema,
  listStudentsQuerySchema,
} from "./contracts/students.contract";
export type {
  CreateStudentsInput,
  UpdateStudentsInput,
  ListStudentsQuery,
} from "./contracts/students.contract";
