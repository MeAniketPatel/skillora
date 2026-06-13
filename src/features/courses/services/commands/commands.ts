import { eventBus } from "@/shared/events";
import * as courseRepo from "../../repositories/course.repository";
import * as lessonRepo from "../../repositories/lesson.repository";
import * as sectionRepo from "../../repositories/section.repository";
import { NotFoundError, ValidationError } from "@/shared/lib/errors";

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
  const result = await lessonRepo.reorderLessons(sectionId, items);
  await eventBus.emit({ name: "courses.reorderLessons", feature: "courses", payload: { result, args: [sectionId, items] }, occurredAt: new Date() } as any);
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
  const result = await sectionRepo.reorderSections(courseId, items);
  await eventBus.emit({ name: "courses.reorderSections", feature: "courses", payload: { result, args: [courseId, items] }, occurredAt: new Date() } as any);
  return result;
}

export async function publishCourse(courseId: string, teacherId: string): Promise<any> {
  const course = await courseRepo.getCourseForPublishing(courseId, teacherId);
  if (!course) throw new NotFoundError("Course");

  const hasPublishedLessons = course.sections.some((s: any) =>
    s.lessons.some((l: any) => l.isPublished)
  );

  const missingFields: string[] = [];
  if (!course.title) missingFields.push("title");
  if (!course.description) missingFields.push("description");
  if (!course.thumbnail) missingFields.push("thumbnail");
  if (!course.categoryId) missingFields.push("categoryId");

  if (missingFields.length || !hasPublishedLessons) {
    throw new ValidationError(`Cannot publish: Missing ${missingFields.join(", ")} or published lessons`);
  }

  const result = await courseRepo.updateCourse(courseId, { status: "PUBLISHED", publishedAt: new Date() });
  await eventBus.emit({ name: "courses.publishCourse", feature: "courses", payload: { result, args: { courseId, teacherId } }, occurredAt: new Date() } as any);
  return result;
}
