"use client";

import { Card, CardContent } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { cn } from "@/shared/lib/utils";
import { CheckCircle2, BarChart2 } from "lucide-react";

interface PollOption {
  id: string;
  text: string;
  votes: {
    userId: string;
  }[];
}

interface Poll {
  id: string;
  question: string;
  closedAt: Date | null;
  options: PollOption[];
}

interface PollResultsProps {
  poll: Poll;
}

export function PollResults({ poll }: PollResultsProps) {
  // Calculate total votes
  const totalVotes = poll.options.reduce((acc, opt) => acc + opt.votes.length, 0);

  // Find max vote count to highlight winner
  const maxVotes = Math.max(...poll.options.map((o) => o.votes.length));

  return (
    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm overflow-hidden">
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="text-sm font-bold text-neutral-850 dark:text-neutral-50">{poll.question}</h3>
            <span className="text-[10px] text-neutral-400 font-semibold flex items-center gap-1 mt-1">
              <BarChart2 className="h-3.5 w-3.5" />
              {totalVotes} total votes cast
            </span>
          </div>
        </div>

        <div className="space-y-3.5">
          {poll.options.map((option) => {
            const voteCount = option.votes.length;
            const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
            const isWinner = voteCount === maxVotes && voteCount > 0;

            return (
              <div key={option.id} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={cn(
                    "text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5",
                    isWinner && "text-indigo-600 dark:text-indigo-400 font-extrabold"
                  )}>
                    {option.text}
                    {isWinner && <CheckCircle2 className="h-3.5 w-3.5" />}
                  </span>
                  <span className="text-neutral-400">{Math.round(percentage)}% ({voteCount})</span>
                </div>
                <Progress 
                  value={percentage} 
                  className={cn("h-2", isWinner ? "bg-indigo-100 dark:bg-indigo-950/30" : "bg-neutral-100 dark:bg-neutral-850")}
                  style={{
                    // Next.js custom styling mapping or background fallback
                  }}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
