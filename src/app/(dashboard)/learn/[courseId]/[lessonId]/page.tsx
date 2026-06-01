import { redirect } from "next/navigation";

import { auth } from "@/auth";
import db from "@/lib/prisma";
import LessonPlayer from "@/components/course/lesson-player";

interface LearnPageProps {
  params: Promise<{
    courseId: string;
    lessonId: string;
  }>;
}

export default async function LearnPage({ params }: LearnPageProps) {
  const session = await auth();
  const { courseId, lessonId } = await params;

  if (!session?.user) {
    redirect("/login");
  }

  // Check enrollment
  const enrollment = await db.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId,
      },
    },
    include: {
      lessonProgress: {
        where: { isCompleted: true },
        select: { lessonId: true },
      },
    },
  });

  if (!enrollment) {
    redirect(`/courses`);
  }

  // Retrieve course content
  const course = await db.course.findUnique({
    where: { id: courseId },
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
  });

  if (!course) {
    redirect("/student/courses");
  }

  const lesson = await db.lesson.findFirst({
    where: { id: lessonId, section: { courseId } },
  });

  if (!lesson || !lesson.isPublished) {
    redirect(`/student/courses`);
  }

  // Flatten lessons to calculate next/prev
  const allLessons = course.sections.flatMap((s) => s.lessons);
  const currentIdx = allLessons.findIndex((l) => l.id === lessonId);
  const prevLessonId = currentIdx > 0 ? allLessons[currentIdx - 1].id : null;
  const nextLessonId = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1].id : null;

  const completedLessonIds = enrollment.lessonProgress.map((lp) => lp.lessonId);

  return (
    <LessonPlayer
      courseId={courseId}
      courseTitle={course.title}
      lesson={lesson}
      sections={course.sections as any}
      completedLessonIds={completedLessonIds}
      prevLessonId={prevLessonId}
      nextLessonId={nextLessonId}
    />
  );
}
