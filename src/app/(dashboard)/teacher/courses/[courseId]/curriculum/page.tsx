import { redirect } from "next/navigation";

import { auth } from "@/auth";
import db from "@/lib/prisma";
import CurriculumBuilder from "@/components/course/curriculum-builder";

interface CurriculumPageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CurriculumPage({ params }: CurriculumPageProps) {
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
    include: {
      sections: {
        orderBy: {
          position: "asc",
        },
        include: {
          lessons: {
            orderBy: {
              position: "asc",
            },
          },
        },
      },
    },
  });

  if (!course) {
    redirect("/teacher/courses");
  }

  return (
    <CurriculumBuilder
      courseId={course.id}
      initialSections={course.sections as any}
    />
  );
}
