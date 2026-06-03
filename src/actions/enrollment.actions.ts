"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/lib/action-utils";
import { requireAuth } from "@/lib/auth-helpers";
import { ConflictError, NotFoundError, ValidationError } from "@/lib/errors";
import {
  getCourseWithCurriculum,
  getEnrollment,
  createEnrollment as createEnrollmentData,
  upsertLessonProgress,
  calculateCourseProgress,
  updateEnrollmentProgress,
  createCertificate,
  createNotification
} from "@/data";
import db from "@/lib/prisma";

export async function enrollInFreeCourse(courseId: string) {
  return actionHandler(async () => {
    const user = await requireAuth();

    const course = await getCourseWithCurriculum(courseId);
    if (!course) throw new NotFoundError("Course");

    if (course.price !== 0 && course.price !== null) {
      throw new ValidationError("This is a paid course. Enrollment requires payment.");
    }

    const existingEnrollment = await getEnrollment(user.id, courseId);
    if (existingEnrollment) {
      throw new ConflictError("You are already enrolled in this course.");
    }

    const enrollment = await createEnrollmentData(user.id, courseId);

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

    try {
      await createNotification(
        user.id,
        "ENROLLMENT",
        "Successfully Enrolled! 🎓",
        `You have successfully enrolled in "${course.title}". Start learning now!`,
        `/learn/${courseId}/${lessons[0]?.id || ""}`
      );
    } catch (err) {
      console.error("Failed to create enrollment notification:", err);
    }

    revalidatePath(`/student/courses`);
    revalidatePath(`/courses/${course.slug}`);
    return enrollment;
  });
}

export async function toggleLessonCompletion(
  courseId: string,
  lessonId: string,
  isCompleted: boolean
) {
  return actionHandler(async () => {
    const user = await requireAuth();

    const enrollment = await getEnrollment(user.id, courseId);
    if (!enrollment) throw new NotFoundError("Enrollment");

    await upsertLessonProgress(enrollment.id, lessonId, {
      isCompleted,
      completedAt: isCompleted ? new Date() : null,
    });

    const progress = await calculateCourseProgress(enrollment.id, courseId);
    
    await updateEnrollmentProgress(
      enrollment.id,
      progress,
      progress === 100 ? new Date() : undefined
    );

    if (progress === 100) {
      try {
        const cert = await createCertificate(enrollment.id);
        
        const fullEnrollment = await db.enrollment.findUnique({
          where: { id: enrollment.id },
          include: { user: true, course: true },
        });

        if (fullEnrollment) {
          await createNotification(
            fullEnrollment.userId,
            "CERTIFICATE",
            "Certificate Earned! 🎉",
            `Congratulations! You have completed "${fullEnrollment.course.title}" and earned a certificate.`,
            `/certificates/${cert.certificateId}`
          );

          const { sendCertificateEmail } = await import("@/lib/mail");
          await sendCertificateEmail(
            fullEnrollment.user.email,
            fullEnrollment.user.name || fullEnrollment.user.email,
            fullEnrollment.course.title,
            cert.certificateId
          );
        }
      } catch (err) {
        console.error("Failed to handle certificate completion:", err);
      }
    }

    revalidatePath(`/student/courses`);
    revalidatePath(`/learn/${courseId}/${lessonId}`);
    return { progress };
  });
}

export async function updateVideoProgress(
  courseId: string,
  lessonId: string,
  videoPosition: number
) {
  return actionHandler(async () => {
    const user = await requireAuth();

    const enrollment = await getEnrollment(user.id, courseId);
    if (!enrollment) throw new NotFoundError("Enrollment");

    await upsertLessonProgress(enrollment.id, lessonId, { videoPosition });

    return true;
  });
}
