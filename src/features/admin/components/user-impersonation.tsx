"use client";

import { useTransition } from "react";
import { useAdminActions } from "@/features/admin/hooks/use-admin";
import { Button } from "@/shared/components/ui/button";
import { impersonateUserAction, stopImpersonationAction } from "@/features/impersonations";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ImpersonateButtonProps {
  userId: string;
}

export function ImpersonateButton({ userId }: ImpersonateButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleImpersonate = () => {
    startTransition(async () => {
      const res = await impersonateUserAction(userId);
      if (!res.success) {
        alert(res.error || "Failed to start impersonation.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={handleImpersonate}
      className="text-xs rounded-xl h-8 gap-1 border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-950/20"
    >
      {isPending ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Eye className="h-3.5 w-3.5" />
      )}
      Impersonate
    </Button>
  );
}

export function StopImpersonationBanner() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleStop = () => {
    startTransition(async () => {
      const res = await stopImpersonationAction();
      if (!res.success) {
        alert(res.error || "Failed to stop impersonation.");
      } else {
        router.push("/admin/users");
        router.refresh();
      }
    });
  };

  return (
    <div className="bg-indigo-650 text-white text-xs py-2 px-4 flex items-center justify-between font-medium">
      <div className="flex items-center gap-2">
        <EyeOff className="h-4 w-4 shrink-0 text-indigo-200 animate-pulse" />
        <span>You are currently viewing the platform impersonating a user.</span>
      </div>
      <Button
        variant="secondary"
        size="sm"
        disabled={isPending}
        onClick={handleStop}
        className="h-7 text-[10px] px-3 bg-white text-indigo-700 hover:bg-white/95 rounded-lg font-bold shrink-0"
      >
        {isPending ? (
          <Loader2 className="h-3 w-3 animate-spin text-indigo-700" />
        ) : (
          "Return to Admin"
        )}
      </Button>
    </div>
  );
}
