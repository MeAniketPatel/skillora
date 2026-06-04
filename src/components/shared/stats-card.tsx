import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: string | number;
    isPositive?: boolean;
    description?: string;
  };
  className?: string;
}

export function StatsCard({
  label,
  value,
  icon: Icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn("bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm transition-all hover:shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          {label}
        </CardTitle>
        {Icon && (
          <div className="h-8 w-8 rounded-lg bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center border border-neutral-100 dark:border-neutral-850">
            <Icon className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-3xl font-extrabold tracking-tight">{value}</div>
        {trend && (
          <div className="flex items-center gap-x-1.5 text-xs">
            <span
              className={cn(
                "font-semibold px-1.5 py-0.5 rounded-md",
                trend.isPositive
                  ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                  : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
              )}
            >
              {trend.value}
            </span>
            {trend.description && (
              <span className="text-neutral-500 font-medium">
                {trend.description}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
