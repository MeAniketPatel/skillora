import { requireTeacher } from "@/shared/lib/auth-helpers";
import { getCourseByIdForOwner } from "@/features/courses/server";
import { redirect } from "next/navigation";
import { Button, buttonVariants } from "@/shared/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { createSection } from "@/actions";

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

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/teacher/courses/${courseId}`} className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight flex-1">
          Curriculum
        </h1>
        <form action={async (formData) => {
          "use server";
          await createSection(courseId, formData.get("title") as string);
        }} className="flex items-center gap-2">
          <input 
            name="title" 
            placeholder="New section title" 
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
            required
          />
          <Button type="submit" size="sm">
            <Plus className="h-4 w-4 mr-2" /> Section
          </Button>
        </form>
      </div>

      <div className="space-y-4">
        {course.sections.length === 0 ? (
          <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
            No sections yet. Add your first section above.
          </div>
        ) : (
          course.sections.map((section) => (
            <div key={section.id} className="border rounded-lg p-4 bg-muted/20">
              <div className="flex items-center justify-between font-semibold mb-4">
                <span>{section.title}</span>
              </div>
              <div className="space-y-2 pl-4 border-l-2 border-muted">
                {section.lessons.length === 0 ? (
                  <div className="text-sm text-muted-foreground italic">No lessons in this section.</div>
                ) : (
                  section.lessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between p-2 border rounded bg-background">
                      <span className="text-sm">{lesson.title}</span>
                      <Link href={`/teacher/courses/${courseId}/lessons/${lesson.id}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                        Edit
                      </Link>
                    </div>
                  ))
                )}
                <div className="pt-2">
                  <form action={async (formData) => {
                    "use server";
                    const { createLesson } = await import("@/actions");
                    await createLesson(courseId, section.id, formData.get("title") as string);
                  }} className="flex items-center gap-2">
                    <input 
                      name="title" 
                      placeholder="New lesson title" 
                      className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                      required
                    />
                    <Button type="submit" size="sm" variant="secondary">
                      Add Lesson
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
