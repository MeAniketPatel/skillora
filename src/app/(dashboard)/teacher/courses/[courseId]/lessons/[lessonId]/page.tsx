import { requireTeacher } from "@/lib/auth-helpers";
import { getCourseByIdForOwner } from "@/data";
import { getLessonWithContent } from "@/data/lesson.data";
import { redirect } from "next/navigation";
import LessonEditor from "@/components/course/lesson-editor";

export default async function LessonEditPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const user = await requireTeacher();
  const { courseId, lessonId } = await params;
  
  let course;
  try {
    course = await getCourseByIdForOwner(courseId, user.id);
  } catch {
    redirect("/teacher/courses");
  }

  const lesson = await getLessonWithContent(lessonId);

  if (!lesson) {
    redirect(`/teacher/courses/${courseId}/curriculum`);
  }

  const isLessonInCourse = course.sections.some((section) =>
    section.lessons.some((l) => l.id === lessonId)
  );

  if (!isLessonInCourse) {
    redirect(`/teacher/courses/${courseId}/curriculum`);
  }

  return (
    <div className="max-w-7xl mx-auto py-2">
      <LessonEditor courseId={courseId} lesson={lesson} />
    </div>
  );
}
