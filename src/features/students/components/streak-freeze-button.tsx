"use client";

import React, { useTransition } from "react";
import { Snowflake, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { purchaseStreakFreezeAction } from "@/actions/streak.actions";
import { toast } from "sonner";

interface StreakFreezeButtonProps {
  userPoints: number;
  freezeCost?: number;
}

export function StreakFreezeButton({
  userPoints,
  freezeCost = 100,
}: StreakFreezeButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handlePurchase = () => {
    if (userPoints < freezeCost) {
      toast.error(`You need at least ${freezeCost} points. Current: ${userPoints}`);
      return;
    }

    startTransition(async () => {
      const result = await purchaseStreakFreezeAction();
      if (result.success) {
        toast.success("Streak Freeze purchased successfully!");
      } else {
        toast.error(result.error || "Failed to purchase Streak Freeze");
      }
    });
  };

  return (
    <Button
      variant="outline"
      onClick={handlePurchase}
      disabled={isPending || userPoints < freezeCost}
      className="rounded-xl flex items-center gap-2 border-blue-200 dark:border-blue-900 bg-blue-50/50 hover:bg-blue-50 dark:bg-blue-950/20 dark:hover:bg-blue-950/30 text-blue-700 dark:text-blue-400"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Snowflake className="h-4 w-4 fill-current" />
      )}
      <span>Buy Streak Freeze ({freezeCost} pts)</span>
    </Button>
  );
}
