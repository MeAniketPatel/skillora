"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAdmin } from "@/shared/lib/auth-helpers";
import { userRoleUpdateSchema } from "@/features/admin/contracts/admin.contract";
import { service as authService } from "@/features/auth";
import { assertAuthAccess } from "@/features/auth";
export async function updateUserRole(values: any) {
  return actionHandler(async () => {
    await requireAdmin();
    const validated = userRoleUpdateSchema.parse(values);
    
    const user = await authService.updateUser(validated.userId, { role: validated.role });
    revalidatePath(`/admin/users`);
    return user;
  });
}

export async function banUser(userId: string, reason?: string) {
  return actionHandler(async () => {
    await requireAdmin();
    
    const user = await authService.banUser(userId, reason);
    revalidatePath(`/admin/users`);
    return user;
  });
}

export async function unbanUser(userId: string) {
  return actionHandler(async () => {
    await requireAdmin();
    
    const user = await authService.unbanUser(userId);
    revalidatePath(`/admin/users`);
    return user;
  });
}

export async function approveCourse(courseId: string) {
  return actionHandler(async () => {
    await requireAdmin();
    
    const { updateCourse } = await import("@/features/courses/server");
    const { createNotification } = await import("@/features/notifications/server");
    const updated = await updateCourse(courseId, {
      status: "PUBLISHED",
      publishedAt: new Date(),
    });
    
    try {
      await createNotification(
        updated.teacherId,
        "COURSE_APPROVED",
        "Course Approved! 🎉",
        `Your course "${updated.title}" has been approved and is now live.`,
        `/courses/${updated.slug}`
      );
    } catch (err) {
      console.error("Failed to notify teacher:", err);
    }
    
    revalidatePath("/admin/courses");
    return updated;
  });
}

export async function rejectCourse(courseId: string, reason: string) {
  return actionHandler(async () => {
    await requireAdmin();
    
    const { updateCourse } = await import("@/features/courses/server");
    const { createNotification } = await import("@/features/notifications/server");
    const updated = await updateCourse(courseId, {
      status: "DRAFT",
    });
    
    try {
      await createNotification(
        updated.teacherId,
        "COURSE_REJECTED",
        "Course Review Update ⚠️",
        `Your course "${updated.title}" requires revisions: ${reason}`,
        `/teacher/courses/${updated.id}`
      );
    } catch (err) {
      console.error("Failed to notify teacher:", err);
    }
    
    revalidatePath("/admin/courses");
    return updated;
  });
}
