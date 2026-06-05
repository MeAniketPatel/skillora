export interface AnalyticsCourse {
  id: string;
  title: string;
  enrollments: {
    id: string;
    progress: number;
    createdAt: Date | string;
    user: {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
    };
  }[];
  sections: { lessons: { id: string; type: string }[] }[];
}

export interface AnalyticsSubmission {
  id: string;
  status: string;
  score: number | null;
  feedback: string | null;
  content: string;
  user: { name: string | null; email: string };
  lesson: {
    title: string;
    section: { course: { title: string } };
  };
}

export interface AnalyticsStudentRow {
  id: string;
  name: string;
  email: string;
  courseTitle: string;
  progress: number;
  enrolledAt: Date;
  completed: boolean;
}

export function flattenStudents(
  courses: AnalyticsCourse[],
  selectedCourseId: string,
): AnalyticsStudentRow[] {
  const filtered =
    selectedCourseId === "ALL"
      ? courses
      : courses.filter((c) => c.id === selectedCourseId);

  return filtered.flatMap((course) =>
    course.enrollments.map((e) => ({
      id: e.id,
      name: e.user.name || e.user.email,
      email: e.user.email,
      courseTitle: course.title,
      progress: e.progress,
      enrolledAt: new Date(e.createdAt),
      completed: e.progress === 100,
    })),
  );
}

export function computeWeeklyEnrollmentCounts(students: AnalyticsStudentRow[]): number[] {
  const counts = [0, 0, 0, 0, 0, 0];
  const now = new Date();
  students.forEach((s) => {
    const diffMs = now.getTime() - s.enrolledAt.getTime();
    const diffWeeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
    if (diffWeeks >= 0 && diffWeeks < 6) {
      counts[5 - diffWeeks]++;
    }
  });
  return counts;
}

export function exportStudentsToCsv(students: AnalyticsStudentRow[]) {
  const headers = [
    "Student Name",
    "Email",
    "Enrolled Course",
    "Progress (%)",
    "Completion Status",
  ];
  const rows = students.map((s) => [
    s.name,
    s.email,
    s.courseTitle,
    `${s.progress}%`,
    s.completed ? "Completed" : "In Progress",
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [
      headers.join(","),
      ...rows.map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    `skillora_students_export_${new Date().toISOString().split("T")[0]}.csv`,
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
