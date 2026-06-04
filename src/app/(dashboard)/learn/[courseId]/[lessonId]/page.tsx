import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getEnrollmentWithProgress } from "@/data/enrollment.data";
import { getCourseWithPublishedCurriculum } from "@/data/course.data";
import { getLearningLesson } from "@/data/lesson.data";
import { getLessonProgress } from "@/data/lesson-progress.data";
import { getSubmission } from "@/data/assignment.data";
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
  const enrollment = await getEnrollmentWithProgress(session.user.id, courseId);

  if (!enrollment) {
    redirect(`/courses`);
  }

  // Retrieve course content
  const course = await getCourseWithPublishedCurriculum(courseId);

  if (!course) {
    redirect("/student/courses");
  }

  const lesson = await getLearningLesson(lessonId, courseId, session.user.id);

  if (!lesson || !lesson.isPublished) {
    redirect(`/student/courses`);
  }

  // Find user's progress for this specific lesson
  const currentProgress = await getLessonProgress(enrollment.id, lessonId);

  const assignmentSubmission = lesson.type === "ASSIGNMENT"
    ? await getSubmission(session.user.id, lessonId)
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

