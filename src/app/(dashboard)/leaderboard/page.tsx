import { getLeaderboardRankings, getUserXPPoints, getUserBadgesList } from "@/features/gamification";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Leaderboard } from "@/features/gamification";
import { XPProgressBar } from "@/features/gamification";
import { BadgeShowcase } from "@/features/gamification";
import { Trophy, Sparkles } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";

export const metadata = {
  title: "Leaderboard & Achievements | Skillora",
  description: "View global rankings, track your XP study points, and unlock learning badges.",
};

export default async function LeaderboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id!;
  const rankings = await getLeaderboardRankings(10);
  const xpPoints = await getUserXPPoints(userId);
  const unlockedBadges = await getUserBadgesList(userId);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title / Hero */}
      <div className="bg-gradient-to-tr from-indigo-500/10 via-indigo-500/5 to-transparent border border-indigo-250/20 dark:border-indigo-900/30 p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute right-6 top-6 opacity-10">
          <Trophy className="h-24 w-24 text-indigo-500 animate-pulse" />
        </div>

        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-indigo-100/50 text-indigo-700 border-indigo-250 dark:bg-indigo-950/20 dark:text-indigo-400 text-[10px] font-bold">
              Gamified Learning
            </Badge>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-850 dark:text-neutral-50 flex items-center gap-2">
            Leaderboard & Badges
          </h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-350 leading-relaxed">
            Gain XP study points by completing lessons, passing quizzes, and participating in peer reviews. Unlock badges and compare your achievements with other learners.
          </p>
        </div>
      </div>

      {/* User Progress Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-1">
          <h3 className="text-sm font-bold text-neutral-850 dark:text-neutral-50 mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            Your Current Progress
          </h3>
          <XPProgressBar points={xpPoints} />
        </div>

        {/* Leaderboard Ranking Table */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-neutral-850 dark:text-neutral-50 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" />
            Global Rankings (Top 10)
          </h3>
          <Leaderboard rankings={rankings} />
        </div>
      </div>

      {/* Badge showcase */}
      <BadgeShowcase unlockedBadges={unlockedBadges} />
    </div>
  );
}
