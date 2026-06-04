"use server";

import { actionHandler } from "@/lib/action-utils";
import { requireTeacher } from "@/lib/auth-helpers";
import { getCourseInsights as getCourseInsightsDAL, getCourseByIdForOwner } from "@/data";

export async function getCourseInsightsAction(courseId: string) {
  return actionHandler(async () => {
    const user = await requireTeacher();

    // Verify ownership
    await getCourseByIdForOwner(courseId, user.id);

    const insights = await getCourseInsightsDAL(courseId);
    return insights;
  });
}
