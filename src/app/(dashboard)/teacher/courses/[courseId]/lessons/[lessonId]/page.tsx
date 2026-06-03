import { requireTeacher } from "@/lib/auth-helpers";
import { getCourseByIdForOwner } from "@/data";
import db from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { updateLesson } from "@/actions";
import { ActionButton } from "@/components/shared/action-button";

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
    redirect(`/teacher/courses/${courseId}/curriculum`);
  }

  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: { section: true },
  });

  if (!lesson || lesson.section.courseId !== courseId) {
    redirect(`/teacher/courses/${courseId}/curriculum`);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/teacher/courses/${courseId}/curriculum`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight flex-1">
          Edit Lesson: {lesson.title}
        </h1>
        <form action={async () => {
          "use server";
          await updateLesson(courseId, lesson.sectionId, lessonId, {
            isPublished: !lesson.isPublished
          });
        }}>
          <ActionButton action={async () => {}} variant={lesson.isPublished ? "outline" : "default"}>
            {lesson.isPublished ? "Unpublish Lesson" : "Publish Lesson"}
          </ActionButton>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="border rounded-lg p-6 bg-card text-card-foreground shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Content</h2>
          <p className="text-sm text-muted-foreground mb-4">Upload video, write text content, or add assignments.</p>
          {/* Real implementation would use Mux or standard file upload for video and a rich text editor for content */}
          <div className="p-4 border border-dashed rounded bg-muted/50 text-center text-muted-foreground">
            Video & Text Editors go here
          </div>
        </div>
      </div>
    </div>
  );
}
