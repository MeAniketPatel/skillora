"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { closePollAction, deletePollAction } from "@/actions/poll.actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PollResults } from "./poll-results";
import { Trash2, Lock, Eye, BarChart3, HelpCircle } from "lucide-react";

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

interface PollListProps {
  polls: Poll[];
  courseId: string;
}

export function PollList({ polls, courseId }: PollListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClose = (id: string) => {
    if (!confirm("Are you sure you want to close this poll? Voting will end immediately.")) return;

    startTransition(async () => {
      const res = await closePollAction(courseId, id);
      if (!res.success) {
        alert(res.error || "Failed to close poll.");
      } else {
        router.refresh();
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this poll? This cannot be undone.")) return;

    startTransition(async () => {
      const res = await deletePollAction(courseId, id);
      if (!res.success) {
        alert(res.error || "Failed to delete poll.");
      } else {
        router.refresh();
      }
    });
  };

  if (polls.length === 0) {
    return (
      <Card className="border border-dashed border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-8 text-center bg-white dark:bg-neutral-900 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center space-y-3 p-0">
          <div className="h-10 w-10 rounded-full bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center">
            <HelpCircle className="h-5 w-5 text-neutral-400" />
          </div>
          <p className="text-sm font-semibold text-neutral-850 dark:text-neutral-50">No polls created yet</p>
          <p className="text-xs text-neutral-400">
            Create polls to gather quick feedback or quiz your students in real-time.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {polls.map((poll) => (
        <Card key={poll.id} className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm overflow-hidden">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-850 pb-3">
              <div className="flex items-center gap-2">
                <Badge variant={poll.closedAt ? "secondary" : "outline"} className={poll.closedAt ? "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 border-none" : "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 border-none"}>
                  {poll.closedAt ? "Closed" : "Active"}
                </Badge>
              </div>

              <div className="flex items-center gap-1">
                {!poll.closedAt && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleClose(poll.id)}
                    disabled={isPending}
                    className="text-xs h-8 gap-1 rounded-xl text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50"
                  >
                    <Lock className="h-3.5 w-3.5" />
                    Close
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(poll.id)}
                  disabled={isPending}
                  className="h-8 w-8 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-955/20 rounded-xl"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <PollResults poll={poll} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
