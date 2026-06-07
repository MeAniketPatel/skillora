import type { Metadata } from "next";
import { getReferralStats } from "@/features/referrals/server";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ReferralDashboard } from "@/features/referrals/server";
import { Badge } from "@/shared/components/ui/badge";
import { Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Referral Program",
  description: "Invite your friends to learn on Skillora and earn study points.",
};

export default async function ReferralsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id!;
  const stats = await getReferralStats(userId);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-tr from-indigo-500/10 via-indigo-500/5 to-transparent border border-indigo-250/20 dark:border-indigo-900/30 p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute right-6 top-6 opacity-10">
          <Users className="h-24 w-24 text-indigo-500" />
        </div>

        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-indigo-100/50 text-indigo-700 border-indigo-250 dark:bg-indigo-950/20 dark:text-indigo-400 text-[10px] font-bold">
              Affiliate Program
            </Badge>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-850 dark:text-neutral-50 flex items-center gap-2">
            Invite Friends, Earn XP Discounts
          </h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-350 leading-relaxed">
            Invite your peers to join Skillora. Once they register and verify their accounts, you will immediately earn 100 XP. Use your accumulated points at checkout to receive massive course discounts (100 XP = $1 discount).
          </p>
        </div>
      </div>

      <ReferralDashboard
        referrals={stats.referrals as any}
        totalCount={stats.totalCount}
        convertedCount={stats.convertedCount}
        pointsEarned={stats.pointsEarned}
        userId={userId}
      />
    </div>
  );
}

