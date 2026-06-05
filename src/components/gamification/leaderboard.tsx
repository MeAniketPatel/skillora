"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Star, Sparkles, User } from "lucide-react";

interface LeaderboardUser {
  id: string;
  name: string | null;
  image: string | null;
  points: number;
  headline: string | null;
}

interface LeaderboardProps {
  rankings: LeaderboardUser[];
}

export function Leaderboard({ rankings }: LeaderboardProps) {
  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-amber-500 fill-amber-500/10 animate-bounce" />;
      case 2:
        return <Trophy className="h-4.5 w-4.5 text-neutral-400 fill-neutral-400/10" />;
      case 3:
        return <Trophy className="h-4 w-4 text-amber-600 fill-amber-600/10" />;
      default:
        return <span className="text-xs font-mono font-bold text-neutral-400">{rank}</span>;
    }
  };

  return (
    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/20 hover:bg-transparent">
              <TableHead className="py-4 pl-6 w-16 text-center font-bold text-neutral-500 text-xs">Rank</TableHead>
              <TableHead className="py-4 font-bold text-neutral-500 text-xs">Student</TableHead>
              <TableHead className="py-4 font-bold text-neutral-500 text-xs">Headline</TableHead>
              <TableHead className="py-4 pr-6 text-right font-bold text-neutral-500 text-xs">XP Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rankings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-neutral-500 italic text-sm">
                  No rankings logged yet. Start studying!
                </TableCell>
              </TableRow>
            ) : (
              rankings.map((user, idx) => {
                const rank = idx + 1;
                return (
                  <TableRow
                    key={user.id}
                    className="border-b border-neutral-100 dark:border-neutral-800/80 hover:bg-neutral-50/20 dark:hover:bg-neutral-950/10"
                  >
                    <TableCell className="py-4 pl-6 text-center">
                      <span className="flex items-center justify-center">
                        {getRankBadge(rank)}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.image || ""} />
                          <AvatarFallback className="bg-neutral-100 dark:bg-neutral-800">
                            <User className="h-4 w-4 text-neutral-400" />
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-bold text-neutral-850 dark:text-neutral-50">
                          {user.name || "Learner"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-xs text-neutral-500">
                      {user.headline || "Studying on Skillora"}
                    </TableCell>
                    <TableCell className="py-4 pr-6 text-right font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">
                      {user.points} XP
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
