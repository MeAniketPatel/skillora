import { requireTeacher } from "@/shared/lib/auth-helpers";
import { PageHeader } from "@/shared/components/shared/page-header";
import { TeacherStats } from "@/features/teachers/server";
import { RecentEnrollments } from "@/features/teachers/server";
import { getTeacherCourses } from "@/features/courses/server";
import { getTeacherStudentCount, getTeacherRecentEnrollments } from "@/features/enrollment/server";
import { getTeacherEarnings } from "@/features/payments/server";
import { getTeacherAverageRating, getTeacherReviews } from "@/features/reviews/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import LinkButton from "@/shared/components/ui/link-button";

export default async function TeacherDashboardPage() {
  const user = await requireTeacher();

  // Fetch teacher statistics
  const { total: coursesCount } = await getTeacherCourses(user.id, {});
  const studentsCount = await getTeacherStudentCount(user.id);
  const { totalEarnings } = await getTeacherEarnings(user.id);
  const averageRating = await getTeacherAverageRating(user.id);

  // Fetch lists for feed
  const rawRecentEnrollments = await getTeacherRecentEnrollments(user.id, 5);
  const { reviews } = await getTeacherReviews(user.id, { limit: 5 });

  // Map enrollments to recent enrollment item props
  const recentEnrollments = rawRecentEnrollments.map((e) => ({
    id: e.id,
    studentName: e.user.name,
    studentEmail: e.user.email,
    studentImage: e.user.image,
    courseTitle: e.course.title,
    createdAt: e.createdAt,
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Teacher Dashboard"
        description="Monitor student enrollments, course feedback, overall rating, and platform earnings."
      />

      <TeacherStats
        coursesCount={coursesCount}
        studentsCount={studentsCount}
        earnings={totalEarnings}
        averageRating={averageRating}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Enrollments */}
        <RecentEnrollments enrollments={recentEnrollments} />

        {/* Recent Reviews */}
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-lg">Recent Reviews</CardTitle>
              <CardDescription className="text-xs">
                Feedback and ratings from your students.
              </CardDescription>
            </div>
            <LinkButton
              href="/teacher/reviews"
              variant="ghost"
              size="sm"
              className="text-xs rounded-xl h-8 px-3"
            >
              View All
            </LinkButton>
          </CardHeader>
          <CardContent>
            {reviews.length === 0 ? (
              <p className="text-xs text-neutral-500 italic text-center py-6">
                No reviews received yet.
              </p>
            ) : (
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60 space-y-3.5">
                {reviews.map((r) => (
                  <div key={r.id} className="pt-3.5 first:pt-0 space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-neutral-800 dark:text-neutral-200">
                        {r.user.name || "Student"}
                      </span>
                      <span className="text-[10px] text-yellow-500 font-bold">
                        ★ {r.rating}.0
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-500">
                      Course:{" "}
                      <span className="font-medium text-foreground">
                        {r.course.title}
                      </span>
                    </p>
                    {r.comment && (
                      <p className="text-neutral-600 dark:text-neutral-450 italic mt-1 bg-neutral-50/50 dark:bg-neutral-950/20 p-2.5 rounded-lg border border-neutral-100/50 dark:border-neutral-850/50">
                        "{r.comment}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

