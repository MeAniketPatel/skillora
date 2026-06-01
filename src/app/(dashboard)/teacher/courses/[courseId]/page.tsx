import { redirect } from "next/navigation";

import { auth } from "@/auth";
import db from "@/lib/prisma";
import CourseEditor from "@/components/course/course-editor";

interface CoursePageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const session = await auth();
  const { courseId } = await params;

  if (!session?.user) {
    redirect("/login");
  }

  const course = await db.course.findUnique({
    where: {
      id: courseId,
      teacherId: session.user.id,
    },
  });

  if (!course) {
    redirect("/teacher/courses");
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return <CourseEditor course={course} categories={categories} />;
}
