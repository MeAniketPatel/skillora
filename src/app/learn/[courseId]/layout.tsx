import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getCourseWithPublishedCurriculum } from "@/features/courses/server";
import { getEnrollmentWithProgress } from "@/features/enrollment/server";
import { Navbar } from "@/shared/components/layout/navbar";
import { LessonSidebar } from "@/features/learn";
import type {
  LessonSidebarSection,
} from "@/features/learn";

interface LearnCourseLayoutProps {
  children: React.ReactNode;
  params: Promise<{ courseId: string }>;
}

export default async function LearnCourseLayout({
  children,
  params,
}: LearnCourseLayoutProps) {
  const { courseId } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [course, enrollment] = await Promise.all([
    getCourseWithPublishedCurriculum(courseId),
    getEnrollmentWithProgress(session.user.id, courseId).catch(() => null),
  ]);

  if (!course) redirect("/student/courses");

  const sections: LessonSidebarSection[] = (course.sections ?? []).map((s) => ({
    id: s.id,
    title: s.title,
    lessons: (s.lessons ?? []).map((l) => ({
      id: l.id,
      title: l.title,
      type: l.type as "VIDEO" | "ARTICLE" | "QUIZ" | "ASSIGNMENT",
      isFree: l.isFree,
      isCompleted: false,
    })),
  }));

  const completedSet = new Set(
    enrollment?.lessonProgress
      ?.filter((lp) => lp.isCompleted)
      .map((lp) => lp.lessonId) ?? [],
  );

  const sectionsWithProgress: LessonSidebarSection[] = sections.map((s) => ({
    ...s,
    lessons: s.lessons.map((l) => ({
      ...l,
      isCompleted: completedSet.has(l.id),
    })),
  }));

  const totalLessons = sections.reduce(
    (acc, s) => acc + s.lessons.length,
    0,
  );
  const completedLessons = sectionsWithProgress.reduce(
    (acc, s) => acc + s.lessons.filter((l) => l.isCompleted).length,
    0,
  );
  const progressPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="flex flex-1 min-h-0">
        <div className="hidden lg:block">
          <LessonSidebar
            courseId={courseId}
            sections={sectionsWithProgress}
            progressPercent={progressPercent}
          />
        </div>
        <div className="flex flex-1 flex-col min-h-0 min-w-0">
          <div className="lg:hidden">
            <LessonSidebar
              courseId={courseId}
              sections={sectionsWithProgress}
              progressPercent={progressPercent}
            />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
