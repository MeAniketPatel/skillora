"use client";

import { useState } from "react";
import { Check, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import type { AnalyticsStudentRow } from "./analytics.shared";

interface AnalyticsStudentsTableProps {
  students: AnalyticsStudentRow[];
}

export function AnalyticsStudentsTable({
  students,
}: AnalyticsStudentsTableProps) {
  const [search, setSearch] = useState("");
  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
      <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <CardTitle>Enrolled Participants</CardTitle>
          <CardDescription>
            Track specific progress metrics and details for students.
          </CardDescription>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 p-2 text-xs w-full focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </CardHeader>
      <CardContent>
        {filtered.length === 0 ? (
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
              {filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-semibold text-xs">{s.name}</TableCell>
                  <TableCell className="text-neutral-500 text-xs">
                    {s.email}
                  </TableCell>
                  <TableCell className="text-neutral-500 text-xs">
                    {s.courseTitle}
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden shrink-0">
                        <div
                          className="h-full bg-indigo-600 dark:bg-indigo-400"
                          style={{ width: `${s.progress}%` }}
                        />
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
  );
}
