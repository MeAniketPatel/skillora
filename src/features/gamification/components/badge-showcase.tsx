"use client";

import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Trophy, Award, Star, Zap } from "lucide-react";

interface UserBadge {
  badgeId: string;
  awardedAt: Date;
}

interface BadgeShowcaseProps {
  unlockedBadges: UserBadge[];
}

const ALL_BADGES = [
  {
    id: "dedicated_learner",
    name: "Dedicated Learner",
    description: "Earn more than 1,000 XP study points.",
    icon: Award,
    color: "text-indigo-500 bg-indigo-50 border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/30",
  },
  {
    id: "quiz_master",
    name: "Quiz Master",
    description: "Successfully complete 10 curriculum quizzes.",
    icon: Trophy,
    color: "text-amber-500 bg-amber-50 border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/30",
  },
  {
    id: "perfect_score",
    name: "Perfect Score",
    description: "Achieve a perfect 100% grade on any lesson quiz.",
    icon: Star,
    color: "text-green-500 bg-green-50 border-green-100 dark:bg-green-950/20 dark:border-green-900/30",
  },
  {
    id: "weekly_warrior",
    name: "Weekly Warrior",
    description: "Maintain a study streak of 7 consecutive days.",
    icon: Zap,
    color: "text-sky-500 bg-sky-50 border-sky-100 dark:bg-sky-950/20 dark:border-sky-900/30",
  },
];

export function BadgeShowcase({ unlockedBadges }: BadgeShowcaseProps) {
  const unlockedSet = new Set(unlockedBadges.map((b) => b.badgeId));

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-neutral-850 dark:text-neutral-50 flex items-center gap-2">
        <Award className="h-4 w-4 text-indigo-500" />
        Unlocked Achievements
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {ALL_BADGES.map((b) => {
          const isUnlocked = unlockedSet.has(b.id);
          const Icon = b.icon;

          return (
            <Card
              key={b.id}
              className={`border rounded-2xl shadow-sm transition-all ${
                isUnlocked
                  ? "bg-white dark:bg-neutral-900 border-neutral-200/50 dark:border-neutral-800/50"
                  : "bg-neutral-50/50 dark:bg-neutral-950/20 border-neutral-100 dark:border-neutral-900 opacity-60"
              }`}
            >
              <CardContent className="p-5 flex flex-col items-center text-center space-y-3">
                <div className={`h-12 w-12 rounded-full border flex items-center justify-center ${
                  isUnlocked ? b.color : "bg-neutral-100 border-neutral-200 text-neutral-450 dark:bg-neutral-850 dark:border-neutral-800"
                }`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-neutral-850 dark:text-neutral-50">
                    {b.name}
                  </h4>
                  <p className="text-[10px] text-neutral-450 leading-relaxed max-w-[150px] mx-auto">
                    {b.description}
                  </p>
                </div>
                {isUnlocked ? (
                  <Badge className="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400 border-none font-bold text-[9px]">
                    Unlocked
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="font-bold text-[9px] text-neutral-400">
                    Locked
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
