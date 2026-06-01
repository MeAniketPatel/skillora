"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import db from "@/lib/prisma";
import { auth } from "@/auth";

// Schema validations
const courseCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  categoryId: z.string().min(1, "Category is required"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"]),
});

const courseUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  thumbnail: z.string().url().optional().or(z.literal("")),
  price: z.number().min(0).optional(),
  categoryId: z.string().optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"]).optional(),
});

// Helper to verify teacher auth
async function requireTeacher() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function createCourse(values: z.infer<typeof courseCreateSchema>) {
  try {
    const user = await requireTeacher();
    const validated = courseCreateSchema.parse(values);

    // Create unique slug
    const baseSlug = validated.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const slug = `${baseSlug}-${randomSuffix}`;

    const course = await db.course.create({
      data: {
        ...validated,
        slug,
        teacherId: user.id,
      },
    });

    return { success: true, data: course };
  } catch (error: any) {
    console.error("[CREATE_COURSE_ERROR]", error);
    return { error: error.message || "Something went wrong" };
  }
}

export async function updateCourse(courseId: string, values: z.infer<typeof courseUpdateSchema>) {
  try {
    const user = await requireTeacher();
    const validated = courseUpdateSchema.parse(values);

    const course = await db.course.findUnique({
      where: { id: courseId, teacherId: user.id },
    });

    if (!course) {
      return { error: "Course not found" };
    }

    const updated = await db.course.update({
      where: { id: courseId },
      data: validated,
    });

    revalidatePath(`/teacher/courses/${courseId}`);
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("[UPDATE_COURSE_ERROR]", error);
    return { error: error.message || "Something went wrong" };
  }
}

export async function publishCourse(courseId: string) {
  try {
    const user = await requireTeacher();

    const course = await db.course.findUnique({
      where: { id: courseId, teacherId: user.id },
      include: {
        sections: {
          include: {
            lessons: true,
          },
        },
      },
    });

    if (!course) {
      return { error: "Course not found" };
    }

    const hasPublishedLessons = course.sections.some((s) =>
      s.lessons.some((l) => l.isPublished)
    );

    if (!course.title || !course.description || !course.thumbnail || !course.categoryId || !hasPublishedLessons) {
      return { error: "Missing required fields or published lessons." };
    }

    const updated = await db.course.update({
      where: { id: courseId },
      data: { status: "PUBLISHED", publishedAt: new Date() },
    });

    revalidatePath(`/teacher/courses/${courseId}`);
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("[PUBLISH_COURSE_ERROR]", error);
    return { error: error.message || "Something went wrong" };
  }
}

export async function unpublishCourse(courseId: string) {
  try {
    const user = await requireTeacher();

    const updated = await db.course.update({
      where: { id: courseId, teacherId: user.id },
      data: { status: "DRAFT" },
    });

    revalidatePath(`/teacher/courses/${courseId}`);
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("[UNPUBLISH_COURSE_ERROR]", error);
    return { error: error.message || "Something went wrong" };
  }
}

export async function createSection(courseId: string, title: string) {
  try {
    const user = await requireTeacher();

    const courseOwner = await db.course.findUnique({
      where: { id: courseId, teacherId: user.id },
    });

    if (!courseOwner) {
      return { error: "Unauthorized" };
    }

    const lastSection = await db.section.findFirst({
      where: { courseId },
      orderBy: { position: "desc" },
    });

    const newPosition = lastSection ? lastSection.position + 1 : 1;

    const section = await db.section.create({
      data: {
        title,
        courseId,
        position: newPosition,
      },
    });

    revalidatePath(`/teacher/courses/${courseId}/curriculum`);
    return { success: true, data: section };
  } catch (error: any) {
    console.error("[CREATE_SECTION_ERROR]", error);
    return { error: error.message || "Something went wrong" };
  }
}

export async function updateSection(courseId: string, sectionId: string, title: string) {
  try {
    const user = await requireTeacher();

    const courseOwner = await db.course.findUnique({
      where: { id: courseId, teacherId: user.id },
    });

    if (!courseOwner) {
      return { error: "Unauthorized" };
    }

    const section = await db.section.update({
      where: { id: sectionId, courseId },
      data: { title },
    });

    revalidatePath(`/teacher/courses/${courseId}/curriculum`);
    return { success: true, data: section };
  } catch (error: any) {
    console.error("[UPDATE_SECTION_ERROR]", error);
    return { error: error.message || "Something went wrong" };
  }
}

export async function deleteSection(courseId: string, sectionId: string) {
  try {
    const user = await requireTeacher();

    const courseOwner = await db.course.findUnique({
      where: { id: courseId, teacherId: user.id },
    });

    if (!courseOwner) {
      return { error: "Unauthorized" };
    }

    await db.section.delete({
      where: { id: sectionId, courseId },
    });

    revalidatePath(`/teacher/courses/${courseId}/curriculum`);
    return { success: true };
  } catch (error: any) {
    console.error("[DELETE_SECTION_ERROR]", error);
    return { error: error.message || "Something went wrong" };
  }
}

export async function createLesson(courseId: string, sectionId: string, title: string) {
  try {
    const user = await requireTeacher();

    const courseOwner = await db.course.findUnique({
      where: { id: courseId, teacherId: user.id },
    });

    if (!courseOwner) {
      return { error: "Unauthorized" };
    }

    const lastLesson = await db.lesson.findFirst({
      where: { sectionId },
      orderBy: { position: "desc" },
    });

    const newPosition = lastLesson ? lastLesson.position + 1 : 1;

    const lesson = await db.lesson.create({
      data: {
        title,
        sectionId,
        position: newPosition,
        type: "ARTICLE",
      },
    });

    revalidatePath(`/teacher/courses/${courseId}/curriculum`);
    return { success: true, data: lesson };
  } catch (error: any) {
    console.error("[CREATE_LESSON_ERROR]", error);
    return { error: error.message || "Something went wrong" };
  }
}

export async function updateLesson(
  courseId: string,
  sectionId: string,
  lessonId: string,
  values: {
    title?: string;
    content?: string;
    isFree?: boolean;
    isPublished?: boolean;
  }
) {
  try {
    const user = await requireTeacher();

    const courseOwner = await db.course.findUnique({
      where: { id: courseId, teacherId: user.id },
    });

    if (!courseOwner) {
      return { error: "Unauthorized" };
    }

    const updated = await db.lesson.update({
      where: { id: lessonId, sectionId },
      data: values,
    });

    revalidatePath(`/teacher/courses/${courseId}/curriculum`);
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("[UPDATE_LESSON_ERROR]", error);
    return { error: error.message || "Something went wrong" };
  }
}

export async function deleteLesson(courseId: string, sectionId: string, lessonId: string) {
  try {
    const user = await requireTeacher();

    const courseOwner = await db.course.findUnique({
      where: { id: courseId, teacherId: user.id },
    });

    if (!courseOwner) {
      return { error: "Unauthorized" };
    }

    await db.lesson.delete({
      where: { id: lessonId, sectionId },
    });

    revalidatePath(`/teacher/courses/${courseId}/curriculum`);
    return { success: true };
  } catch (error: any) {
    console.error("[DELETE_LESSON_ERROR]", error);
    return { error: error.message || "Something went wrong" };
  }
}

export async function reorderSections(courseId: string, items: { id: string; position: number }[]) {
  try {
    const user = await requireTeacher();

    const courseOwner = await db.course.findUnique({
      where: { id: courseId, teacherId: user.id },
    });

    if (!courseOwner) {
      return { error: "Unauthorized" };
    }

    for (const item of items) {
      await db.section.update({
        where: { id: item.id, courseId },
        data: { position: item.position },
      });
    }

    revalidatePath(`/teacher/courses/${courseId}/curriculum`);
    return { success: true };
  } catch (error: any) {
    console.error("[REORDER_SECTIONS_ERROR]", error);
    return { error: error.message || "Something went wrong" };
  }
}

export async function reorderLessons(
  courseId: string,
  sectionId: string,
  items: { id: string; position: number }[]
) {
  try {
    const user = await requireTeacher();

    const courseOwner = await db.course.findUnique({
      where: { id: courseId, teacherId: user.id },
    });

    if (!courseOwner) {
      return { error: "Unauthorized" };
    }

    for (const item of items) {
      await db.lesson.update({
        where: { id: item.id, sectionId },
        data: { position: item.position },
      });
    }

    revalidatePath(`/teacher/courses/${courseId}/curriculum`);
    return { success: true };
  } catch (error: any) {
    console.error("[REORDER_LESSONS_ERROR]", error);
    return { error: error.message || "Something went wrong" };
  }
}
