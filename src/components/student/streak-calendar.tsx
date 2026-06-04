"use client";

import React from "react";
import { format, subDays, isSameDay } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StudySession {
  id: string;
  duration: number;
  date: Date;
}

interface StreakCalendarProps {
  sessions: StudySession[];
}

export function StreakCalendar({ sessions }: StreakCalendarProps) {
  // Generate last 84 days (12 weeks)
  const days = Array.from({ length: 84 }, (_, i) => subDays(new Date(), 83 - i));

  const getDaySessionInfo = (day: Date) => {
    const daySessions = sessions.filter((s) => isSameDay(new Date(s.date), day));
    const totalDuration = daySessions.reduce((acc, s) => acc + s.duration, 0);
    return {
      count: daySessions.length,
      durationMinutes: Math.round(totalDuration / 60),
    };
  };

  const getIntensityClass = (minutes: number) => {
    if (minutes === 0) return "bg-neutral-100 dark:bg-neutral-800/40";
    if (minutes < 15) return "bg-emerald-200 dark:bg-emerald-900/30 text-emerald-800";
    if (minutes < 45) return "bg-emerald-400 dark:bg-emerald-700/50";
    return "bg-emerald-600 dark:bg-emerald-500";
  };

  return (
    <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold tracking-tight">Study Activity Map</h3>
        <span className="text-xs text-neutral-400">Past 12 Weeks</span>
      </div>

      <TooltipProvider>
        <div className="grid grid-flow-col grid-rows-7 gap-1.5 justify-start overflow-x-auto pb-2">
          {days.map((day) => {
            const { count, durationMinutes } = getDaySessionInfo(day);
            const intensity = getIntensityClass(durationMinutes);
            const formattedDate = format(day, "MMM dd, yyyy");

            return (
              <Tooltip key={day.toISOString()}>
                <TooltipTrigger asChild>
                  <div
                    className={`h-3 w-3 rounded-sm transition-all duration-200 hover:scale-125 cursor-pointer ${intensity}`}
                  />
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs rounded-lg px-2.5 py-1">
                  <div>
                    <span className="font-semibold">{formattedDate}</span>
                    <p className="text-[10px] text-neutral-400">
                      {durationMinutes > 0
                        ? `Studied ${durationMinutes} mins (${count} session${count > 1 ? "s" : ""})`
                        : "No study activity recorded"}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>

      <div className="flex items-center justify-end gap-1.5 mt-4 text-[10px] text-neutral-400">
        <span>Less</span>
        <div className="h-2.5 w-2.5 rounded-sm bg-neutral-100 dark:bg-neutral-800/40" />
        <div className="h-2.5 w-2.5 rounded-sm bg-emerald-200 dark:bg-emerald-900/30" />
        <div className="h-2.5 w-2.5 rounded-sm bg-emerald-400 dark:bg-emerald-700/50" />
        <div className="h-2.5 w-2.5 rounded-sm bg-emerald-600 dark:bg-emerald-500" />
        <span>More</span>
      </div>
    </div>
  );
}
