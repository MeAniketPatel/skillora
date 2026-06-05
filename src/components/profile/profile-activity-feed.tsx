"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rss, Star, Calendar, Sparkles, BookOpen, Layers } from "lucide-react";

interface Activity {
  id: string;
  type: string;
  metadata: any;
  createdAt: Date;
}

interface ProfileActivityFeedProps {
  activities: Activity[];
}

export function ProfileActivityFeed({ activities }: ProfileActivityFeedProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "PROJECT_PUBLISHED":
        return <Layers className="h-4 w-4 text-indigo-500" />;
      case "COURSE_ENROLLED":
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case "LESSON_COMPLETED":
        return <Star className="h-4 w-4 text-green-500" />;
      case "BADGE_EARNED":
        return <Sparkles className="h-4 w-4 text-amber-500" />;
      default:
        return <Rss className="h-4 w-4 text-neutral-400" />;
    }
  };

  const formatActivityMessage = (type: string, metadata: any) => {
    switch (type) {
      case "PROJECT_PUBLISHED":
        return `Published a new showcase project: "${metadata.projectTitle || "Untitled"}"`;
      case "COURSE_ENROLLED":
        return `Enrolled in course: "${metadata.courseTitle || "New Course"}"`;
      case "LESSON_COMPLETED":
        return `Completed lecture: "${metadata.lessonTitle || "Lecture"}"`;
      case "BADGE_EARNED":
        return `Earned the achievement badge: "${metadata.badgeName || "Achievement"}"`;
      default:
        return "Performed an activity on the platform.";
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold text-neutral-850 dark:text-neutral-50">Recent Activities</h2>

      {activities.length === 0 ? (
        <Card className="border border-dashed border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-10 text-center bg-white dark:bg-neutral-900 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center space-y-3 p-0">
            <div className="h-10 w-10 bg-neutral-50 dark:bg-neutral-800 rounded-full flex items-center justify-center">
              <Rss className="h-5 w-5 text-neutral-400" />
            </div>
            <p className="text-sm font-semibold text-neutral-850 dark:text-neutral-50">No activities logged yet</p>
            <p className="text-xs text-neutral-400">
              Complete courses, earn badges, and post projects to populate your history.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="relative pl-6 border-l border-neutral-100 dark:border-neutral-800 space-y-6">
          {activities.map((act) => (
            <div key={act.id} className="relative">
              {/* Timeline marker */}
              <div className="absolute -left-[35px] top-1 h-6 w-6 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 flex items-center justify-center shadow-sm">
                {getActivityIcon(act.type)}
              </div>

              <div className="space-y-1">
                <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium">
                  {formatActivityMessage(act.type, act.metadata)}
                </p>
                <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(act.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
