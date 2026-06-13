import { requireTeacher } from "@/shared/lib/auth-helpers";
import { getCourseByIdForOwner } from "@/features/courses/server";
import { getLessonWithContent } from "@/features/courses/server";
import { notFound } from "next/navigation";
import { LessonEditor } from "@/features/courses";

export default async function LessonEditPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const user = await requireTeacher();
  const { courseId, lessonId } = await params;

  const course = await getCourseByIdForOwner(courseId, user.id);
  
  if (!course) {
    notFound();
  }

  const lesson = await getLessonWithContent(lessonId);

  if (!lesson) {
    notFound();
  }

  const isLessonInCourse = course.sections.some((section) =>
    section.lessons.some((l) => l.id === lessonId)
  );

  if (!isLessonInCourse) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto py-2 space-y-6">
      <LessonEditor courseId={courseId} lesson={lesson} />
    </div>
  );
}
