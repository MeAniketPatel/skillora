"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  PlayCircle,
  FileText,
  ClipboardList,
  ListChecks,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export interface LessonSidebarSection {
  id: string;
  title: string;
  lessons: LessonSidebarItem[];
}

export interface LessonSidebarItem {
  id: string;
  title: string;
  type: "VIDEO" | "ARTICLE" | "QUIZ" | "ASSIGNMENT";
  isFree: boolean;
  isCompleted: boolean;
}

export interface LessonSidebarProps {
  courseId: string;
  activeLessonId: string;
  sections: LessonSidebarSection[];
  progressPercent: number;
}

const LESSON_TYPE_ICONS = {
  VIDEO: PlayCircle,
  ARTICLE: FileText,
  QUIZ: ListChecks,
  ASSIGNMENT: ClipboardList,
} as const;

export function LessonSidebar({
  courseId,
  activeLessonId,
  sections,
  progressPercent,
}: LessonSidebarProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    sections.forEach((s) => {
      if (s.lessons.some((l) => l.id === activeLessonId)) initial.add(s.id);
    });
    if (initial.size === 0 && sections[0]) initial.add(sections[0].id);
    return initial;
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalLessons = sections.reduce((acc, s) => acc + s.lessons.length, 0);
  const completedLessons = sections.reduce(
    (acc, s) => acc + s.lessons.filter((l) => l.isCompleted).length,
    0,
  );

  return (
    <>
      <Button
        onClick={() => setIsMobileOpen(true)}
        variant="outline"
        className="fixed bottom-4 right-4 z-40 rounded-full shadow-lg lg:hidden"
      >
        Course Content
      </Button>

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-80 flex-col border-r border-border bg-card transition-transform lg:static lg:z-auto lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Course Progress
            </p>
            <p className="text-sm font-extrabold">
              {completedLessons} / {totalLessons} lessons
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Progress value={progressPercent} className="h-1 rounded-none" />

        <nav className="flex-1 overflow-y-auto p-2">
          <ol className="space-y-2">
            {sections.map((section, idx) => {
              const isOpen = openSections.has(section.id);
              return (
                <li
                  key={section.id}
                  className="rounded-xl border border-border/60 bg-background/40"
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="flex items-center gap-2">
                      <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="text-xs font-bold line-clamp-1">
                        {section.title}
                      </span>
                    </span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>

                  {isOpen && (
                    <ul className="space-y-1 border-t border-border/60 p-1.5">
                      {section.lessons.map((lesson) => {
                        const Icon =
                          LESSON_TYPE_ICONS[lesson.type] ?? PlayCircle;
                        const isActive = lesson.id === activeLessonId;
                        return (
                          <li key={lesson.id}>
                            <Link
                              href={`/learn/${courseId}/${lesson.id}`}
                              onClick={() => setIsMobileOpen(false)}
                              className={cn(
                                "flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs transition",
                                isActive
                                  ? "bg-primary/10 text-primary"
                                  : "hover:bg-muted",
                              )}
                            >
                              {lesson.isCompleted ? (
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                              ) : (
                                <Circle className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                              )}
                              <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                              <span className="line-clamp-1 flex-1">
                                {lesson.title}
                              </span>
                              {lesson.isFree && (
                                <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                                  Free
                                </span>
                              )}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </aside>
    </>
  );
}
