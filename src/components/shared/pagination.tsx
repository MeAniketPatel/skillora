"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LinkButton from "@/components/ui/link-button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createPageUrl = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  return (
    <div className="flex items-center justify-center gap-x-2 py-4">
      <LinkButton
        href={isFirst ? "#" : createPageUrl(currentPage - 1)}
        variant="outline"
        size="icon"
        className={cn(
          "h-9 w-9 rounded-xl transition-all duration-200 border-neutral-200/60 dark:border-neutral-800/60 hover:bg-neutral-50 dark:hover:bg-neutral-900/50",
          isFirst && "pointer-events-none opacity-40"
        )}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </LinkButton>

      <span className="text-xs font-semibold text-neutral-500 px-3 select-none">
        Page {currentPage} of {totalPages}
      </span>

      <LinkButton
        href={isLast ? "#" : createPageUrl(currentPage + 1)}
        variant="outline"
        size="icon"
        className={cn(
          "h-9 w-9 rounded-xl transition-all duration-200 border-neutral-200/60 dark:border-neutral-800/60 hover:bg-neutral-50 dark:hover:bg-neutral-900/50",
          isLast && "pointer-events-none opacity-40"
        )}
        aria-label="Go to next page"
      >
        <ChevronRight className="h-4 w-4" />
      </LinkButton>
    </div>
  );
}
