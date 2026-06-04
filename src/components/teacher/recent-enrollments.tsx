import { User, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface RecentEnrollmentItem {
  id: string;
  studentName: string | null;
  studentEmail: string;
  studentImage: string | null;
  courseTitle: string;
  createdAt: Date;
}

interface RecentEnrollmentsProps {
  enrollments: RecentEnrollmentItem[];
}

export function RecentEnrollments({ enrollments }: RecentEnrollmentsProps) {
  return (
    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Recent Enrollments</CardTitle>
        <CardDescription className="text-xs">Your latest students across all courses.</CardDescription>
      </CardHeader>
      <CardContent>
        {enrollments.length === 0 ? (
          <p className="text-xs text-neutral-500 italic text-center py-6">No recent enrollments.</p>
        ) : (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60 space-y-3.5">
            {enrollments.map((e) => (
              <div key={e.id} className="pt-3.5 first:pt-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={e.studentImage || ""} />
                    <AvatarFallback className="bg-neutral-100 dark:bg-neutral-800 text-[10px]">
                      <User className="h-3.5 w-3.5 text-neutral-400" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0 text-xs">
                    <span className="font-bold truncate text-neutral-800 dark:text-neutral-200">
                      {e.studentName || e.studentEmail}
                    </span>
                    <span className="text-[10px] text-neutral-500 truncate">
                      Enrolled in <span className="font-medium text-foreground">{e.courseTitle}</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0 text-[10px] text-neutral-400 bg-neutral-50 dark:bg-neutral-950/20 border border-neutral-200/40 dark:border-neutral-800/50 px-2 py-0.5 rounded-md">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(e.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
