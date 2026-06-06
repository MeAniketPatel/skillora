"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  approveModerationItemAction,
  rejectModerationItemAction,
} from "@/features/moderation";
import { ShieldCheck, Check, X, Shield, AlertTriangle } from "lucide-react";

interface ModerationItemType {
  id: string;
  contentType: "REVIEW" | "DISCUSSION" | "BLOG_POST" | "COMMENT";
  contentId: string;
  reason: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
}

interface ContentModerationQueueProps {
  initialItems: ModerationItemType[];
}

export function ContentModerationQueue({ initialItems }: ContentModerationQueueProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleApprove = (id: string) => {
    startTransition(async () => {
      const res = await approveModerationItemAction(id);
      if (!res.success) {
        alert(res.error || "Failed to approve item.");
      } else {
        router.refresh();
      }
    });
  };

  const handleReject = (id: string) => {
    startTransition(async () => {
      const res = await rejectModerationItemAction(id);
      if (!res.success) {
        alert(res.error || "Failed to reject item.");
      } else {
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-neutral-850 dark:text-neutral-50 flex items-center gap-2">
          <Shield className="h-4 w-4 text-indigo-500" />
          Flagged Content Moderation Queue
        </h2>
        <Badge variant="outline" className="text-xs">
          {initialItems.length} items pending
        </Badge>
      </div>

      {initialItems.length === 0 ? (
        <Card className="border border-dashed border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-12 text-center bg-white dark:bg-neutral-900 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center space-y-3 p-0">
            <div className="h-12 w-12 rounded-full bg-green-50 dark:bg-green-950/20 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-sm font-semibold text-neutral-850 dark:text-neutral-50">All clean!</p>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              There are no pending items in the moderation queue. Flagged comments or posts will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {initialItems.map((item) => (
            <Card
              key={item.id}
              className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 border-none font-bold text-[10px]">
                      {item.contentType.replace("_", " ")}
                    </Badge>
                    <span className="text-[10px] text-neutral-400">
                      ID: {item.contentId}
                    </span>
                    <span className="text-[10px] text-neutral-400">•</span>
                    <span className="text-[10px] text-neutral-400">
                      Flagged on {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-neutral-600 dark:text-neutral-350 italic">
                      Reason: &ldquo;{item.reason || "Reported by platform user/moderator for review"}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
                  <Button
                    onClick={() => handleApprove(item.id)}
                    disabled={isPending}
                    variant="outline"
                    className="h-9 rounded-xl text-xs gap-1.5 border-green-200 text-green-600 hover:bg-green-50 dark:border-green-900/30 dark:text-green-400 dark:hover:bg-green-950/20"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Approve / Dismiss
                  </Button>
                  <Button
                    onClick={() => handleReject(item.id)}
                    disabled={isPending}
                    variant="outline"
                    className="h-9 rounded-xl text-xs gap-1.5 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-950/20"
                  >
                    <X className="h-3.5 w-3.5" />
                    Reject / Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
