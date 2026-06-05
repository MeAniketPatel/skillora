"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface TrendIndicatorProps {
  value: number;
  showPercent?: boolean;
}

export function TrendIndicator({ value, showPercent = true }: TrendIndicatorProps) {
  if (value === 0) {
    return (
      <div className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-500">
        <Minus className="h-3 w-3" />
        <span>0{showPercent ? "%" : ""}</span>
      </div>
    );
  }

  const isPositive = value > 0;
  const colorClass = isPositive
    ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30"
    : "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30";

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${colorClass}`}>
      {isPositive ? (
        <ArrowUpRight className="h-3 w-3 shrink-0" />
      ) : (
        <ArrowDownRight className="h-3 w-3 shrink-0" />
      )}
      <span>
        {isPositive ? "+" : ""}
        {value}
        {showPercent ? "%" : ""}
      </span>
    </div>
  );
}
