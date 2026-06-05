import { requireAuth } from "@/shared/lib/auth-helpers";
import { PageHeader } from "@/shared/components/shared/page-header";
import { DashboardStats } from "@/features/students";
import { ContinueLearning } from "@/features/students";
import { getUserEnrollmentCount, getUserEnrollments, getResumeLessonId } from "@/features/enrollment/server";
import { getUserCompletedLessonsCount } from "@/features/students/server";
import { getUserCertificatesCount } from "@/features/certificates/server";
import { getUserNotifications } from "@/features/notifications/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import LinkButton from "@/shared/components/ui/link-button";

export default async function StudentDashboardPage() {
  const user = await requireAuth();

  // Fetch stats counts
  const enrolledCount = await getUserEnrollmentCount(user.id);
  const completedCount = await getUserCompletedLessonsCount(user.id);
  const certificatesCount = await getUserCertificatesCount(user.id);

  // Fetch active enrollments
  const enrollments = await getUserEnrollments(user.id, { status: "active" });

  // Map to continue learning items with next lesson resolver
  const continueItems = await Promise.all(
    enrollments.slice(0, 4).map(async (e) => {
      const resumeLessonId = await getResumeLessonId(user.id, e.courseId);
      return {
        courseId: e.courseId,
        courseTitle: e.course.title,
        courseSlug: e.course.slug,
        thumbnail: e.course.thumbnail,
        progress: e.progress,
        resumeUrl: resumeLessonId
          ? `/learn/${e.courseId}/${resumeLessonId}`
          : `/courses/${e.course.slug}`,
      };
    })
  );

  // Fetch recent notifications
  const notifications = await getUserNotifications(user.id, { limit: 5 });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Student Dashboard"
        description={`Welcome back, ${user.name || "Student"}! Track your course progress, resume lectures, and view notifications.`}
      />

      <DashboardStats
        enrolledCount={enrolledCount}
        completedCount={completedCount}
        certificatesCount={certificatesCount}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Continue Learning Section */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Continue Learning</h2>
          <ContinueLearning items={continueItems} />
        </div>

        {/* Notifications Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Recent Notifications</h2>
          <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-sm font-bold">Latest Alerts</CardTitle>
                <CardDescription className="text-[10px] text-neutral-400">
                  Your recent activity notifications
                </CardDescription>
              </div>
              <LinkButton
                href="/notifications"
                variant="ghost"
                size="sm"
                className="text-[10px] rounded-xl h-8 px-3"
              >
                View All
              </LinkButton>
            </CardHeader>
            <CardContent className="space-y-4">
              {notifications.length === 0 ? (
                <p className="text-xs text-neutral-500 italic text-center py-6">
                  No new notifications.
                </p>
              ) : (
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800 space-y-3">
                  {notifications.map((n) => (
                    <div key={n.id} className="pt-3 first:pt-0 flex flex-col gap-1">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-xs leading-none">
                          {n.title}
                        </h4>
                        <span className="text-[9px] text-neutral-400">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500">{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
