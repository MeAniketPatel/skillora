"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/lib/action-utils";
import { requireTeacher } from "@/lib/auth-helpers";
import { peerReviewConfigSchema } from "@/validations/peer-review.schema";
import { upsertPeerReviewConfig, getLessonWithCourse } from "@/data";
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
