import { eventBus } from "@/shared/events";
import db from "@/shared/lib/prisma";
import * as courseRepo from "../../repositories/course.repository";
import * as lessonRepo from "../../repositories/lesson.repository";
import * as liveSessionRepo from "../../repositories/live-session.repository";
import * as peerReviewRepo from "../../repositories/peer-review.repository";
import * as quizRepo from "../../repositories/quiz.repository";
import * as resourceRepo from "../../repositories/resource.repository";
import * as sectionRepo from "../../repositories/section.repository";

export async function createCourse(...args: Parameters<typeof courseRepo.createCourse>): Promise<Awaited<ReturnType<typeof courseRepo.createCourse>>> {
  const result = await courseRepo.createCourse(...args);
  await eventBus.emit({ name: "courses.createCourse", feature: "courses", payload: { result, args }, occurredAt: new Date() } as any);
  return result;
}

export async function updateCourse(...args: Parameters<typeof courseRepo.updateCourse>): Promise<Awaited<ReturnType<typeof courseRepo.updateCourse>>> {
  const result = await courseRepo.updateCourse(...args);
  await eventBus.emit({ name: "courses.updateCourse", feature: "courses", payload: { result, args }, occurredAt: new Date() } as any);
  return result;
}

export async function deleteCourse(...args: Parameters<typeof courseRepo.deleteCourse>): Promise<Awaited<ReturnType<typeof courseRepo.deleteCourse>>> {
  const result = await courseRepo.deleteCourse(...args);
  await eventBus.emit({ name: "courses.deleteCourse", feature: "courses", payload: { result, args }, occurredAt: new Date() } as any);
  return result;
}

export async function createLesson(...args: Parameters<typeof lessonRepo.createLesson>): Promise<Awaited<ReturnType<typeof lessonRepo.createLesson>>> {
  const result = await lessonRepo.createLesson(...args);
  await eventBus.emit({ name: "courses.createLesson", feature: "courses", payload: { result, args }, occurredAt: new Date() } as any);
  return result;
}

export async function updateLesson(...args: Parameters<typeof lessonRepo.updateLesson>): Promise<Awaited<ReturnType<typeof lessonRepo.updateLesson>>> {
  const result = await lessonRepo.updateLesson(...args);
  await eventBus.emit({ name: "courses.updateLesson", feature: "courses", payload: { result, args }, occurredAt: new Date() } as any);
  return result;
}

export async function deleteLesson(...args: Parameters<typeof lessonRepo.deleteLesson>): Promise<Awaited<ReturnType<typeof lessonRepo.deleteLesson>>> {
  const result = await lessonRepo.deleteLesson(...args);
  await eventBus.emit({ name: "courses.deleteLesson", feature: "courses", payload: { result, args }, occurredAt: new Date() } as any);
  return result;
}

export async function reorderLessons(sectionId: string, items: { id: string; position: number }[]): Promise<any> {
  const result = await db.$transaction(async (tx) => {
    return lessonRepo.reorderLessons(sectionId, items, tx);
  });
  await eventBus.emit({ name: "courses.reorderLessons", feature: "courses", payload: { result, args: [sectionId, items] }, occurredAt: new Date() } as any);
  return result;
}

export async function createLiveSession(...args: Parameters<typeof liveSessionRepo.createLiveSession>): Promise<Awaited<ReturnType<typeof liveSessionRepo.createLiveSession>>> {
  const result = await liveSessionRepo.createLiveSession(...args);
  await eventBus.emit({ name: "courses.createLiveSession", feature: "courses", payload: { result, args }, occurredAt: new Date() } as any);
  return result;
}

export async function deleteLiveSession(...args: Parameters<typeof liveSessionRepo.deleteLiveSession>): Promise<Awaited<ReturnType<typeof liveSessionRepo.deleteLiveSession>>> {
  const result = await liveSessionRepo.deleteLiveSession(...args);
  await eventBus.emit({ name: "courses.deleteLiveSession", feature: "courses", payload: { result, args }, occurredAt: new Date() } as any);
  return result;
}

export async function upsertPeerReviewConfig(...args: Parameters<typeof peerReviewRepo.upsertPeerReviewConfig>): Promise<Awaited<ReturnType<typeof peerReviewRepo.upsertPeerReviewConfig>>> {
  const result = await peerReviewRepo.upsertPeerReviewConfig(...args);
  await eventBus.emit({ name: "courses.upsertPeerReviewConfig", feature: "courses", payload: { result, args }, occurredAt: new Date() } as any);
  return result;
}

export async function deletePeerReviewConfig(...args: Parameters<typeof peerReviewRepo.deletePeerReviewConfig>): Promise<Awaited<ReturnType<typeof peerReviewRepo.deletePeerReviewConfig>>> {
  const result = await peerReviewRepo.deletePeerReviewConfig(...args);
  await eventBus.emit({ name: "courses.deletePeerReviewConfig", feature: "courses", payload: { result, args }, occurredAt: new Date() } as any);
  return result;
}

export async function createQuiz(...args: Parameters<typeof quizRepo.createQuiz>): Promise<Awaited<ReturnType<typeof quizRepo.createQuiz>>> {
  const result = await quizRepo.createQuiz(...args);
  await eventBus.emit({ name: "courses.createQuiz", feature: "courses", payload: { result, args }, occurredAt: new Date() } as any);
  return result;
}

export async function updateQuizWithQuestions(quizId: string, data: any, questions: any[]): Promise<any> {
  const result = await db.$transaction(async (tx) => {
    return quizRepo.updateQuizWithQuestions(quizId, data, questions, tx);
  });
  await eventBus.emit({ name: "courses.updateQuizWithQuestions", feature: "courses", payload: { result, args: [quizId, data, questions] }, occurredAt: new Date() } as any);
  return result;
}

export async function createQuizAttempt(...args: Parameters<typeof quizRepo.createQuizAttempt>): Promise<Awaited<ReturnType<typeof quizRepo.createQuizAttempt>>> {
  const result = await quizRepo.createQuizAttempt(...args);
  await eventBus.emit({ name: "courses.createQuizAttempt", feature: "courses", payload: { result, args }, occurredAt: new Date() } as any);
  return result;
}

export async function createResource(...args: Parameters<typeof resourceRepo.createResource>): Promise<Awaited<ReturnType<typeof resourceRepo.createResource>>> {
  const result = await resourceRepo.createResource(...args);
  await eventBus.emit({ name: "courses.createResource", feature: "courses", payload: { result, args }, occurredAt: new Date() } as any);
  return result;
}

export async function deleteResource(...args: Parameters<typeof resourceRepo.deleteResource>): Promise<Awaited<ReturnType<typeof resourceRepo.deleteResource>>> {
  const result = await resourceRepo.deleteResource(...args);
  await eventBus.emit({ name: "courses.deleteResource", feature: "courses", payload: { result, args }, occurredAt: new Date() } as any);
  return result;
}

export async function createSection(...args: Parameters<typeof sectionRepo.createSection>): Promise<Awaited<ReturnType<typeof sectionRepo.createSection>>> {
  const result = await sectionRepo.createSection(...args);
  await eventBus.emit({ name: "courses.createSection", feature: "courses", payload: { result, args }, occurredAt: new Date() } as any);
  return result;
}

export async function updateSection(...args: Parameters<typeof sectionRepo.updateSection>): Promise<Awaited<ReturnType<typeof sectionRepo.updateSection>>> {
  const result = await sectionRepo.updateSection(...args);
  await eventBus.emit({ name: "courses.updateSection", feature: "courses", payload: { result, args }, occurredAt: new Date() } as any);
  return result;
}

export async function deleteSection(...args: Parameters<typeof sectionRepo.deleteSection>): Promise<Awaited<ReturnType<typeof sectionRepo.deleteSection>>> {
  const result = await sectionRepo.deleteSection(...args);
  await eventBus.emit({ name: "courses.deleteSection", feature: "courses", payload: { result, args }, occurredAt: new Date() } as any);
  return result;
}

export async function reorderSections(courseId: string, items: { id: string; position: number }[]): Promise<any> {
  const result = await db.$transaction(async (tx) => {
    return sectionRepo.reorderSections(courseId, items, tx);
  });
  await eventBus.emit({ name: "courses.reorderSections", feature: "courses", payload: { result, args: [courseId, items] }, occurredAt: new Date() } as any);
  return result;
}
