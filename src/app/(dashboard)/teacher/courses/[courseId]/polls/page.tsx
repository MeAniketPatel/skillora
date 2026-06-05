import React from "react";
import { redirect } from "next/navigation";
import { requireTeacher } from "@/shared/lib/auth-helpers";
import { getCourseByIdForOwner } from "@/features/courses/server";
import { getCoursePolls } from "@/features/polls/server";
import { PageHeader } from "@/shared/components/shared/page-header";
import { PollCreator } from "@/features/polls/server";
import { PollList } from "@/features/polls/server";

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default async function CoursePollsPage({ params }: PageProps) {
  const user = await requireTeacher();
  const { courseId } = await params;

  let course;
  try {
    course = await getCourseByIdForOwner(courseId, user.id);
  } catch {
    redirect("/teacher/courses");
  }

  const polls = await getCoursePolls(courseId);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <PageHeader
        title={`Polls — ${course.title}`}
        description="Interact with students enrolled in this course by creating and managing real-time polls."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-1">
          <h2 className="text-sm font-bold text-neutral-850 dark:text-neutral-50 mb-3">
            New Poll
          </h2>
          <PollCreator courseId={courseId} />
        </div>

        <div className="md:col-span-2 space-y-3">
          <h2 className="text-sm font-bold text-neutral-850 dark:text-neutral-50 mb-3">
            Existing Polls
          </h2>
          <PollList polls={polls} courseId={courseId} />
        </div>
      </div>
    </div>
  );
}
