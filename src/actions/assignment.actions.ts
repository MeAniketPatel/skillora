"use server";

import db from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function submitAssignment(lessonId: string, content: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: {
        section: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!lesson) {
      return { error: "Lesson not found" };
    }

    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: lesson.section.courseId,
        },
      },
    });

    if (!enrollment) {
      return { error: "You are not enrolled in this course" };
    }

    // Upsert assignment submission
    const submission = await db.assignmentSubmission.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId,
        },
      },
      update: {
        content,
        status: "SUBMITTED",
        submittedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        lessonId,
        content,
        status: "SUBMITTED",
      },
    });

    // Auto mark lesson completion
    await db.lessonProgress.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId,
        },
      },
      update: {
        isCompleted: true,
        completedAt: new Date(),
      },
      create: {
        enrollmentId: enrollment.id,
        lessonId,
        isCompleted: true,
        completedAt: new Date(),
      },
    });

    // Notify teacher
    try {
      await db.notification.create({
        data: {
          userId: lesson.section.course.teacherId,
          type: "ASSIGNMENT_SUBMISSION",
          title: "New Assignment Submission 📝",
          message: `${session.user.name || session.user.email} submitted an assignment for "${lesson.title}"`,
          link: `/teacher/courses/${lesson.section.courseId}/assignments`,
        },
      });
    } catch (err) {
      console.error("Failed to notify teacher:", err);
    }

    revalidatePath(`/learn/${lesson.section.courseId}/${lessonId}`);
    return { success: true, submission };
  } catch (error) {
    console.error("Failed to submit assignment:", error);
    return { error: "Something went wrong" };
  }
}

export async function getLessonSubmissions(lessonId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
      return { error: "Unauthorized" };
    }

    const submissions = await db.assignmentSubmission.findMany({
      where: { lessonId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { submittedAt: "desc" },
    });

    return { submissions };
  } catch (error) {
    console.error("Failed to fetch submissions:", error);
    return { error: "Something went wrong" };
  }
}

export async function gradeSubmission(
  submissionId: string,
  score: number,
  feedback?: string
) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
      return { error: "Unauthorized" };
    }

    const submission = await db.assignmentSubmission.update({
      where: { id: submissionId },
      data: {
        score,
        feedback,
        status: "GRADED",
        gradedAt: new Date(),
      },
      include: {
        lesson: {
          include: {
            section: true,
          },
        },
      },
    });

    // Notify student
    try {
      await db.notification.create({
        data: {
          userId: submission.userId,
          type: "ASSIGNMENT_GRADED",
          title: "Assignment Graded! 📝",
          message: `Your submission for "${submission.lesson.title}" was graded: ${score}/100.`,
          link: `/learn/${submission.lesson.section.courseId}/${submission.lessonId}`,
        },
      });
    } catch (err) {
      console.error("Failed to notify student:", err);
    }

    revalidatePath(`/learn/${submission.lesson.section.courseId}/${submission.lessonId}`);
    return { success: true, submission };
  } catch (error) {
    console.error("Failed to grade submission:", error);
    return { error: "Something went wrong" };
  }
}
