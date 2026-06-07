import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getEnrollmentWithProgress } from "@/features/enrollment/server";
import { getCourseWithPublishedCurriculum, getLearningLesson } from "@/features/courses/server";
import { getLessonProgress } from "@/features/students/server";
import { getSubmission } from "@/features/assignments/server";
import { LessonPlayer } from "@/features/courses";
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

  // Find current section for breadcrumb
  const currentSection = course.sections.find((s) =>
    s.lessons.some((l) => l.id === lessonId),
  );

  const completedLessonIds = enrollment.lessonProgress
    .filter((lp) => lp.isCompleted)
    .map((lp) => lp.lessonId);

  return (
    <LessonPlayer
      courseId={courseId}
      courseTitle={course.title}
      breadcrumb={{
        sectionTitle: currentSection?.title ?? "",
        sectionIndex: course.sections.findIndex((s) => s.id === currentSection?.id) + 1,
        totalSections: course.sections.length,
        lessonPosition: currentIdx + 1,
        totalLessons: allLessons.length,
      }}
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
      completedLessonIds={completedLessonIds}
      prevLessonId={prevLessonId}
      nextLessonId={nextLessonId}
    />
  );
}
