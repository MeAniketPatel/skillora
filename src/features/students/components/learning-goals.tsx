"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { Trash2, Calendar, Target, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";
import { Card, CardContent } from "@/shared/components/ui/card";
import { deleteGoalAction } from "@/features/learning-goals";
import { toast } from "sonner";
import { format } from "date-fns";

interface LearningGoal {
  id: string;
  type: string;
  target: number;
  current: number;
  targetDate: Date;
}

interface LearningGoalsProps {
  goals: LearningGoal[];
  compact?: boolean;
}

export function LearningGoals({ goals, compact = false }: LearningGoalsProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteGoalAction(id);
      if (result.success) {
        toast.success("Goal deleted successfully");
      } else {
        toast.error(result.error || "Failed to delete goal");
      }
    });
  };

  if (goals.length === 0) {
    return (
      <div className="text-center py-6 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/10">
        <Target className="h-8 w-8 text-neutral-400 mx-auto mb-2" />
        <p className="text-sm font-semibold">No active goals</p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs mx-auto">
          Set targets for your weekly or monthly learning to keep yourself accountable.
        </p>
        {!compact && (
          <Link
            href="/student/goals"
            className="inline-flex items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800 h-9 px-3 text-xs mt-4 font-semibold"
          >
            Create a Goal
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => {
        const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));
        const colorClass = goal.type === "WEEKLY" ? "bg-blue-600" : "bg-violet-600";
        const badgeColor = goal.type === "WEEKLY"
          ? "text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/20"
          : "text-violet-700 bg-violet-50 dark:text-violet-400 dark:bg-violet-950/20";

        return (
          <Card key={goal.id} className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl overflow-hidden hover:shadow-sm transition-shadow duration-300">
            <CardContent className="p-5 space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${badgeColor}`}>
                      {goal.type}
                    </span>
                    <span className="text-xs text-neutral-400 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      by {format(new Date(goal.targetDate), "MMM dd, yyyy")}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold tracking-tight pt-1">
                    Complete {goal.target} lesson{goal.target > 1 ? "s" : ""}
                  </h4>
                </div>
                {!compact && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(goal.id)}
                    disabled={isPending}
                    className="h-8 w-8 text-neutral-400 hover:text-red-600 rounded-xl"
                  >
                    {isPending ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>Progress: {goal.current} / {goal.target} lessons</span>
                  <span className="font-semibold text-foreground">{percent}%</span>
                </div>
                <Progress value={percent} className="h-2 rounded-full" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
export type { LearningGoal };
