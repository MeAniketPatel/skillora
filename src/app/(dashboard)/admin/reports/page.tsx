import { PageHeader } from "@/shared/components/shared/page-header";
import { getUserCountByRole, getUserGrowthTimeline } from "@/features/auth/server";
import { getCourseCountByStatus, getCourseCountByCategory } from "@/features/courses/server";
import { getEnrollmentTrends } from "@/features/enrollment/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Users, BookOpen } from "lucide-react";
import { StatsCard } from "@/shared/components/shared/stats-card";
import { ReportsDashboard } from "@/features/admin/server";

export default async function AdminReportsPage() {
  const roleCounts = await getUserCountByRole();
  const statusCounts = await getCourseCountByStatus();
  const categoryCounts = await getCourseCountByCategory();

  const userGrowth = await getUserGrowthTimeline();
  const enrollmentTrends = await getEnrollmentTrends();

  const totalUsers = Object.values(roleCounts).reduce((a, b) => a + b, 0);
  const totalCourses = Object.values(statusCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <PageHeader
        title="System Reports & Analytics"
        description="Audit platform growth, user role distributions, catalog categories, and publishing metrics."
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard
          label="Total Registered Users"
          value={totalUsers.toString()}
          icon={Users}
        />
        <StatsCard
          label="Total Created Courses"
          value={totalCourses.toString()}
          icon={BookOpen}
        />
      </div>

      <ReportsDashboard
        userGrowth={userGrowth}
        enrollmentTrends={enrollmentTrends}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Role Distribution */}
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold">User Roles</CardTitle>
            <CardDescription className="text-[10px]">Distribution of platform members.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {Object.entries(roleCounts).map(([role, count]) => (
              <div key={role} className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-800/60 last:border-0">
                <span className="font-semibold text-neutral-500">{role}</span>
                <span className="font-bold text-neutral-850 dark:text-neutral-50">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Course Status Distribution */}
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Course Statuses</CardTitle>
            <CardDescription className="text-[10px]">Distribution of course lifecycles.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-800/60 last:border-0">
                <span className="font-semibold text-neutral-500">{status.replace("_", " ")}</span>
                <span className="font-bold text-neutral-850 dark:text-neutral-50">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Course Category Distribution */}
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Catalog Categories</CardTitle>
            <CardDescription className="text-[10px]">Courses indexed per category.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {Object.keys(categoryCounts).length === 0 ? (
              <p className="text-xs text-neutral-500 italic text-center py-6">No courses indexed.</p>
            ) : (
              Object.entries(categoryCounts).map(([cat, count]) => (
                <div key={cat} className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-800/60 last:border-0">
                  <span className="font-semibold text-neutral-500">{cat}</span>
                  <span className="font-bold text-neutral-850 dark:text-neutral-50">{count}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

