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
  Menu
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toggleLessonCompletion } from "@/actions/enrollment.actions";

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

interface LessonPlayerProps {
  courseId: string;
  courseTitle: string;
  lesson: {
    id: string;
    title: string;
    content: string | null;
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
          // Auto navigate to next lesson on completion
          router.push(`/learn/${courseId}/${nextLessonId}`);
        }
      }
    });
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

        {/* Lesson Body Content */}
        <div className="flex-1 p-6 md:p-10 max-w-3xl mx-auto w-full space-y-6">
          <h1 className="text-3xl font-extrabold tracking-tight">{lesson.title}</h1>
          
          <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm">
            <CardContent className="p-6 prose dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-300">
              <div dangerouslySetInnerHTML={{ __html: lesson.content || "<p>This lesson has no written content.</p>" }} />
            </CardContent>
          </Card>

          {/* Completion controls */}
          <div className="flex justify-end pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <Button
              onClick={handleToggleCompletion}
              disabled={isPending}
              className={`font-semibold ${isCompleted ? "bg-green-600 hover:bg-green-700" : ""}`}
            >
              {isCompleted ? "Completed" : "Mark as Complete"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
