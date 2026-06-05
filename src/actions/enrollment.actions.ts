"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { ConflictError, NotFoundError, ValidationError } from "@/shared/lib/errors";
import { triggerWebhook } from "@/lib/webhook-sender";
import { getCourseWithCurriculum } from "@/features/courses/server";
import { getEnrollment, createEnrollment as createEnrollmentData, updateEnrollmentProgress, getEnrollmentWithUserAndCourse } from "@/features/enrollment/server";
import { upsertLessonProgress, calculateCourseProgress, initializeEnrollmentProgress } from "@/features/students/server";
import { createCertificate } from "@/features/certificates/server";
import { createNotification } from "@/features/notifications/server";
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

    try {
      await triggerWebhook("enrollment.created", {
        enrollmentId: enrollment.id,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        courseId: course.id,
        courseTitle: course.title,
        enrolledAt: enrollment.createdAt,
      });
    } catch (whErr) {
      console.error("Failed to trigger webhook on enrollment:", whErr);
    }

    const lessons = course.sections.flatMap((s) => s.lessons);
    if (lessons.length > 0) {
      await initializeEnrollmentProgress(
        enrollment.id,
        lessons.map((lesson) => lesson.id)
      );
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
        
        const fullEnrollment = await getEnrollmentWithUserAndCourse(enrollment.id);

        if (fullEnrollment) {
          await createNotification(
            fullEnrollment.userId,
            "CERTIFICATE",
            "Certificate Earned! 🎉",
            `Congratulations! You have completed "${fullEnrollment.course.title}" and earned a certificate.`,
            `/certificates/${cert.certificateId}`
          );

          const { sendCertificateEmail } = await import("@/shared/lib/mail");
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
