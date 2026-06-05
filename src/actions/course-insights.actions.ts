"use server";

import { actionHandler } from "@/shared/lib/action-utils";
import { requireTeacher } from "@/shared/lib/auth-helpers";
import { getCourseInsights as getCourseInsightsDAL, getCourseByIdForOwner } from "@/features/courses/server";
export async function getCourseInsightsAction(courseId: string) {
  return actionHandler(async () => {
    const user = await requireTeacher();

    // Verify ownership
    await getCourseByIdForOwner(courseId, user.id);

    const insights = await getCourseInsightsDAL(courseId);
    return insights;
  });
}
