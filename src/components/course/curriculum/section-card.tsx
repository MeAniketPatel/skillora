"use client";

import { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  Layers,
  Trash2,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/shared/components/ui/card";
import { LessonItem } from "./lesson-item";
import { AddLessonForm } from "./add-section-form";
import type { CurriculumSection } from "./curriculum.shared";

interface SectionCardProps {
  section: CurriculumSection;
  index: number;
  totalSections: number;
  courseId: string;
  isPending: boolean;
  onUpdateTitle: (title: string) => void;
  onDelete: () => void;
  onMove: (direction: "up" | "down") => void;
  onAddLesson: (title: string) => void;
  onUpdateLessonTitle: (lessonId: string, title: string) => void;
  onToggleLessonFree: (lessonId: string, currentVal: boolean) => void;
  onToggleLessonPublish: (lessonId: string, currentVal: boolean) => void;
  onDeleteLesson: (lessonId: string) => void;
  onMoveLesson: (lessonId: string, direction: "up" | "down") => void;
}

export function SectionCard({
  section,
  index,
  totalSections,
  courseId,
  isPending,
  onUpdateTitle,
  onDelete,
  onMove,
  onAddLesson,
  onUpdateLessonTitle,
  onToggleLessonFree,
  onToggleLessonPublish,
  onDeleteLesson,
  onMoveLesson,
}: SectionCardProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(section.title);
  const [newLessonTitle, setNewLessonTitle] = useState("");

  const saveTitle = () => {
    if (!editedTitle.trim()) {
      setIsEditingTitle(false);
      setEditedTitle(section.title);
      return;
    }
    onUpdateTitle(editedTitle);
    setIsEditingTitle(false);
  };

  return (
    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
      <CardHeader className="p-4 flex flex-row items-center justify-between gap-x-2 space-y-0">
        <div className="flex items-center gap-x-2 flex-1 min-w-0">
          <Layers className="h-4 w-4 text-neutral-400 shrink-0" />
          {isEditingTitle ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="h-8 max-w-[240px]"
                autoFocus
              />
              <Button size="sm" onClick={saveTitle} disabled={isPending}>
                Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditingTitle(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <span
              onClick={() => {
                setIsEditingTitle(true);
                setEditedTitle(section.title);
              }}
              className="font-semibold text-base cursor-pointer hover:underline truncate"
            >
              {section.title}
            </span>
          )}
        </div>

        <div className="flex items-center gap-x-1 shrink-0">
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
            disabled={index === totalSections - 1 || isPending}
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
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-2">
        {section.lessons.map((lesson, lIdx) => (
          <LessonItem
            key={lesson.id}
            courseId={courseId}
            sectionId={section.id}
            lesson={lesson}
            index={lIdx}
            totalLessons={section.lessons.length}
            isPending={isPending}
            onUpdateTitle={(title) => onUpdateLessonTitle(lesson.id, title)}
            onToggleFree={() => onToggleLessonFree(lesson.id, lesson.isFree)}
            onTogglePublish={() =>
              onToggleLessonPublish(lesson.id, lesson.isPublished)
            }
            onDelete={() => onDeleteLesson(lesson.id)}
            onMove={(direction) => onMoveLesson(lesson.id, direction)}
          />
        ))}

        <AddLessonForm
          value={newLessonTitle}
          onChange={setNewLessonTitle}
          onSubmit={() => {
            if (!newLessonTitle.trim()) return;
            onAddLesson(newLessonTitle);
            setNewLessonTitle("");
          }}
          isPending={isPending}
        />
      </CardContent>
    </Card>
  );
}
