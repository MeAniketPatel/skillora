"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireTeacher, requireAdmin } from "@/shared/lib/auth-helpers";
import { announcementSchema } from "@/features/announcements/contracts/announcement.contract";
import { createAnnouncement as createAnnouncementDAL, getAnnouncementById, deleteAnnouncement as deleteAnnouncementDAL } from "@/features/announcements/server";
import { getCourseByIdForOwner } from "@/features/courses/server";
import { getEnrolledStudentIds } from "@/features/enrollment/server";
import { createNotification } from "@/features/notifications/server";
import { z } from "zod";

export async function createAnnouncement(
  courseId: string,
  values: z.infer<typeof announcementSchema>
) {
  return actionHandler(async () => {
    const user = await requireTeacher();
    const validated = announcementSchema.parse(values);

    // Verify course owner
    const course = await getCourseByIdForOwner(courseId, user.id);

    const announcement = await createAnnouncementDAL(
      user.id,
      courseId,
      validated.title,
      validated.content
    );

    // Notify all enrolled students
    try {
      const studentIds = await getEnrolledStudentIds(courseId);
      await Promise.all(
        studentIds.map((studentId) =>
          createNotification(
            studentId,
            "COURSE_ANNOUNCEMENT",
            `New Announcement in ${course.title} 📢`,
            validated.title,
            `/learn/${courseId}/announcements`
          )
        )
      );
    } catch (err) {
      console.error("Failed to notify students of announcement:", err);
    }

    revalidatePath(`/teacher/courses/${courseId}/announcements`);
    return announcement;
  });
}

export async function deleteAnnouncement(announcementId: string, courseId: string) {
  return actionHandler(async () => {
    const user = await requireTeacher();

    // Verify course owner
    await getCourseByIdForOwner(courseId, user.id);

    const announcement = await getAnnouncementById(announcementId);
    if (!announcement) throw new Error("Announcement not found");

    await deleteAnnouncementDAL(announcementId);

    revalidatePath(`/teacher/courses/${courseId}/announcements`);
    return { success: true };
  });
}

export async function createGlobalAnnouncement(values: z.infer<typeof announcementSchema>) {
  return actionHandler(async () => {
    const user = await requireAdmin();
    const validated = announcementSchema.parse(values);

    const announcement = await createAnnouncementDAL(
      user.id,
      null, // null courseId means global
      validated.title,
      validated.content
    );

    revalidatePath("/admin/announcements");
    return announcement;
  });
}

export async function deleteGlobalAnnouncement(announcementId: string) {
  return actionHandler(async () => {
    await requireAdmin();

    const announcement = await getAnnouncementById(announcementId);
    if (!announcement) throw new Error("Announcement not found");

    await deleteAnnouncementDAL(announcementId);

    revalidatePath("/admin/announcements");
    return { success: true };
  });
}

