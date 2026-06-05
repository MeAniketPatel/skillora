"use client";

import { BarChart, Users, UserCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { computeWeeklyEnrollmentCounts } from "./analytics.shared";
import type { AnalyticsStudentRow } from "./analytics.shared";

interface AnalyticsOverviewProps {
  students: AnalyticsStudentRow[];
}

export function AnalyticsOverview({ students }: AnalyticsOverviewProps) {
  const total = students.length;
  const avgProgress =
    total > 0
      ? Math.round(
          students.reduce((acc, curr) => acc + curr.progress, 0) / total,
        )
      : 0;
  const completions = students.filter((s) => s.completed).length;

  const chartData = computeWeeklyEnrollmentCounts(students);
  const maxVal = Math.max(...chartData, 1);
  const points = chartData
    .map((val, idx) => {
      const x = idx * 100;
      const y = 120 - (val / maxVal) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          title="Active Students"
          value={total}
          helper="Unique enrolled participants"
          icon={<Users className="h-4 w-4 text-neutral-400" />}
        />
        <KpiCard
          title="Average Progress"
          value={`${avgProgress}%`}
          helper="Platform syllabus completion metric"
          icon={<BarChart className="h-4 w-4 text-neutral-400" />}
          valueClassName="text-blue-600 dark:text-blue-400"
        />
        <KpiCard
          title="Syllabus Completions"
          value={completions}
          helper="Students achieving 100% course status"
          icon={<UserCheck className="h-4 w-4 text-neutral-400" />}
          valueClassName="text-green-600 dark:text-green-400"
        />
      </div>

      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
        <CardHeader>
          <CardTitle>Enrollment Trends (Past 6 Weeks)</CardTitle>
          <p className="text-xs text-neutral-500">
            Track the velocity of student sign-ups across modules.
          </p>
        </CardHeader>
        <CardContent className="h-48 flex items-center justify-center p-6 relative">
          {total === 0 ? (
            <span className="text-xs text-neutral-400 italic">
              No enrollment data to render.
            </span>
          ) : (
            <EnrollmentChart points={points} chartData={chartData} maxVal={maxVal} />
          )}
        </CardContent>
      </Card>
    </>
  );
}

function KpiCard({
  title,
  value,
  helper,
  icon,
  valueClassName,
}: {
  title: string;
  value: number | string;
  helper: string;
  icon: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-extrabold ${valueClassName ?? ""}`}>
          {value}
        </div>
        <p className="text-[10px] text-neutral-400 mt-1">{helper}</p>
      </CardContent>
    </Card>
  );
}

function EnrollmentChart({
  points,
  chartData,
  maxVal,
}: {
  points: string;
  chartData: number[];
  maxVal: number;
}) {
  return (
    <div className="w-full h-full relative flex flex-col justify-between">
      <svg
        viewBox="-10 0 520 130"
        className="w-full h-[110px] stroke-indigo-600 dark:stroke-indigo-400 fill-none"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <defs>
          <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path
          d={`M 0,120 L ${points} L 500,120 Z`}
          fill="url(#chartGlow)"
          stroke="none"
        />
        <path d={`M ${points}`} />
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
  );
}
