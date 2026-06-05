"use client";

import React, { useTransition } from "react";
import { Folder, Trash2, X, Play, GraduationCap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { deleteCollectionAction, removeCourseFromCollectionAction } from "@/features/collections";
import { toast } from "sonner";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  level: string;
  teacher: { name: string | null };
}

interface Collection {
  id: string;
  name: string;
  description: string | null;
  courses: {
    course: Course;
  }[];
}

interface CourseCollectionProps {
  collections: Collection[];
}

export function CourseCollections({ collections }: CourseCollectionProps) {
  const [isPending, startTransition] = useTransition();

  const handleDeleteCollection = (id: string) => {
    startTransition(async () => {
      const result = await deleteCollectionAction(id);
      if (result.success) {
        toast.success("Collection deleted");
      } else {
        toast.error(result.error || "Failed to delete collection");
      }
    });
  };

  const handleRemoveCourse = (collectionId: string, courseId: string) => {
    startTransition(async () => {
      const result = await removeCourseFromCollectionAction({ collectionId, courseId });
      if (result.success) {
        toast.success("Course removed from collection");
      } else {
        toast.error(result.error || "Failed to remove course");
      }
    });
  };

  if (collections.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl bg-neutral-50/50 dark:bg-neutral-900/10">
        <Folder className="h-10 w-10 text-neutral-400 mx-auto mb-3" />
        <p className="text-sm font-semibold">No custom playlists created</p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
          Group courses into playlists to structure your study sequences.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {collections.map((collection) => (
        <Card key={collection.id} className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl overflow-hidden hover:shadow-sm transition-shadow duration-300">
          <CardHeader className="p-6 pb-4 border-b border-neutral-100 dark:border-neutral-800/50 flex flex-row items-start justify-between gap-4 space-y-0 bg-neutral-50/20 dark:bg-neutral-900/10">
            <div className="space-y-1">
              <CardTitle className="text-lg font-bold tracking-tight">{collection.name}</CardTitle>
              {collection.description && (
                <CardDescription className="text-xs">{collection.description}</CardDescription>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              disabled={isPending}
              onClick={() => handleDeleteCollection(collection.id)}
              className="h-8 w-8 text-neutral-400 hover:text-red-600 rounded-xl"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            {collection.courses.length === 0 ? (
              <p className="text-xs text-neutral-400 italic py-2">This collection has no courses yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {collection.courses.map(({ course }) => (
                  <div
                    key={course.id}
                    className="flex items-center gap-3 p-3 border border-neutral-100 dark:border-neutral-800/40 rounded-xl hover:bg-neutral-50/50 dark:hover:bg-neutral-900/20 transition-colors duration-200 group relative"
                  >
                    <div className="h-12 w-20 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden relative shrink-0 flex items-center justify-center">
                      {course.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                      ) : (
                        <GraduationCap className="h-5 w-5 text-neutral-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pr-6">
                      <h5 className="text-xs font-bold leading-tight truncate group-hover:text-primary transition-colors">
                        <Link href={`/courses/${course.slug}`}>{course.title}</Link>
                      </h5>
                      <p className="text-[10px] text-neutral-400 mt-1 truncate">
                        By {course.teacher.name || "Instructor"} • {course.level.replace("_", " ")}
                      </p>
                    </div>

                    <div className="absolute right-2 flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveCourse(collection.id, course.id)}
                        disabled={isPending}
                        className="h-7 w-7 text-neutral-400 hover:text-red-500 rounded-lg"
                        title="Remove from playlist"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
