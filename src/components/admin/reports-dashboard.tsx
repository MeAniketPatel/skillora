"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ReportsDashboardProps {
  userGrowth: { date: string; count: number }[];
  enrollmentTrends: { date: string; count: number }[];
}

export function ReportsDashboard({ userGrowth, enrollmentTrends }: ReportsDashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* User Growth Chart */}
      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-bold">User Registrations (Last 30 Days)</CardTitle>
          <CardDescription className="text-[11px]">
            Daily new user registrations on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[250px] w-full">
          {userGrowth.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-neutral-500 italic">
              No registration data recorded in the last 30 days.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowth} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="userGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" className="dark:stroke-neutral-800" />
                <XAxis dataKey="date" stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ fontSize: "10px", borderRadius: "8px" }} />
                <Area type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#userGrowthGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Enrollment Trends Chart */}
      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-bold">Course Enrollments (Last 30 Days)</CardTitle>
          <CardDescription className="text-[11px]">
            Daily course checkout and signup transactions.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[250px] w-full">
          {enrollmentTrends.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-neutral-500 italic">
              No enrollment data recorded in the last 30 days.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enrollmentTrends} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="enrollmentTrendsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" className="dark:stroke-neutral-800" />
                <XAxis dataKey="date" stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ fontSize: "10px", borderRadius: "8px" }} />
                <Area type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#enrollmentTrendsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
