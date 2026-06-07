"use client";

import { useMemo, useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  PlayCircle,
  FileText,
  ListChecks,
  ClipboardList,
  File,
  Download,
  ChevronRight,
  Home,
  Clock,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { toggleLessonCompletion } from "@/features/enrollment";
import { VideoPlayer } from "@/shared/components/shared/video-player";
import { QuizView } from "@/features/courses";
import { AssignmentView } from "@/features/courses";
import { AITutor } from "@/features/learn";
import { sanitizeRichHtml } from "@/shared/lib/sanitize";
import { cn } from "@/shared/lib/utils";

interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number | null;
  type: string | null;
}

interface LessonPlayerProps {
  courseId: string;
  courseTitle: string;
  breadcrumb: {
    sectionTitle: string;
    sectionIndex: number;
    totalSections: number;
    lessonPosition: number;
    totalLessons: number;
  };
  lesson: {
    id: string;
    title: string;
    type: "VIDEO" | "ARTICLE" | "QUIZ" | "ASSIGNMENT";
    content: string | null;
    videoUrl: string | null;
    videoDuration: number | null;
    initialPosition: number;
    attachments: Attachment[];
    quiz: any;
    submission: any;
  };
  completedLessonIds: string[];
  nextLessonId: string | null;
  prevLessonId: string | null;
}

const LESSON_TYPE_META = {
  VIDEO: {
    label: "Video",
    icon: PlayCircle,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },
  ARTICLE: {
    label: "Article",
    icon: FileText,
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  QUIZ: {
    label: "Quiz",
    icon: ListChecks,
    color:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  },
  ASSIGNMENT: {
    label: "Assignment",
    icon: ClipboardList,
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
} as const;

function formatDuration(seconds: number | null): string {
  if (!seconds || seconds <= 0) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m} min`;
  return `${m}m ${s}s`;
}

function formatBytes(bytes: number | null): string {
  if (!bytes || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function LessonPlayer({
  courseId,
  courseTitle,
  breadcrumb,
  lesson,
  completedLessonIds,
  nextLessonId,
  prevLessonId,
}: LessonPlayerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const isCompleted = completedLessonIds.includes(lesson.id);
  const isLast = !nextLessonId;
  const meta = LESSON_TYPE_META[lesson.type];
  const TypeIcon = meta.icon;

  const safeArticleHtml = useMemo(
    () =>
      sanitizeRichHtml(
        lesson.content && lesson.content.trim().length > 0
          ? lesson.content
          : "<p class='italic text-neutral-500'>This lesson has no written content yet.</p>",
      ),
    [lesson.content],
  );

  // Track when lesson changes to fade-in animation
  useEffect(() => {
    setIsTransitioning(true);
    const t = setTimeout(() => setIsTransitioning(false), 200);
    return () => clearTimeout(t);
  }, [lesson.id]);

  const handleToggleCompletion = () => {
    if (isCompleted) {
      startTransition(async () => {
        const res = await toggleLessonCompletion(courseId, lesson.id, false);
        if (res.success) {
          toast.success("Marked as incomplete");
          router.refresh();
        } else {
          toast.error(res.error || "Failed to update");
        }
      });
      return;
    }

    startTransition(async () => {
      const res = await toggleLessonCompletion(courseId, lesson.id, true);
      if (res.success) {
        toast.success("Lesson complete! 🎉", {
          description: nextLessonId
            ? "Loading next lesson..."
            : "You finished the course!",
        });
        router.refresh();
        if (nextLessonId) {
          setTimeout(() => router.push(`/learn/${courseId}/${nextLessonId}`), 600);
        }
      } else {
        toast.error(res.error || "Failed to update");
      }
    });
  };

  const handleVideoComplete = () => {
    router.refresh();
  };

  const goPrev = () => {
    if (prevLessonId) router.push(`/learn/${courseId}/${prevLessonId}`);
  };

  const goNext = () => {
    if (nextLessonId) router.push(`/learn/${courseId}/${nextLessonId}`);
  };

  return (
    <div
      className={cn(
        "flex flex-1 flex-col min-h-0 transition-opacity duration-200",
        isTransitioning ? "opacity-0" : "opacity-100",
      )}
    >
      {/* Top: Breadcrumb + Title + Meta */}
      <div className="border-b border-border bg-card/40 backdrop-blur">
        <div className="mx-auto max-w-4xl px-4 py-5 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link
              href="/student/courses"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Home className="h-3 w-3" />
              My Courses
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="truncate max-w-[180px] font-medium text-foreground/80">
              {courseTitle}
            </span>
            {breadcrumb.sectionTitle && (
              <>
                <ChevronRight className="h-3 w-3" />
                <span className="truncate max-w-[180px] font-medium text-foreground/80">
                  {breadcrumb.sectionTitle}
                </span>
              </>
            )}
          </nav>

          {/* Title + Meta row */}
          <div className="flex flex-wrap items-start gap-3">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                {lesson.title}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold",
                    meta.color,
                  )}
                >
                  <TypeIcon className="h-3 w-3" />
                  {meta.label}
                </span>
                <span className="font-medium">
                  Lesson {breadcrumb.lessonPosition} of {breadcrumb.totalLessons}
                </span>
                {lesson.videoDuration ? (
                  <span className="inline-flex items-center gap-1 font-medium">
                    <Clock className="h-3 w-3" />
                    {formatDuration(lesson.videoDuration)}
                  </span>
                ) : null}
                {isCompleted && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                    <CheckCircle2 className="h-3 w-3" />
                    Completed
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
          {/* Video Player */}
          {lesson.type === "VIDEO" && lesson.videoUrl && (
            <div className="overflow-hidden rounded-2xl border border-border bg-black shadow-sm">
              <VideoPlayer
                courseId={courseId}
                lessonId={lesson.id}
                videoUrl={lesson.videoUrl}
                initialPosition={lesson.initialPosition}
                onComplete={handleVideoComplete}
              />
            </div>
          )}

          {/* Article Content */}
          {lesson.type === "ARTICLE" && (
            <Card className="border-border bg-card shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <div
                  className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-extrabold prose-headings:tracking-tight prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:leading-relaxed prose-p:text-foreground/90 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-blockquote:border-l-primary prose-blockquote:not-italic prose-blockquote:text-muted-foreground prose-img:rounded-lg prose-img:border prose-img:border-border prose-li:my-1"
                  dangerouslySetInnerHTML={{ __html: safeArticleHtml }}
                />
              </CardContent>
            </Card>
          )}

          {/* Quiz */}
          {lesson.type === "QUIZ" && lesson.quiz && (
            <QuizView
              courseId={courseId}
              lessonId={lesson.id}
              quiz={lesson.quiz}
            />
          )}

          {/* Assignment */}
          {lesson.type === "ASSIGNMENT" && (
            <AssignmentView
              lessonId={lesson.id}
              initialSubmission={lesson.submission}
            />
          )}

          {/* Attachments */}
          {lesson.attachments && lesson.attachments.length > 0 && (
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-bold">
                <File className="h-4 w-4 text-muted-foreground" />
                Resources & Materials
                <span className="text-xs font-medium text-muted-foreground">
                  ({lesson.attachments.length})
                </span>
              </h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {lesson.attachments.map((file) => (
                  <a
                    key={file.id}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:border-primary/50 hover:bg-muted/50 hover:shadow-sm"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <File className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {file.type?.toUpperCase() || "File"}
                        {file.size ? ` · ${formatBytes(file.size)}` : ""}
                      </p>
                    </div>
                    <Download className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Spacer to prevent content being hidden behind sticky action bar */}
          <div className="h-4" />
        </div>
      </div>

      {/* Sticky bottom action bar */}
      <div className="sticky bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
        <div className="mx-auto flex max-w-4xl items-center gap-2 px-4 py-3 sm:gap-3 sm:px-6 lg:px-8">
          <Button
            variant="outline"
            size="sm"
            onClick={goPrev}
            disabled={!prevLessonId || isPending}
            className="shrink-0"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          {/* Mark as Complete (only for VIDEO and ARTICLE) */}
          {lesson.type !== "QUIZ" && lesson.type !== "ASSIGNMENT" ? (
            <Button
              onClick={handleToggleCompletion}
              disabled={isPending}
              size="sm"
              className={cn(
                "flex-1 font-semibold sm:flex-none sm:px-8",
                isCompleted
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {isCompleted
                ? "Completed"
                : isLast
                  ? "Complete Course"
                  : "Mark as Complete"}
            </Button>
          ) : (
            <div className="flex flex-1 items-center justify-center gap-2 text-xs text-muted-foreground sm:flex-none sm:px-8">
              <Sparkles className="h-3.5 w-3.5" />
              {lesson.type === "QUIZ"
                ? "Pass the quiz to continue"
                : "Submit to complete"}
            </div>
          )}

          <Button
            variant={isCompleted || !nextLessonId ? "default" : "outline"}
            size="sm"
            onClick={goNext}
            disabled={!nextLessonId || isPending}
            className={cn(
              "shrink-0",
              isCompleted && nextLessonId && "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            <span className="hidden sm:inline">Next</span>
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>

      <AITutor courseTitle={courseTitle} lessonTitle={lesson.title} />
    </div>
  );
}
