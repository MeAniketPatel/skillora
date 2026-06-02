import { redirect } from "next/navigation";
import { auth } from "@/auth";
import db from "@/lib/prisma";
import LessonEditor from "@/components/course/lesson-editor";

interface LessonPageProps {
  params: Promise<{
    courseId: string;
    lessonId: string;
  }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const session = await auth();
  const { courseId, lessonId } = await params;

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

  const lesson = await db.lesson.findFirst({
    where: {
      id: lessonId,
      section: {
        courseId,
      },
    },
    include: {
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
      quiz: {
        include: {
          questions: {
            orderBy: {
              position: "asc",
            },
          },
        },
      },
    },
  });

  if (!lesson) {
    redirect(`/teacher/courses/${courseId}/curriculum`);
  }

  return (
    <LessonEditor
      courseId={courseId}
      lesson={lesson}
    />
  );
}
