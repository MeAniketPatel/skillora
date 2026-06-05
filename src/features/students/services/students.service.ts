// Auto-generated service wrapper for the students feature.
// Delegates to the repositories by default (DI via default-param pattern
// per ADR-007). Mutation methods emit domain events on the in-process
// event bus for cross-feature side effects.
import { eventBus } from "@/shared/events";
import db from "@/shared/lib/prisma";
import * as bookmarkRepo from "../repositories/bookmark.repository";
import * as collectionRepo from "../repositories/collection.repository";
import * as learningGoalRepo from "../repositories/learning-goal.repository";
import * as lessonProgressRepo from "../repositories/lesson-progress.repository";
import * as noteRepo from "../repositories/note.repository";
import * as streakRepo from "../repositories/streak.repository";

export const studentsService = {
  getUserBookmarks: bookmarkRepo.getUserBookmarks,
  isBookmarked: bookmarkRepo.isBookmarked,
  async toggleBookmark(...args: Parameters<typeof bookmarkRepo.toggleBookmark>): Promise<Awaited<ReturnType<typeof bookmarkRepo.toggleBookmark>>> {
    const result = await bookmarkRepo.toggleBookmark(...args);
    await eventBus.emit({ name: "students.toggleBookmark", feature: "students", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  getUserCollections: collectionRepo.getUserCollections,
  async createCollection(...args: Parameters<typeof collectionRepo.createCollection>): Promise<Awaited<ReturnType<typeof collectionRepo.createCollection>>> {
    const result = await collectionRepo.createCollection(...args);
    await eventBus.emit({ name: "students.createCollection", feature: "students", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async addCourseToCollection(...args: Parameters<typeof collectionRepo.addCourseToCollection>): Promise<Awaited<ReturnType<typeof collectionRepo.addCourseToCollection>>> {
    const result = await collectionRepo.addCourseToCollection(...args);
    await eventBus.emit({ name: "students.addCourseToCollection", feature: "students", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async removeCourseFromCollection(...args: Parameters<typeof collectionRepo.removeCourseFromCollection>): Promise<Awaited<ReturnType<typeof collectionRepo.removeCourseFromCollection>>> {
    const result = await collectionRepo.removeCourseFromCollection(...args);
    await eventBus.emit({ name: "students.removeCourseFromCollection", feature: "students", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async deleteCollection(...args: Parameters<typeof collectionRepo.deleteCollection>): Promise<Awaited<ReturnType<typeof collectionRepo.deleteCollection>>> {
    const result = await collectionRepo.deleteCollection(...args);
    await eventBus.emit({ name: "students.deleteCollection", feature: "students", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  getUserGoals: learningGoalRepo.getUserGoals,
  async createGoal(...args: Parameters<typeof learningGoalRepo.createGoal>): Promise<Awaited<ReturnType<typeof learningGoalRepo.createGoal>>> {
    const result = await learningGoalRepo.createGoal(...args);
    await eventBus.emit({ name: "students.createGoal", feature: "students", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async updateGoalProgress(...args: Parameters<typeof learningGoalRepo.updateGoalProgress>): Promise<Awaited<ReturnType<typeof learningGoalRepo.updateGoalProgress>>> {
    const result = await learningGoalRepo.updateGoalProgress(...args);
    await eventBus.emit({ name: "students.updateGoalProgress", feature: "students", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async deleteGoal(...args: Parameters<typeof learningGoalRepo.deleteGoal>): Promise<Awaited<ReturnType<typeof learningGoalRepo.deleteGoal>>> {
    const result = await learningGoalRepo.deleteGoal(...args);
    await eventBus.emit({ name: "students.deleteGoal", feature: "students", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async upsertLessonProgress(...args: Parameters<typeof lessonProgressRepo.upsertLessonProgress>): Promise<Awaited<ReturnType<typeof lessonProgressRepo.upsertLessonProgress>>> {
    const result = await lessonProgressRepo.upsertLessonProgress(...args);
    await eventBus.emit({ name: "students.upsertLessonProgress", feature: "students", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  initializeEnrollmentProgress: lessonProgressRepo.initializeEnrollmentProgress,
  getProgressForEnrollment: lessonProgressRepo.getProgressForEnrollment,
  calculateCourseProgress: lessonProgressRepo.calculateCourseProgress,
  getLessonProgress: lessonProgressRepo.getLessonProgress,
  getUserCompletedLessonsCount: lessonProgressRepo.getUserCompletedLessonsCount,
  async createNote(...args: Parameters<typeof noteRepo.createNote>): Promise<Awaited<ReturnType<typeof noteRepo.createNote>>> {
    const result = await noteRepo.createNote(...args);
    await eventBus.emit({ name: "students.createNote", feature: "students", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async updateNote(...args: Parameters<typeof noteRepo.updateNote>): Promise<Awaited<ReturnType<typeof noteRepo.updateNote>>> {
    const result = await noteRepo.updateNote(...args);
    await eventBus.emit({ name: "students.updateNote", feature: "students", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async deleteNote(...args: Parameters<typeof noteRepo.deleteNote>): Promise<Awaited<ReturnType<typeof noteRepo.deleteNote>>> {
    const result = await noteRepo.deleteNote(...args);
    await eventBus.emit({ name: "students.deleteNote", feature: "students", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  getNotesForLesson: noteRepo.getNotesForLesson,
  getAllUserNotes: noteRepo.getAllUserNotes,
  getStudyStreak: streakRepo.getStudyStreak,
  getStudySessions: streakRepo.getStudySessions,
  async recordStudySession(...args: Parameters<typeof streakRepo.recordStudySession>): Promise<Awaited<ReturnType<typeof streakRepo.recordStudySession>>> {
    const result = await streakRepo.recordStudySession(...args);
    await eventBus.emit({ name: "students.recordStudySession", feature: "students", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async buyStreakFreeze(userId: string, costPoints = 100): Promise<any> {
    const result = await db.$transaction(async (tx) => {
      return streakRepo.buyStreakFreeze(userId, costPoints, tx);
    });
    await eventBus.emit({ name: "students.buyStreakFreeze", feature: "students", payload: { result, args: [userId, costPoints] }, occurredAt: new Date() } as any);
    return result;
  },
};

export type StudentsService = typeof studentsService;
