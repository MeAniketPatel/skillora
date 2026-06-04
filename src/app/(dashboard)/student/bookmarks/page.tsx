import React from "react";
import Link from "next/link";
import { Bookmark, ArrowRight, BookOpen } from "lucide-react";
import { requireAuth } from "@/lib/auth-helpers";
import { getUserBookmarks } from "@/data/bookmark.data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";

export default async function BookmarksPage() {
  const user = await requireAuth();
  const bookmarks = await getUserBookmarks(user.id);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Bookmarked Lessons"
        description="Quickly jump back to lessons you've saved for review."
      />

      {bookmarks.length === 0 ? (
        <EmptyState
          title="No bookmarks saved"
          description="Bookmark lessons while studying to see them here."
          icon={Bookmark}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {bookmarks.map((bookmark) => {
            const lesson = bookmark.lesson;
            const section = lesson.section;
            const course = section.course;

            return (
              <Card
                key={bookmark.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 hover:shadow-md transition-shadow duration-300 rounded-2xl overflow-hidden"
              >
                <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] tracking-wider uppercase font-bold text-neutral-400 dark:text-neutral-500">
                      {course.title}
                    </span>
                    <h3 className="text-base font-bold tracking-tight">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      Section: {section.title}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Link
                      href={`/learn/${course.id}/${lesson.id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all duration-300"
                    >
                      <span>Resume Study</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
