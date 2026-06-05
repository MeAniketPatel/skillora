import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getTeacherAnalyticsCourses } from "@/features/courses";
import { getAllTeacherSubmissions } from "@/features/assignments";
import { AnalyticsClient } from "@/features/teachers";

export default async function TeacherAnalyticsPage() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
    redirect("/login");
  }

  // Get teacher's courses
  const courses = await getTeacherAnalyticsCourses(session.user.id);

  // Get all assignment submissions for this teacher's courses
  const lessonIds = courses
    .flatMap((c) => c.sections)
    .flatMap((s) => s.lessons)
    .map((l) => l.id);

  const submissions = await getAllTeacherSubmissions(lessonIds);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Student Tracking</h1>
        <p className="text-sm text-neutral-500">Analyze curriculum performance, track student progress, grade deliverables, and export data.</p>
      </div>

      <AnalyticsClient initialCourses={courses} initialSubmissions={submissions} />
    </div>
  );
}
