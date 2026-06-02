"use server";

import { revalidatePath } from "next/cache";
import db from "@/lib/prisma";
import { auth } from "@/auth";

export async function enrollInFreeCourse(courseId: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "You must be logged in to enroll." };
    }

    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        sections: {
          include: {
            lessons: {
              where: { isPublished: true },
            },
          },
        },
      },
    });

    if (!course) {
      return { error: "Course not found." };
    }

    if (course.price !== 0 && course.price !== null) {
      return { error: "This is a paid course. Enrollment requires payment." };
    }

    const existingEnrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return { error: "You are already enrolled in this course." };
    }

    // Create enrollment
    const enrollment = await db.enrollment.create({
      data: {
        userId: session.user.id,
        courseId,
      },
    });

    // Pre-create lesson progress for all published lessons
    const lessons = course.sections.flatMap((s) => s.lessons);
    if (lessons.length > 0) {
      await db.lessonProgress.createMany({
        data: lessons.map((lesson) => ({
          enrollmentId: enrollment.id,
          lessonId: lesson.id,
          isCompleted: false,
        })),
      });
    }

    revalidatePath(`/student/courses`);
    revalidatePath(`/courses/${course.slug}`);
    return { success: true, data: enrollment };
  } catch (error: any) {
    console.error("[ENROLL_FREE_COURSE_ERROR]", error);
    return { error: error.message || "Something went wrong" };
  }
}

export async function toggleLessonCompletion(
  courseId: string,
  lessonId: string,
  isCompleted: boolean
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
    });

    if (!enrollment) {
      return { error: "Enrollment not found." };
    }

    // Update or upsert lesson progress
    await db.lessonProgress.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId,
        },
      },
      update: {
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
      create: {
        enrollmentId: enrollment.id,
        lessonId,
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
    });

    // Calculate new overall progress
    const totalLessons = await db.lesson.count({
      where: {
        section: {
          courseId,
        },
        isPublished: true,
      },
    });

    const completedLessons = await db.lessonProgress.count({
      where: {
        enrollmentId: enrollment.id,
        isCompleted: true,
      },
    });

    const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    await db.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progress,
        completedAt: progress === 100 ? new Date() : null,
      },
    });

    revalidatePath(`/student/courses`);
    revalidatePath(`/learn/${courseId}/${lessonId}`);
    return { success: true, progress };
  } catch (error: any) {
    console.error("[TOGGLE_LESSON_COMPLETION_ERROR]", error);
    return { error: error.message || "Something went wrong" };
  }
}

export async function updateVideoProgress(
  courseId: string,
  lessonId: string,
  videoPosition: number
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
    });

    if (!enrollment) {
      return { error: "Enrollment not found." };
    }

    await db.lessonProgress.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId,
        },
      },
      update: {
        videoPosition,
      },
      create: {
        enrollmentId: enrollment.id,
        lessonId,
        videoPosition,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("[UPDATE_VIDEO_PROGRESS_ERROR]", error);
    return { error: error.message || "Something went wrong" };
  }
}

