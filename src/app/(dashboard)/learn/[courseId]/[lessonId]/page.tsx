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
        select: { 
          lessonId: true,
          isCompleted: true,
        },
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
    include: {
      attachments: {
        orderBy: { createdAt: "desc" },
      },
      quiz: {
        include: {
          questions: {
            orderBy: { position: "asc" },
          },
          attempts: {
            where: { userId: session.user.id },
            orderBy: { startedAt: "desc" },
          },
        },
      },
    },
  });

  if (!lesson || !lesson.isPublished) {
    redirect(`/student/courses`);
  }

  // Find user's progress for this specific lesson
  const currentProgress = await db.lessonProgress.findUnique({
    where: {
      enrollmentId_lessonId: {
        enrollmentId: enrollment.id,
        lessonId,
      },
    },
  });

  const assignmentSubmission = lesson.type === "ASSIGNMENT"
    ? await db.assignmentSubmission.findUnique({
        where: {
          userId_lessonId: {
            userId: session.user.id,
            lessonId,
          },
        },
      })
    : null;

  // Flatten lessons to calculate next/prev
  const allLessons = course.sections.flatMap((s) => s.lessons);
  const currentIdx = allLessons.findIndex((l) => l.id === lessonId);
  const prevLessonId = currentIdx > 0 ? allLessons[currentIdx - 1].id : null;
  const nextLessonId = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1].id : null;

  const completedLessonIds = enrollment.lessonProgress
    .filter((lp) => lp.isCompleted)
    .map((lp) => lp.lessonId);

  return (
    <LessonPlayer
      courseId={courseId}
      courseTitle={course.title}
      lesson={{
        id: lesson.id,
        title: lesson.title,
        type: lesson.type,
        content: lesson.content,
        videoUrl: lesson.videoUrl,
        videoDuration: lesson.videoDuration,
        initialPosition: currentProgress?.videoPosition || 0,
        attachments: lesson.attachments,
        quiz: lesson.quiz,
        submission: assignmentSubmission,
      }}
      sections={course.sections as any}
      completedLessonIds={completedLessonIds}
      prevLessonId={prevLessonId}
      nextLessonId={nextLessonId}
    />
  );
}

