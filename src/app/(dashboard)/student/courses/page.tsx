import { redirect } from "next/navigation";
import Link from "next/link";
import { GraduationCap, BookOpen, ArrowRight } from "lucide-react";

import { auth } from "@/auth";
import db from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import LinkButton from "@/components/ui/link-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function StudentCoursesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const enrollments = await db.enrollment.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      course: {
        include: {
          sections: {
            orderBy: { position: "asc" },
            include: {
              lessons: {
                where: { isPublished: true },
                orderBy: { position: "asc" },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Learning</h1>
        <p className="text-neutral-500">
          Track your progress and continue where you left off.
        </p>
      </div>

      {enrollments.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center bg-white/70 dark:bg-neutral-900/70 border-dashed border-2 border-neutral-300 dark:border-neutral-700">
          <GraduationCap className="h-12 w-12 text-neutral-400 mb-4" />
          <CardTitle className="text-xl font-bold">
            No enrolled courses
          </CardTitle>
          <CardDescription className="max-w-sm mt-2">
            You haven&apos;t enrolled in any courses yet. Visit the catalog to
            find free learning content!
          </CardDescription>
          <LinkButton href="/courses" className="mt-6">
            Browse Courses
          </LinkButton>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => {
            const course = enrollment.course;
            // Find first lesson id to resume
            const firstSection = course.sections[0];
            const firstLesson = firstSection?.lessons[0];
            const firstLessonId = firstLesson?.id || null;

            return (
              <Card
                key={enrollment.id}
                className="overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 flex flex-col justify-between"
              >
                <div className="aspect-video w-full bg-neutral-100 dark:bg-neutral-800 relative flex items-center justify-center">
                  {course.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <GraduationCap className="h-10 w-10 text-neutral-400" />
                  )}
                </div>

                <CardHeader className="p-4 flex-1">
                  <CardTitle className="text-lg line-clamp-2">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Level: {course.level}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-4 pt-0 space-y-4">
                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Progress</span>
                      <span>{Math.round(enrollment.progress)}%</span>
                    </div>
                    <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                  </div>

                  {firstLessonId ? (
                    <LinkButton
                      className="w-full justify-between"
                      href={`/learn/${course.id}/${firstLessonId}`}
                    >
                      <span>Resume Study</span>
                      <ArrowRight className="h-4 w-4" />
                    </LinkButton>
                  ) : (
                    <Button className="w-full" disabled>
                      No lessons available
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
