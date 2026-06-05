"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireTeacher, requireAdmin } from "@/shared/lib/auth-helpers";
import { announcementSchema } from "@/features/announcements/contracts/announcement.contract";
import { service as announcementsService } from "@/features/announcements/server";
import { service as coursesService } from "@/features/courses/server";
import { service as enrollmentService } from "@/features/enrollment/server";
import { service as notificationsService } from "@/features/notifications/server";
import { z } from "zod";

import { assertAnnouncementsAccess } from "@/features/announcements/permissions/announcements.permissions";
export async function createAnnouncement(
  courseId: string,
  values: z.infer<typeof announcementSchema>
) {
  return actionHandler(async () => {
    const user = await requireTeacher();
    const validated = announcementSchema.parse(values);

    // Verify course owner
    const course = await coursesService.getCourseByIdForOwner(courseId, user.id);

    const announcement = await announcementsService.createAnnouncement(
      user.id,
      courseId,
      validated.title,
      validated.content
    );

    // Notify all enrolled students
    try {
      const studentIds = await enrollmentService.getEnrolledStudentIds(courseId);
      await Promise.all(
        studentIds.map((studentId) =>
          notificationsService.createNotification(
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
    await coursesService.getCourseByIdForOwner(courseId, user.id);

    const announcement = await announcementsService.getAnnouncementById(announcementId);
    if (!announcement) throw new Error("Announcement not found");

    await announcementsService.deleteAnnouncement(announcementId);

    revalidatePath(`/teacher/courses/${courseId}/announcements`);
    return { success: true };
  });
}

export async function createGlobalAnnouncement(values: z.infer<typeof announcementSchema>) {
  return actionHandler(async () => {
    const user = await requireAdmin();
    const validated = announcementSchema.parse(values);

    const announcement = await announcementsService.createAnnouncement(
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

    const announcement = await announcementsService.getAnnouncementById(announcementId);
    if (!announcement) throw new Error("Announcement not found");

    await announcementsService.deleteAnnouncement(announcementId);

    revalidatePath("/admin/announcements");
    return { success: true };
  });
}

