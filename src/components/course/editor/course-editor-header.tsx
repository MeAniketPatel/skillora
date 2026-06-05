"use client";

import Link from "next/link";
import { ArrowLeft, LayoutGrid, GraduationCap } from "lucide-react";
import LinkButton from "@/components/ui/link-button";
import { Button } from "@/components/ui/button";

interface CourseEditorHeaderProps {
  courseId: string;
  courseStatus: string;
  completedFields: number;
  totalFields: number;
  isPending: boolean;
  isPublishable: boolean;
  onTogglePublish: () => void;
}

export function CourseEditorHeader({
  courseId,
  courseStatus,
  completedFields,
  totalFields,
  isPending,
  isPublishable,
  onTogglePublish,
}: CourseEditorHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-x-2">
        <LinkButton variant="ghost" size="icon" href="/teacher/courses">
          <ArrowLeft className="h-4 w-4" />
        </LinkButton>
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-primary" />
            Course Setup
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
              {completedFields}/{totalFields} fields completed
            </span>
          </h1>
          <p className="text-sm text-neutral-500">
            Edit course details, thumbnail, pricing, and curriculum.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-x-2">
        <Link
          href={`/teacher/courses/${courseId}/curriculum`}
          className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground text-sm font-medium"
        >
          <LayoutGrid className="h-4 w-4" />
          Curriculum
        </Link>
        <Button
          variant={courseStatus === "PUBLISHED" ? "outline" : "default"}
          onClick={onTogglePublish}
          disabled={isPending || (courseStatus !== "PUBLISHED" && !isPublishable)}
        >
          {courseStatus === "PUBLISHED" ? "Unpublish" : "Publish"}
        </Button>
      </div>
    </div>
  );
}
