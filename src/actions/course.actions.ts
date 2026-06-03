"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/lib/action-utils";
import { requireTeacher } from "@/lib/auth-helpers";
import {
  courseCreateSchema,
  courseUpdateSchema,
  CourseCreateInput,
  CourseUpdateInput,
} from "@/validations/course.schema";
import {
  createCourse as createCourseData,
  updateCourse as updateCourseData,
  getCourseByIdForOwner,
  createSection as createSectionData,
  updateSection as updateSectionData,
  deleteSection as deleteSectionData,
  createLesson as createLessonData,
  updateLesson as updateLessonData,
  deleteLesson as deleteLessonData,
  reorderSections as reorderSectionsData,
  reorderLessons as reorderLessonsData,
} from "@/data";
import db from "@/lib/prisma"; // for attachments since we didn't make a DAL for attachment yet

export async function createCourse(values: CourseCreateInput) {
  return actionHandler(async () => {
    const user = await requireTeacher();
    const validated = courseCreateSchema.parse(values);

    const baseSlug = validated.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const slug = `${baseSlug}-${randomSuffix}`;

    const course = await createCourseData({
      ...validated,
      slug,
      teacherId: user.id,
    });

    return course;
  });
}

export async function updateCourse(courseId: string, values: CourseUpdateInput) {
  return actionHandler(async () => {
    const user = await requireTeacher();
    const validated = courseUpdateSchema.parse(values);

    await getCourseByIdForOwner(courseId, user.id);

    const updated = await updateCourseData(courseId, validated);

    revalidatePath(`/teacher/courses/${courseId}`);
    return updated;
  });
}

export async function publishCourse(courseId: string) {
  return actionHandler(async () => {
    const user = await requireTeacher();
    const course = await db.course.findUnique({
      where: { id: courseId, teacherId: user.id },
      include: { sections: { include: { lessons: true } } },
    });

    if (!course) throw new Error("Course not found");

    const hasPublishedLessons = course.sections.some((s) =>
      s.lessons.some((l) => l.isPublished)
    );

    const missingFields: string[] = [];
    if (!course.title) missingFields.push("title");
    if (!course.description) missingFields.push("description");
    if (!course.thumbnail) missingFields.push("thumbnail");
    if (!course.categoryId) missingFields.push("categoryId");

    if (missingFields.length || !hasPublishedLessons) {
      throw new Error(`Cannot publish: Missing ${missingFields.join(", ")} or published lessons`);
    }

    const updated = await updateCourseData(courseId, { status: "PUBLISHED", publishedAt: new Date() });
    revalidatePath(`/teacher/courses/${courseId}`);
    return updated;
  });
}

export async function unpublishCourse(courseId: string) {
  return actionHandler(async () => {
    const user = await requireTeacher();
    await getCourseByIdForOwner(courseId, user.id);

    const updated = await updateCourseData(courseId, { status: "DRAFT" });
    revalidatePath(`/teacher/courses/${courseId}`);
    return updated;
  });
}

export async function createSection(courseId: string, title: string) {
  return actionHandler(async () => {
    const user = await requireTeacher();
    await getCourseByIdForOwner(courseId, user.id);

    const section = await createSectionData(courseId, title);
    revalidatePath(`/teacher/courses/${courseId}/curriculum`);
    return section;
  });
}

export async function updateSection(courseId: string, sectionId: string, title: string) {
  return actionHandler(async () => {
    const user = await requireTeacher();
    await getCourseByIdForOwner(courseId, user.id);

    const section = await updateSectionData(sectionId, courseId, { title });
    revalidatePath(`/teacher/courses/${courseId}/curriculum`);
    return section;
  });
}

export async function deleteSection(courseId: string, sectionId: string) {
  return actionHandler(async () => {
    const user = await requireTeacher();
    await getCourseByIdForOwner(courseId, user.id);

    await deleteSectionData(sectionId, courseId);
    revalidatePath(`/teacher/courses/${courseId}/curriculum`);
    return true;
  });
}

export async function createLesson(courseId: string, sectionId: string, title: string) {
  return actionHandler(async () => {
    const user = await requireTeacher();
    await getCourseByIdForOwner(courseId, user.id);

    const lesson = await createLessonData(sectionId, title);
    revalidatePath(`/teacher/courses/${courseId}/curriculum`);
    return lesson;
  });
}

export async function updateLesson(
  courseId: string,
  sectionId: string,
  lessonId: string,
  values: any
) {
  return actionHandler(async () => {
    const user = await requireTeacher();
    await getCourseByIdForOwner(courseId, user.id);

    const updated = await updateLessonData(lessonId, sectionId, values);
    revalidatePath(`/teacher/courses/${courseId}/curriculum`);
    return updated;
  });
}

export async function deleteLesson(courseId: string, sectionId: string, lessonId: string) {
  return actionHandler(async () => {
    const user = await requireTeacher();
    await getCourseByIdForOwner(courseId, user.id);

    await deleteLessonData(lessonId, sectionId);
    revalidatePath(`/teacher/courses/${courseId}/curriculum`);
    return true;
  });
}

export async function reorderSections(courseId: string, items: { id: string; position: number }[]) {
  return actionHandler(async () => {
    const user = await requireTeacher();
    await getCourseByIdForOwner(courseId, user.id);

    await reorderSectionsData(courseId, items);
    revalidatePath(`/teacher/courses/${courseId}/curriculum`);
    return true;
  });
}

export async function reorderLessons(courseId: string, sectionId: string, items: { id: string; position: number }[]) {
  return actionHandler(async () => {
    const user = await requireTeacher();
    await getCourseByIdForOwner(courseId, user.id);

    await reorderLessonsData(sectionId, items);
    revalidatePath(`/teacher/courses/${courseId}/curriculum`);
    return true;
  });
}

export async function createAttachment(courseId: string, lessonId: string, name: string, url: string, size?: number, type?: string) {
  return actionHandler(async () => {
    const user = await requireTeacher();
    await getCourseByIdForOwner(courseId, user.id);

    const attachment = await db.attachment.create({
      data: { name, url, size, type, lessonId },
    });
    revalidatePath(`/teacher/courses/${courseId}/curriculum`);
    return attachment;
  });
}

export async function deleteAttachment(courseId: string, lessonId: string, attachmentId: string) {
  return actionHandler(async () => {
    const user = await requireTeacher();
    await getCourseByIdForOwner(courseId, user.id);

    await db.attachment.delete({
      where: { id: attachmentId, lessonId },
    });
    revalidatePath(`/teacher/courses/${courseId}/curriculum`);
    return true;
  });
}
