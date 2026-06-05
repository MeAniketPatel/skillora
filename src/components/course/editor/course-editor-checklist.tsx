"use client";

import Link from "next/link";
import { CheckCircle, Check, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ChecklistItem } from "./course-editor.shared";

interface CourseEditorChecklistProps {
  courseId: string;
  items: ChecklistItem[];
}

export function CourseEditorChecklist({
  courseId,
  items,
}: CourseEditorChecklistProps) {
  const completed = items.filter((i) => i.completed).length;
  const total = items.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-neutral-800 dark:text-neutral-100">
          <CheckCircle className="h-5 w-5 text-indigo-500" />
          Publishing Checklist
        </CardTitle>
        <CardDescription>
          Complete all required fields to publish your course. ({completed}/
          {total} completed)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ProgressBar percent={percent} completed={completed} total={total} />

        <ul className="space-y-2.5 pt-2">
          {items.map((item, idx) => (
            <ChecklistRow key={idx} item={item} courseId={courseId} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function ProgressBar({
  percent,
  completed,
  total,
}: {
  percent: number;
  completed: number;
  total: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-neutral-500">
        <span>Progress</span>
        <span className="font-semibold">{percent}%</span>
      </div>
      <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2">
        <div
          className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="sr-only">
        {completed} of {total} checklist items complete
      </p>
    </div>
  );
}

function ChecklistRow({
  item,
  courseId,
}: {
  item: ChecklistItem;
  courseId: string;
}) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-neutral-600 dark:text-neutral-300">
      {item.completed ? (
        <span className="p-0.5 rounded-full bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 mt-0.5">
          <Check className="h-3.5 w-3.5 stroke-[3px]" />
        </span>
      ) : (
        <span className="p-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 mt-0.5">
          <X className="h-3.5 w-3.5 stroke-[3px]" />
        </span>
      )}
      <div className="flex flex-col">
        <span
          className={
            item.completed
              ? "line-through text-neutral-400 dark:text-neutral-600 font-medium"
              : "font-medium text-neutral-700 dark:text-neutral-200"
          }
        >
          {item.label}
        </span>
        {!item.completed && item.label === "At least one published lesson" && (
          <Link
            href={`/teacher/courses/${courseId}/curriculum`}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline mt-0.5 font-semibold"
          >
            Go to Curriculum Builder →
          </Link>
        )}
      </div>
    </li>
  );
}
