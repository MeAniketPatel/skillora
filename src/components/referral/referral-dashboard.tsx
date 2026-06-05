"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useClipboard } from "@/hooks/use-clipboard";
import { toast } from "sonner";
import { Share2, Copy, Users, Trophy, CheckCircle, ArrowRight } from "lucide-react";

interface ReferralUser {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
}

interface Referral {
  id: string;
  isConverted: boolean;
  pointsAwarded: number;
  createdAt: Date;
  referred: ReferralUser;
}

interface ReferralDashboardProps {
  referrals: Referral[];
  totalCount: number;
  convertedCount: number;
  pointsEarned: number;
  userId: string;
}

export function ReferralDashboard({
  referrals,
  totalCount,
  convertedCount,
  pointsEarned,
  userId,
}: ReferralDashboardProps) {
  // personalized referral link
  const referralLink = typeof window !== "undefined"
    ? `${window.location.origin}/register?ref=${userId}`
    : `https://skillora.com/register?ref=${userId}`;

  const { copy, copied } = useClipboard();

  const handleCopy = () => {
    copy(referralLink);
    toast.success("Referral link copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      {/* Stats summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 rounded-full flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900/30">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-450 uppercase font-bold">Total Referred</span>
              <h4 className="text-lg font-bold text-neutral-800 dark:text-neutral-50 font-mono mt-0.5">{totalCount}</h4>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-full flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/30">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-450 uppercase font-bold">Converted / Signed Up</span>
              <h4 className="text-lg font-bold text-neutral-800 dark:text-neutral-50 font-mono mt-0.5">{convertedCount}</h4>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-full flex items-center justify-center shrink-0 border border-amber-100 dark:border-amber-900/30">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-450 uppercase font-bold">Points Earned</span>
              <h4 className="text-lg font-bold text-neutral-800 dark:text-neutral-50 font-mono mt-0.5">{pointsEarned} XP</h4>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Share Section */}
      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-1.5">
            <Share2 className="h-4 w-4 text-indigo-500" /> Share Referral Link
          </h4>
          <p className="text-[10px] text-neutral-500 mt-0.5">Invite your peers to Skillora. You will earn 100 XP points for every convert signup!</p>
        </div>

        <div className="flex gap-2">
          <Input
            readOnly
            value={referralLink}
            className="flex-1 text-xs font-mono bg-neutral-50 dark:bg-neutral-950/40 border-neutral-200/50 dark:border-neutral-800/50 text-neutral-600 dark:text-neutral-350"
          />
          <Button
            onClick={handleCopy}
            variant="outline"
            className="rounded-xl text-xs gap-1 font-bold shrink-0"
          >
            <Copy className="h-4 w-4" />
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </Card>

      {/* Referral History Table */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Referrals History</h4>
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/20">
                <TableHead className="py-3 pl-5 text-neutral-500 text-xs font-bold">Email</TableHead>
                <TableHead className="py-3 text-neutral-500 text-xs font-bold">Signed Up Date</TableHead>
                <TableHead className="py-3 text-neutral-500 text-xs font-bold">Status</TableHead>
                <TableHead className="py-3 pr-5 text-right text-neutral-500 text-xs font-bold">Reward</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-neutral-500 italic text-xs">
                    You haven&apos;t referred anyone yet. Share your link to start earning rewards!
                  </TableCell>
                </TableRow>
              ) : (
                referrals.map((r) => (
                  <TableRow key={r.id} className="border-b border-neutral-100 dark:border-neutral-850 last:border-0">
                    <TableCell className="py-3.5 pl-5 text-xs font-bold text-neutral-800 dark:text-neutral-150">
                      {r.referred.email}
                    </TableCell>
                    <TableCell className="py-3.5 text-xs text-neutral-500">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="py-3.5">
                      {r.isConverted ? (
                        <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-none font-bold text-[9px] py-0.5 px-2">
                          Active Learner
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="font-bold text-[9px] py-0.5 px-2 text-neutral-400">
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-3.5 pr-5 text-right font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">
                      +{r.pointsAwarded} XP
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
