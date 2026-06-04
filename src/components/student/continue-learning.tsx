import Link from "next/link";
import { GraduationCap, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LinkButton from "@/components/ui/link-button";

interface ContinueLearningItem {
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  thumbnail: string | null;
  progress: number;
  resumeUrl: string;
}

interface ContinueLearningProps {
  items: ContinueLearningItem[];
}

export function ContinueLearning({ items }: ContinueLearningProps) {
  if (items.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl">
        <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4 border border-neutral-200 dark:border-neutral-700">
          <GraduationCap className="h-6 w-6 text-neutral-400" />
        </div>
        <CardTitle className="text-lg font-bold">No courses in progress</CardTitle>
        <CardDescription className="max-w-sm mt-1 text-xs">
          Explore our course library and enroll in a course to start learning.
        </CardDescription>
        <LinkButton href="/courses" className="mt-4 rounded-xl" size="sm">
          Browse Courses
        </LinkButton>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map((item) => (
        <Card
          key={item.courseId}
          className="overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="flex gap-4 p-5">
            <div className="aspect-video w-24 md:w-32 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden shrink-0 relative flex items-center justify-center">
              {item.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.thumbnail}
                  alt={item.courseTitle}
                  className="w-full h-full object-cover"
                />
              ) : (
                <GraduationCap className="h-8 w-8 text-neutral-400" />
              )}
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <h3 className="font-bold text-sm leading-snug truncate hover:text-primary">
                <Link href={`/courses/${item.courseSlug}`}>{item.courseTitle}</Link>
              </h3>
              <p className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">
                Progress: {Math.round(item.progress)}%
              </p>
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          </div>
          <div className="bg-neutral-50/50 dark:bg-neutral-950/20 px-5 py-3 border-t border-neutral-100 dark:border-neutral-800/50 flex justify-end">
            <LinkButton
              href={item.resumeUrl}
              size="sm"
              className="rounded-xl flex items-center gap-1 text-xs"
            >
              Resume Course <ArrowRight className="h-3 w-3" />
            </LinkButton>
          </div>
        </Card>
      ))}
    </div>
  );
}
