"use server";

import { actionHandler } from "@/shared/lib/action-utils";
import { requireTeacher } from "@/shared/lib/auth-helpers";
import { service as coursesService } from "@/features/courses/server";
export async function getCourseInsightsAction(courseId: string) {
  return actionHandler(async () => {
    const user = await requireTeacher();

    // Verify ownership
    await coursesService.getCourseByIdForOwner(courseId, user.id);

    const insights = await coursesService.getCourseInsights(courseId);
    return insights;
  });
}
