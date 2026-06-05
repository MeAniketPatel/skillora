import React from "react";
import { redirect } from "next/navigation";
import { requireTeacher } from "@/shared/lib/auth-helpers";
import { getCourseByIdForOwner } from "@/features/courses/server";
import { getAnnouncementsByCourseId } from "@/features/announcements/server";
import { PageHeader } from "@/shared/components/shared/page-header";
import { AnnouncementForm } from "@/features/teachers/server";
import { AnnouncementList } from "@/features/teachers/server";

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default async function CourseAnnouncementsPage({ params }: PageProps) {
  const user = await requireTeacher();
  const { courseId } = await params;

  let course;
  try {
    course = await getCourseByIdForOwner(courseId, user.id);
  } catch {
    redirect("/teacher/courses");
  }

  const announcements = await getAnnouncementsByCourseId(courseId);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <PageHeader
        title={`Announcements — ${course.title}`}
        description="Communicate with your students by publishing announcements directly to their dashboard."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-1">
          <h2 className="text-sm font-bold text-neutral-850 dark:text-neutral-50 mb-3">
            New Announcement
          </h2>
          <AnnouncementForm courseId={courseId} />
        </div>

        <div className="md:col-span-2 space-y-3">
          <h2 className="text-sm font-bold text-neutral-850 dark:text-neutral-50 mb-3">
            Announcement History
          </h2>
          <AnnouncementList announcements={announcements} courseId={courseId} />
        </div>
      </div>
    </div>
  );
}

