"use client";

import React, { useTransition } from "react";
import { Bookmark, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleBookmarkAction } from "@/actions/bookmark.actions";
import { toast } from "sonner";

interface BookmarkButtonProps {
  lessonId: string;
  initialBookmarked: boolean;
}

export function BookmarkButton({
  lessonId,
  initialBookmarked,
}: BookmarkButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [bookmarked, setBookmarked] = React.useState(initialBookmarked);

  const handleToggle = () => {
    // Optimistic update
    setBookmarked(!bookmarked);

    startTransition(async () => {
      const result = await toggleBookmarkAction({ lessonId });
      if (result.success) {
        if (result.data?.bookmarked) {
          toast.success("Lesson bookmarked");
          setBookmarked(true);
        } else {
          toast.success("Bookmark removed");
          setBookmarked(false);
        }
      } else {
        // Rollback on error
        setBookmarked(bookmarked);
        toast.error(result.error || "Failed to update bookmark");
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={isPending}
      className={`rounded-xl h-9 w-9 transition-all duration-300 ${
        bookmarked
          ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30"
          : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
      }`}
      aria-label={bookmarked ? "Remove bookmark" : "Bookmark lesson"}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Bookmark className={`h-4.5 w-4.5 ${bookmarked ? "fill-current" : ""}`} />
      )}
    </Button>
  );
}
