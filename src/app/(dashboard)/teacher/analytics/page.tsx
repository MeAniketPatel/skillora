import { redirect } from "next/navigation";
import { auth } from "@/auth";
import db from "@/lib/prisma";
import { AnalyticsClient } from "@/components/teacher/analytics-client";

export default async function TeacherAnalyticsPage() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
    redirect("/login");
  }

  // Get teacher's courses
  const courses = await db.course.findMany({
    where: { teacherId: session.user.id },
    include: {
      enrollments: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      sections: {
        include: {
          lessons: {
            where: { type: "ASSIGNMENT" },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Get all assignment submissions for this teacher's courses
  const lessonIds = courses
    .flatMap((c) => c.sections)
    .flatMap((s) => s.lessons)
    .map((l) => l.id);

  const submissions = await db.assignmentSubmission.findMany({
    where: {
      lessonId: { in: lessonIds },
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      lesson: {
        select: {
          title: true,
          section: {
            select: {
              course: {
                select: {
                  title: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { submittedAt: "desc" },
  });

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
