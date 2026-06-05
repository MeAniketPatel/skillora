"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { enrollInLearningPathAction } from "@/actions/learning-path.actions";
import { Play, Check, ChevronRight, Lock, BookOpen, Loader2 } from "lucide-react";

interface PathCourse {
  id: string;
  position: number;
  course: {
    id: string;
    title: string;
    shortDescription: string | null;
    thumbnail: string | null;
    slug: string;
    level: string;
  };
}

interface PathTimelineProps {
  pathId: string;
  courses: PathCourse[];
  isEnrolled: boolean;
}

export function PathTimeline({ pathId, courses, isEnrolled }: PathTimelineProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleEnroll = () => {
    startTransition(async () => {
      const res = await enrollInLearningPathAction(pathId);
      if (!res.success) {
        alert(res.error || "Failed to enroll in learning path.");
      } else {
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 p-5 rounded-2xl shadow-sm">
        <div>
          <h3 className="text-xs font-bold text-neutral-850 dark:text-neutral-50">Timeline Track</h3>
          <p className="text-[10px] text-neutral-450 mt-0.5">Complete courses in order to master this path.</p>
        </div>
        {!isEnrolled ? (
          <Button onClick={handleEnroll} disabled={isPending} className="h-10 rounded-xl text-xs gap-1.5 font-bold">
            {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Enroll in Path
          </Button>
        ) : (
          <Badge className="bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400 border-none font-bold text-xs py-1 px-3 gap-1">
            <Check className="h-3.5 w-3.5" /> Enrolled
          </Badge>
        )}
      </div>

      <div className="relative pl-8 border-l-2 border-neutral-100 dark:border-neutral-800 space-y-8">
        {courses.map((pc, idx) => {
          const c = pc.course;
          const step = idx + 1;

          return (
            <div key={pc.id} className="relative">
              {/* Position indicator */}
              <div className="absolute -left-[45px] top-1.5 h-8 w-8 rounded-full bg-white dark:bg-neutral-900 border-2 border-indigo-500 flex items-center justify-center font-extrabold text-xs text-indigo-500 shadow-sm">
                {step}
              </div>

              <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row items-stretch">
                  {c.thumbnail && (
                    <div className="w-full md:w-48 relative h-32 md:h-auto overflow-hidden shrink-0">
                      <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <CardContent className="p-5 flex-1 flex flex-col justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] uppercase font-bold text-neutral-400">Step {step}</span>
                        <Badge variant="outline" className="text-[9px] font-bold">
                          {c.level}
                        </Badge>
                      </div>
                      <h4 className="text-sm font-bold text-neutral-850 dark:text-neutral-50">{c.title}</h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-450 line-clamp-2 leading-relaxed">
                        {c.shortDescription}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-150 dark:border-neutral-800/50">
                      <span className="text-[10px] text-neutral-450 font-semibold flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" /> Course details
                      </span>
                      <Button
                        onClick={() => router.push(`/courses/${c.slug}`)}
                        variant="ghost"
                        size="sm"
                        className="h-8 rounded-xl text-xs gap-1 text-indigo-500 hover:text-indigo-600 font-bold"
                      >
                        Launch
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
