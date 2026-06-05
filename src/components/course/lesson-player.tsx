"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  CheckCircle, 
  Circle, 
  ArrowLeft, 
  ArrowRight, 
  Layers, 
  BookOpen,
  Menu,
  File,
  Download
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { toggleLessonCompletion } from "@/actions/enrollment.actions";
import { VideoPlayer } from "@/shared/components/shared/video-player";
import QuizView from "@/components/course/quiz-view";
import AssignmentView from "@/components/course/assignment-view";
import { AITutor } from "@/components/learn/ai-tutor";

interface Lesson {
  id: string;
  title: string;
  isFree: boolean;
  isPublished: boolean;
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

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
  sections: Section[];
  completedLessonIds: string[];
  nextLessonId: string | null;
  prevLessonId: string | null;
}

export default function LessonPlayer({
  courseId,
  courseTitle,
  lesson,
  sections,
  completedLessonIds,
  nextLessonId,
  prevLessonId,
}: LessonPlayerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isCompleted = completedLessonIds.includes(lesson.id);

  const handleToggleCompletion = () => {
    startTransition(async () => {
      const res = await toggleLessonCompletion(courseId, lesson.id, !isCompleted);
      if (res.success) {
        router.refresh();
        if (!isCompleted && nextLessonId) {
          router.push(`/learn/${courseId}/${nextLessonId}`);
        }
      }
    });
  };

  const handleVideoComplete = () => {
    // Refresh player progress state
    router.refresh();
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-neutral-50 dark:bg-neutral-950 overflow-hidden relative">
      
      {/* Sidebar - Course Index */}
      <aside className={`shrink-0 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-all duration-300 flex flex-col ${
        sidebarOpen ? "w-80" : "w-0 -translate-x-full md:w-0 md:-translate-x-full"
      } h-full overflow-hidden absolute md:relative z-20`}>
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <h2 className="font-bold text-sm truncate">{courseTitle}</h2>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="md:hidden">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-4">
          {sections.map((section) => (
            <div key={section.id} className="space-y-1.5">
              <div className="flex items-center gap-1 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                <Layers className="h-3.5 w-3.5" />
                <span>{section.title}</span>
              </div>
              <div className="space-y-1">
                {section.lessons.map((les) => {
                  const lesCompleted = completedLessonIds.includes(les.id);
                  const isCurrent = les.id === lesson.id;

                  return (
                    <Link
                      key={les.id}
                      href={`/learn/${courseId}/${les.id}`}
                      className={`flex items-center gap-2 px-3 py-2 text-xs rounded-lg transition-colors ${
                        isCurrent 
                          ? "bg-neutral-900 text-white dark:bg-neutral-50 dark:text-neutral-900 font-semibold"
                          : "hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
                      }`}
                    >
                      {lesCompleted ? (
                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-neutral-300 dark:text-neutral-700 shrink-0" />
                      )}
                      <span className="truncate">{les.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main learning container */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-neutral-50 dark:bg-neutral-950 overflow-y-auto">
        {/* Top toolbar */}
        <div className="h-14 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center px-6 justify-between shrink-0">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex gap-2">
            {prevLessonId && (
              <Button variant="outline" size="sm" onClick={() => router.push(`/learn/${courseId}/${prevLessonId}`)}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Prev
              </Button>
            )}
            {nextLessonId && (
              <Button variant="outline" size="sm" onClick={() => router.push(`/learn/${courseId}/${nextLessonId}`)}>
                Next <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>

        {/* Video Player Header (if lesson is video type) */}
        {lesson.type === "VIDEO" && lesson.videoUrl && (
          <div className="bg-black w-full flex justify-center border-b border-neutral-200 dark:border-neutral-800">
            <div className="w-full max-w-5xl p-4 md:p-6">
              <VideoPlayer
                courseId={courseId}
                lessonId={lesson.id}
                videoUrl={lesson.videoUrl}
                initialPosition={lesson.initialPosition}
                onComplete={handleVideoComplete}
              />
            </div>
          </div>
        )}

        {/* Lesson Body Content */}
        <div className="flex-1 p-6 md:p-10 max-w-3xl mx-auto w-full space-y-6">
          <h1 className="text-3xl font-extrabold tracking-tight">{lesson.title}</h1>
          
          {lesson.type === "ARTICLE" && (
            <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm">
              <CardContent className="p-6 prose dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-300">
                <div dangerouslySetInnerHTML={{ __html: lesson.content || "<p>This lesson has no written content.</p>" }} />
              </CardContent>
            </Card>
          )}

          {lesson.type === "QUIZ" && lesson.quiz && (
            <QuizView
              courseId={courseId}
              lessonId={lesson.id}
              quiz={lesson.quiz}
            />
          )}

          {lesson.type === "ASSIGNMENT" && (
            <AssignmentView
              lessonId={lesson.id}
              initialSubmission={lesson.submission}
            />
          )}

          {/* Attachments Section */}
          {lesson.attachments && lesson.attachments.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <h3 className="font-bold text-sm text-neutral-700 dark:text-neutral-300">Resources & Materials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lesson.attachments.map((file) => (
                  <a
                    key={file.id}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <File className="h-5 w-5 text-primary shrink-0" />
                      <span className="text-sm font-medium truncate text-neutral-700 dark:text-neutral-300">
                        {file.name}
                      </span>
                    </div>
                    <Download className="h-4 w-4 text-neutral-400 group-hover:text-primary transition-colors shrink-0 ml-2" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Completion controls */}
          {lesson.type !== "QUIZ" && lesson.type !== "ASSIGNMENT" && (
            <div className="flex justify-end pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <Button
                onClick={handleToggleCompletion}
                disabled={isPending}
                className={`font-semibold ${isCompleted ? "bg-green-600 hover:bg-green-700" : ""}`}
              >
                {isCompleted ? "Completed" : "Mark as Complete"}
              </Button>
            </div>
          )}
        </div>
      </div>
      <AITutor courseTitle={courseTitle} lessonTitle={lesson.title} />
    </div>
  );
}
