// Server-only barrel. Import this from server actions, route handlers,
// server components, and middleware. NEVER import from "use client" files.

// Repository functions
export { getUserBookmarks, isBookmarked, toggleBookmark } from "./repositories/bookmark.repository";
export { getUserCollections, createCollection, addCourseToCollection, removeCourseFromCollection, deleteCollection } from "./repositories/collection.repository";
export { getUserGoals, createGoal, updateGoalProgress, deleteGoal } from "./repositories/learning-goal.repository";
export { upsertLessonProgress, initializeEnrollmentProgress, getProgressForEnrollment, calculateCourseProgress, getLessonProgress, getUserCompletedLessonsCount } from "./repositories/lesson-progress.repository";
export { createNote, updateNote, deleteNote, getNotesForLesson, getAllUserNotes } from "./repositories/note.repository";
export { getStudyStreak, getStudySessions, recordStudySession, buyStreakFreeze } from "./repositories/streak.repository";
