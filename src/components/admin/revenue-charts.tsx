"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatPrice } from "@/shared/lib/utils";

interface RevenueChartsProps {
  timeSeries: { date: string; amount: number }[];
  byTeacher: { name: string; revenue: number }[];
  byCourse: { title: string; revenue: number }[];
}

export function RevenueCharts({ timeSeries, byTeacher, byCourse }: RevenueChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Revenue Timeline */}
      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-bold">Revenue Timeline</CardTitle>
          <CardDescription className="text-[11px]">
            Platform gross sales trended over time.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeries} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" className="dark:stroke-neutral-800" />
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                formatter={(value: any) => [formatPrice(value), "Revenue"]}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "12px",
                  border: "1px solid rgba(0,0,0,0.1)",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#4f46e5"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#revenueGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Courses & Top Teachers Column */}
      <div className="flex flex-col gap-6 lg:col-span-1">
        {/* Top Courses */}
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold">Top Courses</CardTitle>
            <CardDescription className="text-[11px]">
              Top 5 highest grossing courses.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[180px] w-full">
            {byCourse.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-neutral-500 italic">
                No course data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byCourse} layout="vertical" margin={{ left: -10, right: 10, top: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="title"
                    type="category"
                    stroke="#888888"
                    fontSize={9}
                    tickLine={false}
                    axisLine={false}
                    width={70}
                  />
                  <Tooltip
                    formatter={(value: any) => [formatPrice(value), "Revenue"]}
                    contentStyle={{ fontSize: "10px", borderRadius: "8px" }}
                  />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Top Teachers */}
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold">Top Instructors</CardTitle>
            <CardDescription className="text-[11px]">
              Top 5 highest grossing teachers.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[180px] w-full">
            {byTeacher.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-neutral-500 italic">
                No instructor data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byTeacher} layout="vertical" margin={{ left: -10, right: 10, top: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#888888"
                    fontSize={9}
                    tickLine={false}
                    axisLine={false}
                    width={70}
                  />
                  <Tooltip
                    formatter={(value: any) => [formatPrice(value), "Revenue"]}
                    contentStyle={{ fontSize: "10px", borderRadius: "8px" }}
                  />
                  <Bar dataKey="revenue" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
