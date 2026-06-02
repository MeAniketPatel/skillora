import Link from "next/link";
import { Plus, GraduationCap } from "lucide-react";
import { redirect } from "next/navigation";

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

export default async function TeacherCoursesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const courses = await db.course.findMany({
    where: {
      teacherId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
          <p className="text-neutral-500">
            Manage your course catalog, content, and curriculum.
          </p>
        </div>
        <LinkButton href="/teacher/courses/new">
          <Plus className="mr-2 h-4 w-4" />
          Create Course
        </LinkButton>
      </div>

      {courses.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center bg-white/70 dark:bg-neutral-900/70 border-dashed border-2 border-neutral-300 dark:border-neutral-700">
          <GraduationCap className="h-12 w-12 text-neutral-400 mb-4" />
          <CardTitle className="text-xl font-bold">
            No courses created yet
          </CardTitle>
          <CardDescription className="max-w-sm mt-2">
            Get started by creating your first course and setting up the modules
            and lessons.
          </CardDescription>
          <LinkButton href="/teacher/courses/new" className="mt-6">
            Create First Course
          </LinkButton>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50"
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
                <div
                  className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-semibold ${course.status === "PUBLISHED" ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" : "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300"}`}
                >
                  {course.status}
                </div>
              </div>
              <CardHeader className="p-4">
                <CardTitle className="text-lg line-clamp-1">
                  {course.title}
                </CardTitle>
                <CardDescription className="text-xs">
                  Level: {course.level}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 border-t border-neutral-100 dark:border-neutral-800/50 flex justify-between items-center">
                <span className="font-bold text-sm">
                  {course.price === 0 || !course.price
                    ? "Free"
                    : `$${course.price}`}
                </span>
                <LinkButton
                  variant="outline"
                  size="sm"
                  href={`/teacher/courses/${course.id}`}
                >
                  Manage
                </LinkButton>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
