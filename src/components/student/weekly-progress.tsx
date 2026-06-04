"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface WeeklyProgressData {
  day: string; // Mon, Tue...
  lessons: number;
  minutes: number;
}

interface WeeklyProgressProps {
  data: WeeklyProgressData[];
}

export function WeeklyProgress({ data }: WeeklyProgressProps) {
  return (
    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl overflow-hidden hover:shadow-sm transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-sm font-bold tracking-tight">Weekly Learning Activity</CardTitle>
        <CardDescription>Auditing study time & completed lessons for the current week.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <XAxis
                dataKey="day"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <RechartsTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const dataPoint = payload[0].payload as WeeklyProgressData;
                    return (
                      <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-3 rounded-xl shadow-lg space-y-1 text-xs">
                        <p className="font-bold">{dataPoint.day}</p>
                        <p className="text-neutral-500 flex justify-between gap-4">
                          <span>Lessons:</span>
                          <strong className="text-foreground">{dataPoint.lessons}</strong>
                        </p>
                        <p className="text-neutral-500 flex justify-between gap-4">
                          <span>Study Time:</span>
                          <strong className="text-foreground">{dataPoint.minutes} mins</strong>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="minutes"
                fill="currentColor"
                radius={[4, 4, 0, 0]}
                className="fill-primary/80 hover:fill-primary transition-colors duration-200"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
