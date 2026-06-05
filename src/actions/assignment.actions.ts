"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth, requireTeacher } from "@/shared/lib/auth-helpers";
import { NotFoundError, ValidationError } from "@/shared/lib/errors";
import { service as assignmentsService } from "@/features/assignments/server";
import { service as coursesService } from "@/features/courses/server";
import { service as enrollmentService } from "@/features/enrollment/server";
import { service as studentsService } from "@/features/students/server";
import { service as notificationsService } from "@/features/notifications/server";
import { assertNotificationsAccess } from "@/features/notifications/permissions/notifications.permissions";
export async function submitAssignment(lessonId: string, content: string) {
  return actionHandler(async () => {
    const user = await requireAuth();

    const lesson = await coursesService.getLessonWithCourse(lessonId);

    if (!lesson) throw new NotFoundError("Lesson");

    const enrollment = await enrollmentService.getEnrollment(user.id, lesson.section.courseId);
    if (!enrollment) throw new ValidationError("You are not enrolled in this course");

    const submission = await assignmentsService.submitAssignment(user.id, lessonId, content);

    await studentsService.upsertLessonProgress(enrollment.id, lessonId, {
      isCompleted: true,
      completedAt: new Date(),
    });

    try {
      await notificationsService.createNotification(
        lesson.section.course.teacherId,
        "ASSIGNMENT_SUBMISSION",
        "New Assignment Submission 📝",
        `${user.name || user.email} submitted an assignment for "${lesson.title}"`,
        `/teacher/courses/${lesson.section.courseId}/assignments`
      );
    } catch (err) {
      console.error("Failed to notify teacher:", err);
    }

    revalidatePath(`/learn/${lesson.section.courseId}/${lessonId}`);
    return submission;
  });
}

export async function getLessonSubmissions(lessonId: string) {
  return actionHandler(async () => {
    await requireTeacher();
    const submissions = await assignmentsService.getSubmissionsForLesson(lessonId);
    return submissions;
  });
}

export async function gradeSubmission(
  submissionId: string,
  score: number,
  feedback?: string
) {
  return actionHandler(async () => {
    await requireTeacher();

    const submission = await assignmentsService.gradeSubmission(submissionId, score, feedback);

    try {
      await notificationsService.createNotification(
        submission.userId,
        "ASSIGNMENT_GRADED",
        "Assignment Graded! 📝",
        `Your submission for "${submission.lesson.title}" was graded: ${score}/100.`,
        `/learn/${submission.lesson.section.courseId}/${submission.lessonId}`
      );
    } catch (err) {
      console.error("Failed to notify student:", err);
    }

    revalidatePath(`/learn/${submission.lesson.section.courseId}/${submission.lessonId}`);
    return submission;
  });
}
