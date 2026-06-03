import { requireTeacher } from "@/lib/auth-helpers";
import { getCourseByIdForOwner } from "@/data";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, BookOpen, Settings } from "lucide-react";
import { publishCourse, unpublishCourse } from "@/actions";
import { ActionButton } from "@/components/shared/action-button";

export default async function TeacherCourseDashboard({
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
    redirect("/teacher/courses");
  }

  const requiredFields = [
    course.title,
    course.description,
    course.thumbnail,
    course.categoryId,
    course.sections.some(s => s.lessons.some(l => l.isPublished))
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/teacher/courses">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight flex-1 truncate">
          Course Setup: {course.title}
        </h1>
        <div className="flex items-center gap-x-2">
          <span className="text-sm font-medium text-muted-foreground">
            {completedFields}/{totalFields} fields completed
          </span>
          {course.status === "PUBLISHED" ? (
            <form action={async () => {
              "use server";
              await unpublishCourse(courseId);
            }}>
              <ActionButton action={async () => {}} variant="outline">Unpublish</ActionButton>
            </form>
          ) : (
            <form action={async () => {
              "use server";
              await publishCourse(courseId);
            }}>
              <ActionButton action={async () => {}} disabled={!isComplete}>Publish</ActionButton>
            </form>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Edit the title, description, and thumbnail of your course.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* We will add forms for title, description, image, price, category here */}
            <p className="text-sm text-muted-foreground">Forms will be integrated here using react-hook-form.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Curriculum Builder
            </CardTitle>
            <CardDescription>
              Build the sections and lessons for your course.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <span className="text-sm font-medium">
                {course.sections.length} sections, {course.sections.reduce((acc, s) => acc + s.lessons.length, 0)} lessons
              </span>
            </div>
            <Link href={`/teacher/courses/${courseId}/curriculum`}>
              <Button className="w-full">
                Open Curriculum Builder
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
