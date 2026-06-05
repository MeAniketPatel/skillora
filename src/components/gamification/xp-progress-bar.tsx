"use client";

import { Progress } from "@/components/ui/progress";
import { Sparkles, Trophy } from "lucide-react";

interface XPProgressBarProps {
  points: number;
}

export function XPProgressBar({ points }: XPProgressBarProps) {
  // Let's compute levels based on simple formula:
  // Level 1: 0 - 99 XP
  // Level 2: 100 - 249 XP (needs 150)
  // Level 3: 250 - 749 XP (needs 500)
  // Level 4: 750 - 2999 XP (needs 2250)
  // Level 5: 3000+ XP
  
  const getLevelInfo = (xp: number) => {
    if (xp < 100) return { level: 1, min: 0, max: 100, label: "Beginner Learner" };
    if (xp < 250) return { level: 2, min: 100, max: 250, label: "Knowledge Seeker" };
    if (xp < 750) return { level: 3, min: 250, max: 750, label: "Dedicated Scholar" };
    if (xp < 3000) return { level: 4, min: 750, max: 3000, label: "Wisdom Achiever" };
    return { level: 5, min: 3000, max: 10000, label: "Grandmaster Expert" };
  };

  const { level, min, max, label } = getLevelInfo(points);
  const range = max - min;
  const progressXP = points - min;
  const percentage = Math.min(100, Math.max(0, (progressXP / range) * 100));

  return (
    <div className="space-y-3 bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 p-5 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-full flex items-center justify-center font-extrabold text-sm border border-amber-100 dark:border-amber-900/30">
            {level}
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-850 dark:text-neutral-50">Level {level}</h4>
            <p className="text-[10px] text-neutral-450 font-medium">{label}</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-neutral-500">{points} / {max} XP</span>
      </div>

      <Progress value={percentage} className="h-2 rounded-full" />
      <div className="flex items-center justify-between text-[9px] text-neutral-450 font-medium">
        <span>{points - min} XP earned in this level</span>
        <span>{max - points} XP to Level {level + 1}</span>
      </div>
    </div>
  );
}
