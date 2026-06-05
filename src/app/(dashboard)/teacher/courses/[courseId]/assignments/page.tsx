import React from "react";
import { redirect } from "next/navigation";
import { requireTeacher } from "@/shared/lib/auth-helpers";
import { getCourseByIdForOwner } from "@/data/course.data";
import { getCourseSubmissions } from "@/data/assignment.data";
import { PageHeader } from "@/shared/components/shared/page-header";
import { SubmissionTable } from "@/components/teacher/submission-table";

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default async function CourseAssignmentsPage({ params }: PageProps) {
  const user = await requireTeacher();
  const { courseId } = await params;

  let course;
  try {
    course = await getCourseByIdForOwner(courseId, user.id);
  } catch {
    redirect("/teacher/courses");
  }

  const submissions = await getCourseSubmissions(courseId);

  // Map Date to Date and other fields to match Submission interface in SubmissionTable
  const formattedSubmissions = submissions.map((s) => ({
    id: s.id,
    content: s.content,
    attachmentUrl: s.attachmentUrl,
    score: s.score,
    feedback: s.feedback,
    status: s.status,
    submittedAt: s.submittedAt,
    user: {
      name: s.user.name,
      email: s.user.email,
      image: s.user.image,
    },
    lesson: {
      id: s.lesson.id,
      title: s.lesson.title,
    },
  }));

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <PageHeader
        title={`Assignments — ${course.title}`}
        description="Grade assignment submissions and provide feedback to your students."
      />

      <SubmissionTable initialSubmissions={formattedSubmissions} courseId={courseId} />
    </div>
  );
}
