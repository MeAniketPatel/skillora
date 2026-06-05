"use client";

import { useState, useMemo } from "react";
import { AnalyticsFilters } from "./analytics-filters";
import { AnalyticsOverview } from "./analytics-overview";
import { AnalyticsSubmissions } from "./analytics-submissions";
import { AnalyticsStudentsTable } from "./analytics-students-table";
import {
  exportStudentsToCsv,
  flattenStudents,
  type AnalyticsCourse,
  type AnalyticsSubmission,
} from "./analytics.shared";

interface AnalyticsClientProps {
  initialCourses: AnalyticsCourse[];
  initialSubmissions: AnalyticsSubmission[];
}

export function AnalyticsClient({
  initialCourses,
  initialSubmissions,
}: AnalyticsClientProps) {
  const [selectedCourseId, setSelectedCourseId] = useState("ALL");
  const [submissions, setSubmissions] = useState<AnalyticsSubmission[]>(initialSubmissions);

  const students = useMemo(
    () => flattenStudents(initialCourses, selectedCourseId),
    [initialCourses, selectedCourseId],
  );

  const handleExport = () => exportStudentsToCsv(students);

  const handleGraded = (id: string, score: number, feedback: string) => {
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === id ? { ...sub, score, feedback, status: "GRADED" } : sub,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <AnalyticsFilters
        courses={initialCourses.map((c) => ({ id: c.id, title: c.title }))}
        selectedCourseId={selectedCourseId}
        onCourseChange={setSelectedCourseId}
        onExport={handleExport}
      />
      <AnalyticsOverview students={students} />
      <AnalyticsSubmissions submissions={submissions} onGraded={handleGraded} />
      <AnalyticsStudentsTable students={students} />
    </div>
  );
}
