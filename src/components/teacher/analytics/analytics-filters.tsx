"use client";

import { BookOpen, FileSpreadsheet } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface AnalyticsFiltersProps {
  courses: { id: string; title: string }[];
  selectedCourseId: string;
  onCourseChange: (id: string) => void;
  onExport: () => void;
}

export function AnalyticsFilters({
  courses,
  selectedCourseId,
  onCourseChange,
  onExport,
}: AnalyticsFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 p-4 rounded-2xl">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <BookOpen className="h-5 w-5 text-neutral-400 shrink-0" />
        <select
          value={selectedCourseId}
          onChange={(e) => onCourseChange(e.target.value)}
          className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 p-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-64"
        >
          <option value="ALL">All Curriculum Programs</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      <Button
        onClick={onExport}
        variant="outline"
        size="sm"
        className="font-semibold w-full sm:w-auto flex items-center gap-1"
      >
        <FileSpreadsheet className="h-4 w-4" /> Export Student List (CSV)
      </Button>
    </div>
  );
}
