import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getCourseWithPublishedCurriculum } from "@/features/courses";
import { getEnrollmentWithProgress } from "@/features/enrollment";
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
    getEnrollmentWithProgress(session.user.id, courseId),
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
      <div className="flex flex-1">
        <div className="hidden lg:block">
          <LearnSidebar
            courseId={courseId}
            sections={sectionsWithProgress}
            progressPercent={progressPercent}
          />
        </div>
        <main className="flex-1 overflow-x-hidden">
          <CourseProgressBar
            title={course.title}
            progressPercent={progressPercent}
            completedLessons={completedLessons}
            totalLessons={totalLessons}
          />
          <div className="lg:hidden">
            <LearnSidebar
              courseId={courseId}
              sections={sectionsWithProgress}
              progressPercent={progressPercent}
              mobile
            />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

function LearnSidebar({
  courseId,
  sections,
  progressPercent,
  mobile = false,
}: {
  courseId: string;
  sections: LessonSidebarSection[];
  progressPercent: number;
  mobile?: boolean;
}) {
  return (
    <LessonSidebar
      courseId={courseId}
      activeLessonId=""
      sections={sections}
      progressPercent={progressPercent}
    />
  );
}

function CourseProgressBar({
  title,
  progressPercent,
  completedLessons,
  totalLessons,
}: {
  title: string;
  progressPercent: number;
  completedLessons: number;
  totalLessons: number;
}) {
  return (
    <div className="sticky top-16 z-30 border-b border-border bg-card/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Learning
          </p>
          <h1 className="truncate text-sm font-extrabold">{title}</h1>
        </div>
        <div className="hidden flex-1 items-center gap-3 sm:flex">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-blue-600 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-bold text-muted-foreground">
            {completedLessons} / {totalLessons}
          </span>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary sm:hidden">
          {progressPercent}%
        </span>
      </div>
    </div>
  );
}
