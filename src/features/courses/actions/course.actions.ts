"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireTeacher } from "@/shared/lib/auth-helpers";
import { triggerWebhook } from "@/lib/webhook-sender";
import {
  courseCreateSchema,
  courseUpdateSchema,
  CourseCreateInput,
  CourseUpdateInput,
} from "@/features/courses/contracts/course.contract";
import { service as coursesService } from "@/features/courses/server";
import { service as attachmentsService } from "@/features/attachments/server";
import { assertAttachmentsAccess } from "@/features/attachments/server";
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

    const course = await coursesService.createCourse({
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

    await coursesService.getCourseByIdForOwner(courseId, user.id);

    const updated = await coursesService.updateCourse(courseId, validated);

    revalidatePath(`/teacher/courses/${courseId}`);
    return updated;
  });
}

export async function publishCourse(courseId: string) {
  return actionHandler(async () => {
    const user = await requireTeacher();
    const course = await coursesService.getCourseForPublishing(courseId, user.id);

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

    const updated = await coursesService.updateCourse(courseId, { status: "PUBLISHED", publishedAt: new Date() });
    
    try {
      await triggerWebhook("course.published", {
        courseId: updated.id,
        title: updated.title,
        slug: updated.slug,
        price: updated.price,
        teacherId: updated.teacherId,
        publishedAt: updated.publishedAt,
      });
    } catch (whErr) {
      console.error("Failed to trigger webhook on course publish:", whErr);
    }

    revalidatePath(`/teacher/courses/${courseId}`);
    return updated;
  });
}

export async function unpublishCourse(courseId: string) {
  return actionHandler(async () => {
    const user = await requireTeacher();
    await coursesService.getCourseByIdForOwner(courseId, user.id);

    const updated = await coursesService.updateCourse(courseId, { status: "DRAFT" });
    revalidatePath(`/teacher/courses/${courseId}`);
    return updated;
  });
}

export async function createSection(courseId: string, title: string) {
  return actionHandler(async () => {
    const user = await requireTeacher();
    await coursesService.getCourseByIdForOwner(courseId, user.id);

    const section = await coursesService.createSection(courseId, title);
    revalidatePath(`/teacher/courses/${courseId}/curriculum`);
    return section;
  });
}

export async function updateSection(courseId: string, sectionId: string, title: string) {
  return actionHandler(async () => {
    const user = await requireTeacher();
    await coursesService.getCourseByIdForOwner(courseId, user.id);

    const section = await coursesService.updateSection(sectionId, courseId, { title });
    revalidatePath(`/teacher/courses/${courseId}/curriculum`);
    return section;
  });
}

export async function deleteSection(courseId: string, sectionId: string) {
  return actionHandler(async () => {
    const user = await requireTeacher();
    await coursesService.getCourseByIdForOwner(courseId, user.id);

    await coursesService.deleteSection(sectionId, courseId);
    revalidatePath(`/teacher/courses/${courseId}/curriculum`);
    return true;
  });
}

export async function createLesson(courseId: string, sectionId: string, title: string) {
  return actionHandler(async () => {
    const user = await requireTeacher();
    await coursesService.getCourseByIdForOwner(courseId, user.id);

    const lesson = await coursesService.createLesson(sectionId, title);
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
    await coursesService.getCourseByIdForOwner(courseId, user.id);

    const updated = await coursesService.updateLesson(lessonId, sectionId, values);
    revalidatePath(`/teacher/courses/${courseId}/curriculum`);
    return updated;
  });
}

export async function deleteLesson(courseId: string, sectionId: string, lessonId: string) {
  return actionHandler(async () => {
    const user = await requireTeacher();
    await coursesService.getCourseByIdForOwner(courseId, user.id);

    await coursesService.deleteLesson(lessonId, sectionId);
    revalidatePath(`/teacher/courses/${courseId}/curriculum`);
    return true;
  });
}

export async function reorderSections(courseId: string, items: { id: string; position: number }[]) {
  return actionHandler(async () => {
    const user = await requireTeacher();
    await coursesService.getCourseByIdForOwner(courseId, user.id);

    await coursesService.reorderSections(courseId, items);
    revalidatePath(`/teacher/courses/${courseId}/curriculum`);
    return true;
  });
}

export async function reorderLessons(courseId: string, sectionId: string, items: { id: string; position: number }[]) {
  return actionHandler(async () => {
    const user = await requireTeacher();
    await coursesService.getCourseByIdForOwner(courseId, user.id);

    await coursesService.reorderLessons(sectionId, items);
    revalidatePath(`/teacher/courses/${courseId}/curriculum`);
    return true;
  });
}

export async function createAttachment(courseId: string, lessonId: string, name: string, url: string, size?: number, type?: string) {
  return actionHandler(async () => {
    const user = await requireTeacher();
    await coursesService.getCourseByIdForOwner(courseId, user.id);

    const attachment = await attachmentsService.createAttachment({ name, url, size, type, lessonId });
    revalidatePath(`/teacher/courses/${courseId}/curriculum`);
    return attachment;
  });
}

export async function deleteAttachment(courseId: string, lessonId: string, attachmentId: string) {
  return actionHandler(async () => {
    const user = await requireTeacher();
    await coursesService.getCourseByIdForOwner(courseId, user.id);

    await attachmentsService.deleteAttachment(attachmentId, lessonId);
    revalidatePath(`/teacher/courses/${courseId}/curriculum`);
    return true;
  });
}
