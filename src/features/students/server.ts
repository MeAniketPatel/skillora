// Server-only barrel. Import this from server actions, route handlers,
// server components, and middleware. NEVER import from "use client" files.
// Client components (cards, forms, widgets) must be imported from "@/features/students".

// Repository functions
export { getUserBookmarks, isBookmarked, toggleBookmark } from "./repositories/bookmark.repository";
export { getUserCollections, createCollection, addCourseToCollection, removeCourseFromCollection, deleteCollection } from "./repositories/collection.repository";
export { getUserGoals, createGoal, updateGoalProgress, deleteGoal } from "./repositories/learning-goal.repository";
export { upsertLessonProgress, initializeEnrollmentProgress, getProgressForEnrollment, calculateCourseProgress, getLessonProgress, getUserCompletedLessonsCount } from "./repositories/lesson-progress.repository";
export { createNote, updateNote, deleteNote, getNotesForLesson, getAllUserNotes } from "./repositories/note.repository";
export { getStudyStreak, getStudySessions, recordStudySession, buyStreakFreeze } from "./repositories/streak.repository";

// Service
import { studentsService as service } from "./services/students.service";
export { service };

// Permissions (server-safe pure functions)
export * from "./permissions/students.permissions";

// Contracts (schemas + types — safe in both contexts)
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
