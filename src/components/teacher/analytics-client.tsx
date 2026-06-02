"use client";

import React, { useState, useTransition } from "react";
import { 
  BarChart, 
  BookOpen, 
  Check, 
  Download, 
  FileSpreadsheet, 
  GraduationCap, 
  Search, 
  UserCheck, 
  Users,
  Award
} from "lucide-react";
import { gradeSubmission } from "@/actions/assignment.actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AnalyticsClientProps {
  initialCourses: any[];
  initialSubmissions: any[];
}

export function AnalyticsClient({ initialCourses, initialSubmissions }: AnalyticsClientProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("ALL");
  const [studentSearch, setStudentSearch] = useState("");
  const [submissions, setSubmissions] = useState<any[]>(initialSubmissions);
  
  // Grading form states
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [score, setScore] = useState<number>(100);
  const [feedback, setFeedback] = useState("");
  const [isPending, startTransition] = useTransition();

  // Filter courses based on drop-down selection
  const filteredCourses = selectedCourseId === "ALL" 
    ? initialCourses 
    : initialCourses.filter(c => c.id === selectedCourseId);

  // Flatten students/enrollments from filtered courses
  const students = filteredCourses.flatMap(course => 
    course.enrollments.map((e: any) => ({
      id: e.id,
      name: e.user.name || e.user.email,
      email: e.user.email,
      courseTitle: course.title,
      progress: e.progress,
      enrolledAt: new Date(e.createdAt),
      completed: e.progress === 100
    }))
  );

  // Search filter
  const searchedStudents = students.filter(s => 
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.email.toLowerCase().includes(studentSearch.toLowerCase())
  );

  // Calculations
  const totalEnrollments = students.length;
  const avgProgress = totalEnrollments > 0 
    ? Math.round(students.reduce((acc, curr) => acc + curr.progress, 0) / totalEnrollments) 
    : 0;
  const completions = students.filter(s => s.completed).length;

  // Chart data: past 6 weeks enrollment counts
  const getWeeklyEnrollments = () => {
    const counts = [0, 0, 0, 0, 0, 0];
    const now = new Date();
    
    students.forEach(s => {
      const diffMs = now.getTime() - s.enrolledAt.getTime();
      const diffWeeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
      if (diffWeeks >= 0 && diffWeeks < 6) {
        counts[5 - diffWeeks]++;
      }
    });
    
    return counts;
  };

  const chartData = getWeeklyEnrollments();
  const maxVal = Math.max(...chartData, 1);
  const points = chartData.map((val, idx) => {
    const x = idx * 100;
    const y = 120 - (val / maxVal) * 100;
    return `${x},${y}`;
  }).join(" ");

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Student Name", "Email", "Enrolled Course", "Progress (%)", "Completion Status"];
    const rows = searchedStudents.map(s => [
      s.name,
      s.email,
      s.courseTitle,
      `${s.progress}%`,
      s.completed ? "Completed" : "In Progress"
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `skillora_students_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Grade Submission
  const handleGrade = (id: string) => {
    startTransition(async () => {
      const res = await gradeSubmission(id, score, feedback);
      if (res.success) {
        setSubmissions(prev => 
          prev.map(sub => sub.id === id ? { ...sub, score, feedback, status: "GRADED" } : sub)
        );
        setGradingId(null);
        setFeedback("");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters and CSV export bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 p-4 rounded-2xl">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <BookOpen className="h-5 w-5 text-neutral-400 shrink-0" />
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 p-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-64"
          >
            <option value="ALL">All Curriculum Programs</option>
            {initialCourses.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>

        <Button onClick={handleExportCSV} variant="outline" size="sm" className="font-semibold w-full sm:w-auto flex items-center gap-1">
          <FileSpreadsheet className="h-4 w-4" /> Export Student List (CSV)
        </Button>
      </div>

      {/* Main KPI Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Active Students</CardTitle>
            <Users className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">{totalEnrollments}</div>
            <p className="text-[10px] text-neutral-400 mt-1">Unique enrolled participants</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Average Progress</CardTitle>
            <BarChart className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">{avgProgress}%</div>
            <p className="text-[10px] text-neutral-400 mt-1">Platform syllabus completion metric</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Syllabus Completions</CardTitle>
            <UserCheck className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-green-600 dark:text-green-400">{completions}</div>
            <p className="text-[10px] text-neutral-400 mt-1">Students achieving 100% course status</p>
          </CardContent>
        </Card>
      </div>

      {/* SVG Chart Block */}
      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
        <CardHeader>
          <CardTitle>Enrollment Trends (Past 6 Weeks)</CardTitle>
          <CardDescription>Track the velocity of student sign-ups across modules.</CardDescription>
        </CardHeader>
        <CardContent className="h-48 flex items-center justify-center p-6 relative">
          {totalEnrollments === 0 ? (
            <span className="text-xs text-neutral-400 italic">No enrollment data to render.</span>
          ) : (
            <div className="w-full h-full relative flex flex-col justify-between">
              <svg viewBox="-10 0 520 130" className="w-full h-[110px] stroke-indigo-600 dark:stroke-indigo-400 fill-none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <defs>
                  <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0.0"/>
                  </linearGradient>
                </defs>
                {/* Area under curve */}
                <path d={`M 0,120 L ${points} L 500,120 Z`} fill="url(#chartGlow)" stroke="none" />
                {/* Chart Line */}
                <path d={`M ${points}`} />
                {/* Points nodes */}
                {chartData.map((val, idx) => (
                  <circle 
                    key={idx} 
                    cx={idx * 100} 
                    cy={120 - (val / maxVal) * 100} 
                    r="4" 
                    className="fill-white dark:fill-neutral-900 stroke-indigo-600 dark:stroke-indigo-400" 
                    strokeWidth="2.5" 
                  />
                ))}
              </svg>
              <div className="flex justify-between text-[10px] font-bold text-neutral-400 px-4 mt-2">
                <span>5 weeks ago</span>
                <span>4 weeks ago</span>
                <span>3 weeks ago</span>
                <span>2 weeks ago</span>
                <span>1 week ago</span>
                <span>This week</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assignment Grading list */}
      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
        <CardHeader>
          <CardTitle>Deliverables & Assignment Reviews</CardTitle>
          <CardDescription>Evaluate student assignments and publish grading feedback.</CardDescription>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <div className="text-center py-8 text-xs text-neutral-400 italic">
              No assignment submissions recorded yet.
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((sub) => {
                const gradingMode = gradingId === sub.id;

                return (
                  <div key={sub.id} className="p-4 border border-neutral-200/60 dark:border-neutral-800/60 rounded-xl bg-neutral-50/50 dark:bg-neutral-950/20 space-y-3">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                          {sub.user.name || sub.user.email}
                        </h4>
                        <span className="text-[10px] text-neutral-400 block mt-0.5">
                          {sub.lesson.section.course.title} &rarr; {sub.lesson.title}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {sub.status === "GRADED" ? (
                          <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 px-2 py-0.5 rounded-full">
                            Score: {sub.score}/100
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-full animate-pulse">
                            Pending Review
                          </span>
                        )}
                        
                        {sub.status !== "GRADED" && !gradingMode && (
                          <Button size="sm" className="h-7 text-xs font-bold" onClick={() => setGradingId(sub.id)}>
                            Grade Deliverable
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="p-3 bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200/50 dark:border-neutral-800/40 text-xs text-neutral-600 dark:text-neutral-300 font-mono whitespace-pre-wrap">
                      {sub.content}
                    </div>

                    {gradingMode && (
                      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 space-y-4 animate-in fade-in-50 duration-150">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">Score (0-100)</label>
                            <input 
                              type="number"
                              min="0"
                              max="100"
                              value={score}
                              onChange={(e) => setScore(Number(e.target.value))}
                              className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 p-2 text-xs w-full"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">Feedback comments</label>
                            <input 
                              type="text"
                              value={feedback}
                              onChange={(e) => setFeedback(e.target.value)}
                              placeholder="Great work on this task..."
                              className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 p-2 text-xs w-full"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => setGradingId(null)} className="h-8 text-xs font-semibold">
                            Cancel
                          </Button>
                          <Button size="sm" onClick={() => handleGrade(sub.id)} disabled={isPending} className="h-8 text-xs font-bold">
                            Submit Grade
                          </Button>
                        </div>
                      </div>
                    )}

                    {sub.status === "GRADED" && sub.feedback && (
                      <div className="text-[11px] text-neutral-500 italic pt-1 border-t border-neutral-100 dark:border-neutral-800/50">
                        Feedback: "{sub.feedback}"
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enrolled Students Table */}
      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
        <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle>Enrolled Participants</CardTitle>
            <CardDescription>Track specific progress metrics and details for students.</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="pl-8 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 p-2 text-xs w-full focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </CardHeader>
        <CardContent>
          {searchedStudents.length === 0 ? (
            <div className="text-center py-10 text-neutral-500 italic text-xs">
              No students match the criteria.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Completion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchedStudents.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-semibold text-xs">{s.name}</TableCell>
                    <TableCell className="text-neutral-500 text-xs">{s.email}</TableCell>
                    <TableCell className="text-neutral-500 text-xs">{s.courseTitle}</TableCell>
                    <TableCell className="text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden shrink-0">
                          <div className="h-full bg-indigo-600 dark:bg-indigo-400" style={{ width: `${s.progress}%` }} />
                        </div>
                        <span className="font-bold">{s.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      {s.completed ? (
                        <span className="inline-flex items-center gap-1 font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 px-2 py-0.5 rounded-full">
                          <Check className="h-3 w-3" /> Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center font-semibold text-neutral-500 bg-neutral-50 dark:bg-neutral-800/40 px-2 py-0.5 rounded-full">
                          In Progress
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
