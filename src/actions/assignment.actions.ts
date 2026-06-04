"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/lib/action-utils";
import { requireAuth, requireTeacher } from "@/lib/auth-helpers";
import { NotFoundError, ValidationError } from "@/lib/errors";
import {
  submitAssignment as submitAssignmentData,
  getSubmissionsForLesson,
  gradeSubmission as gradeSubmissionData,
  getLessonWithContent,
  getEnrollment,
  upsertLessonProgress,
  createNotification,
  getLessonWithCourse
} from "@/data";

export async function submitAssignment(lessonId: string, content: string) {
  return actionHandler(async () => {
    const user = await requireAuth();

    const lesson = await getLessonWithCourse(lessonId);

    if (!lesson) throw new NotFoundError("Lesson");

    const enrollment = await getEnrollment(user.id, lesson.section.courseId);
    if (!enrollment) throw new ValidationError("You are not enrolled in this course");

    const submission = await submitAssignmentData(user.id, lessonId, content);

    await upsertLessonProgress(enrollment.id, lessonId, {
      isCompleted: true,
      completedAt: new Date(),
    });

    try {
      await createNotification(
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
    const submissions = await getSubmissionsForLesson(lessonId);
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

    const submission = await gradeSubmissionData(submissionId, score, feedback);

    try {
      await createNotification(
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
