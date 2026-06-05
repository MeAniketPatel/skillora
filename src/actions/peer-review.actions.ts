"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireTeacher } from "@/shared/lib/auth-helpers";
import { peerReviewConfigSchema } from "@/features/peer-reviews/contracts/peer-review.contract";
import { upsertPeerReviewConfig, getLessonWithCourse } from "@/features/courses/server";
import { z } from "zod";

export async function savePeerReviewConfig(
  lessonId: string,
  values: z.infer<typeof peerReviewConfigSchema>
) {
  return actionHandler(async () => {
    const user = await requireTeacher();
    const validated = peerReviewConfigSchema.parse(values);

    // Validate lesson and teacher ownership
    const lesson = await getLessonWithCourse(lessonId);
    if (!lesson) throw new Error("Lesson not found");
    if (lesson.section.course.teacherId !== user.id) {
      throw new Error("You do not own this course");
    }

    const config = await upsertPeerReviewConfig(
      lessonId,
      validated.requiredReviews,
      validated.dueDate
    );

    revalidatePath(`/teacher/courses/${lesson.section.courseId}/curriculum`);
    return config;
  });
}
