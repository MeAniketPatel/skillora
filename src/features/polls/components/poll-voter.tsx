"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { voteInPollAction } from "../actions/poll.actions";
import { Card, CardContent } from "@/shared/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/utils";
import { Check } from "lucide-react";

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

interface PollVoterProps {
  poll: Poll;
  currentUserId: string;
  courseId: string;
}

export function PollVoter({ poll, currentUserId, courseId }: PollVoterProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Find if user has already voted, and which option they voted for
  const userVote = poll.options.find((opt) =>
    opt.votes.some((v) => v.userId === currentUserId)
  );

  const handleVote = (optionId: string) => {
    if (poll.closedAt || isPending) return;

    startTransition(async () => {
      const res = await voteInPollAction(courseId, poll.id, optionId);
      if (!res.success) {
        alert(res.error || "Failed to submit vote.");
      } else {
        router.refresh();
      }
    });
  };

  return (
    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm overflow-hidden">
      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-neutral-850 dark:text-neutral-50">{poll.question}</h3>
          {poll.closedAt && (
            <span className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded-full mt-1 inline-block">
              Closed
            </span>
          )}
        </div>

        <div className="space-y-2">
          {poll.options.map((option) => {
            const isSelected = userVote?.id === option.id;
            return (
              <button
                key={option.id}
                onClick={() => handleVote(option.id)}
                disabled={!!poll.closedAt || isPending}
                className={cn(
                  "w-full flex items-center justify-between p-3 text-xs font-semibold rounded-xl border text-left transition-all duration-200",
                  isSelected
                    ? "border-indigo-500 bg-indigo-50/20 text-indigo-700 dark:text-indigo-400"
                    : "border-neutral-200 dark:border-neutral-850 hover:bg-neutral-50/50 dark:hover:bg-neutral-850/50 text-neutral-700 dark:text-neutral-300"
                )}
              >
                <span>{option.text}</span>
                {isSelected && <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
