"use client";

import React from "react";
import { Flame, Award, Calendar } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface StudyStreak {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date | null;
  freezeCount: number;
}

interface StreakWidgetProps {
  streak: StudyStreak;
}

export function StreakWidget({ streak }: StreakWidgetProps) {
  const lastActiveText = streak.lastActivityDate
    ? `Last studied ${formatDistanceToNow(new Date(streak.lastActivityDate), { addSuffix: true })}`
    : "No study activity recorded yet";

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border-orange-200/30 dark:border-orange-950/20 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-6 flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-500 text-white rounded-xl animate-pulse">
              <Flame className="h-5 w-5 fill-current" />
            </div>
            <div>
              <h3 className="text-lg font-bold leading-none tracking-tight">
                {streak.currentStreak}-Day Study Streak!
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {lastActiveText}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs pt-2">
            <span className="flex items-center gap-1 text-neutral-600 dark:text-neutral-300">
              <Award className="h-4 w-4 text-amber-500" />
              Longest: <strong className="font-semibold text-foreground">{streak.longestStreak} days</strong>
            </span>
            <span className="flex items-center gap-1 text-neutral-600 dark:text-neutral-300">
              <Calendar className="h-4 w-4 text-blue-500" />
              Freezes available: <strong className="font-semibold text-foreground">{streak.freezeCount}</strong>
            </span>
          </div>
        </div>

        <div className="hidden sm:block text-right">
          <span className="text-[10px] tracking-wider uppercase font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 dark:bg-orange-400/10 px-2.5 py-1 rounded-md">
            Keep it up!
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
