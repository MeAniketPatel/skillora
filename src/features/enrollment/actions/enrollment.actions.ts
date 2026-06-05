"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { ConflictError, NotFoundError, ValidationError } from "@/shared/lib/errors";
import { triggerWebhook } from "@/lib/webhook-sender";
import { service as coursesService } from "@/features/courses/server";
import { service as enrollmentService } from "@/features/enrollment/server";
import { service as studentsService } from "@/features/students/server";
import { service as certificatesService } from "@/features/certificates/server";
import { service as notificationsService } from "@/features/notifications/server";
import { assertNotificationsAccess } from "@/features/notifications/permissions/notifications.permissions";
export async function enrollInFreeCourse(courseId: string) {
  return actionHandler(async () => {
    const user = await requireAuth();

    const course = await coursesService.getCourseWithCurriculum(courseId);
    if (!course) throw new NotFoundError("Course");

    if (course.price !== 0 && course.price !== null) {
      throw new ValidationError("This is a paid course. Enrollment requires payment.");
    }

    const existingEnrollment = await enrollmentService.getEnrollment(user.id, courseId);
    if (existingEnrollment) {
      throw new ConflictError("You are already enrolled in this course.");
    }

    const enrollment = await enrollmentService.createEnrollment(user.id, courseId);

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
      await studentsService.initializeEnrollmentProgress(
        enrollment.id,
        lessons.map((lesson) => lesson.id)
      );
    }

    try {
      await notificationsService.createNotification(
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

    const enrollment = await enrollmentService.getEnrollment(user.id, courseId);
    if (!enrollment) throw new NotFoundError("Enrollment");

    await studentsService.upsertLessonProgress(enrollment.id, lessonId, {
      isCompleted,
      completedAt: isCompleted ? new Date() : null,
    });

    const progress = await studentsService.calculateCourseProgress(enrollment.id, courseId);
    
    await enrollmentService.updateEnrollmentProgress(
      enrollment.id,
      progress,
      progress === 100 ? new Date() : undefined
    );

    if (progress === 100) {
      try {
        const cert = await certificatesService.createCertificate(enrollment.id);
        
        const fullEnrollment = await enrollmentService.getEnrollmentWithUserAndCourse(enrollment.id);

        if (fullEnrollment) {
          await notificationsService.createNotification(
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

    const enrollment = await enrollmentService.getEnrollment(user.id, courseId);
    if (!enrollment) throw new NotFoundError("Enrollment");

    await studentsService.upsertLessonProgress(enrollment.id, lessonId, { videoPosition });

    return true;
  });
}
