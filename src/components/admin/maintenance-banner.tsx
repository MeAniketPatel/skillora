"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { updateSetting } from "@/actions/settings.actions";
import { AlertTriangle, Wrench, ShieldAlert } from "lucide-react";

interface MaintenanceBannerProps {
  isEnabled: boolean;
}

export function MaintenanceBanner({ isEnabled }: MaintenanceBannerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [active, setActive] = useState(isEnabled);

  const handleToggle = (checked: boolean) => {
    setActive(checked);
    startTransition(async () => {
      const res = await updateSetting({
        key: "maintenance_mode",
        value: checked ? "true" : "false",
      });
      if (!res.success) {
        alert(res.error || "Failed to update maintenance mode setting.");
        setActive(!checked);
      } else {
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-4">
      {active && (
        <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 rounded-2xl">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <div className="flex-1 text-xs">
            <span className="font-bold">Maintenance Mode Active:</span> Public access to the platform is restricted. Only administrators can access pages normally.
          </div>
        </div>
      )}

      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm">
        <CardContent className="p-6 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Wrench className="h-4.5 w-4.5 text-indigo-500" />
              <h3 className="text-sm font-bold text-neutral-850 dark:text-neutral-50">
                Platform Maintenance Mode
              </h3>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              When activated, students and teachers will see a maintenance message and won&apos;t be able to access their portals.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Switch
              id="maintenance-mode-toggle"
              checked={active}
              disabled={isPending}
              onCheckedChange={handleToggle}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
