import { requireTeacher } from "@/shared/lib/auth-helpers";
import { getCourseByIdForOwner } from "@/features/courses/server";
import { redirect } from "next/navigation";
import CurriculumBuilder from "@/features/courses/components/curriculum";
import { CurriculumPublishButton } from "@/features/courses/components/curriculum/curriculum-publish-button";
import LinkButton from "@/shared/components/ui/link-button";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CurriculumBuilderPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const user = await requireTeacher();
  const { courseId } = await params;

  let course;
  try {
    course = await getCourseByIdForOwner(courseId, user.id);
  } catch {
    redirect(`/teacher/courses/${courseId}`);
  }

  const sortedSections = [...course.sections]
    .sort((a, b) => a.position - b.position)
    .map((section) => ({
      id: section.id,
      title: section.title,
      position: section.position,
      lessons: [...section.lessons]
        .sort((a, b) => a.position - b.position)
        .map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          type: lesson.type,
          isFree: lesson.isFree,
          isPublished: lesson.isPublished,
          position: lesson.position,
        })),
    }));

  const publishedLessonsCount = sortedSections.reduce(
    (sum, s) => sum + s.lessons.filter((l) => l.isPublished).length,
    0,
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <LinkButton
          href={`/teacher/courses/${courseId}`}
          variant="ghost"
          size="icon"
        >
          <ArrowLeft className="h-4 w-4" />
        </LinkButton>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold tracking-tight truncate">
            Curriculum
          </h1>
          <p className="text-sm text-muted-foreground">
            {course.title} — {publishedLessonsCount} published lesson
            {publishedLessonsCount === 1 ? "" : "s"}
          </p>
        </div>
        <CurriculumPublishButton
          courseId={courseId}
          initialStatus={course.status}
        />
      </div>

      <CurriculumBuilder
        courseId={courseId}
        initialSections={sortedSections}
      />
    </div>
  );
}
