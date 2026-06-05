"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ChevronUp,
  ChevronDown,
  Settings,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LinkButton from "@/components/ui/link-button";
import { cn } from "@/lib/utils";
import type { CurriculumLesson } from "./curriculum.shared";

interface LessonItemProps {
  courseId: string;
  sectionId: string;
  lesson: CurriculumLesson;
  index: number;
  totalLessons: number;
  isPending: boolean;
  onUpdateTitle: (title: string) => void;
  onToggleFree: () => void;
  onTogglePublish: () => void;
  onDelete: () => void;
  onMove: (direction: "up" | "down") => void;
}

export function LessonItem({
  courseId,
  sectionId,
  lesson,
  index,
  totalLessons,
  isPending,
  onUpdateTitle,
  onToggleFree,
  onTogglePublish,
  onDelete,
  onMove,
}: LessonItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(lesson.title);

  const handleSave = () => {
    if (!title.trim()) {
      setIsEditing(false);
      setTitle(lesson.title);
      return;
    }
    onUpdateTitle(title);
    setIsEditing(false);
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between p-2 rounded-lg gap-x-2",
        "bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-200/50 dark:border-neutral-800/50",
      )}
    >
      <div className="flex items-center gap-x-2 flex-1 min-w-0">
        <BookOpen className="h-4 w-4 text-neutral-400 shrink-0" />
        {isEditing ? (
          <div className="flex items-center gap-2 flex-1">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-8 max-w-[200px]"
              autoFocus
            />
            <Button size="sm" onClick={handleSave} disabled={isPending}>
              Save
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <span
            onClick={() => setIsEditing(true)}
            className="text-sm cursor-pointer hover:underline truncate"
          >
            {lesson.title}
          </span>
        )}
      </div>

      <div className="flex items-center gap-x-1 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleFree}
          className={cn(
            "h-7 px-2 text-[10px] uppercase font-bold",
            lesson.isFree
              ? "text-green-600 bg-green-50 dark:bg-green-950/20"
              : "text-neutral-500",
          )}
        >
          Free
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onTogglePublish}
          className={cn(
            "h-7 px-2 text-[10px] uppercase font-bold",
            lesson.isPublished
              ? "text-blue-600 bg-blue-50 dark:bg-blue-950/20"
              : "text-neutral-500",
          )}
        >
          {lesson.isPublished ? "Published" : "Draft"}
        </Button>
        <LinkButton
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          href={`/teacher/courses/${courseId}/lessons/${lesson.id}`}
        >
          <Settings className="h-4 w-4" />
        </LinkButton>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onMove("up")}
          disabled={index === 0 || isPending}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onMove("down")}
          disabled={index === totalLessons - 1 || isPending}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-red-500 hover:text-red-600"
          onClick={onDelete}
          disabled={isPending}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
