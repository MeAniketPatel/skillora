import { requireTeacher } from "@/lib/auth-helpers";
import { getCourseByIdForOwner } from "@/data/course.data";
import { getCourseSubmissions } from "@/data/assignment.data";
import { PageHeader } from "@/components/shared/page-header";
import { SubmissionTable } from "@/components/teacher/submission-table";
import LinkButton from "@/components/ui/link-button";

interface CourseAssignmentsPageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CourseAssignmentsPage({
  params,
}: CourseAssignmentsPageProps) {
  const user = await requireTeacher();
  const { courseId } = await params;

  // Validate ownership
  const course = await getCourseByIdForOwner(courseId, user.id);

  // Fetch submissions
  const submissions = await getCourseSubmissions(courseId);

  // Map database submissions to component Submission structure
  const mappedSubmissions = submissions.map((s) => ({
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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader
          title="Deliverables & Grading"
          description={`Grade assignments and provide feedback for course: ${course.title}`}
        />
        <LinkButton
          href={`/teacher/courses/${courseId}`}
          variant="outline"
          size="sm"
          className="rounded-xl shrink-0 h-9"
        >
          Back to Course
        </LinkButton>
      </div>

      <SubmissionTable
        initialSubmissions={mappedSubmissions}
        courseId={courseId}
      />
    </div>
  );
}
