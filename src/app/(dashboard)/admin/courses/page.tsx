import { PageHeader } from "@/shared/components/shared/page-header";
import { getCoursesForAdmin } from "@/features/courses/server";
import { Pagination } from "@/shared/components/shared/pagination";
import { CourseModeration } from "@/features/admin/components/course-moderation";
import { requireAdmin } from "@/shared/lib/auth-helpers";

interface AdminCoursesPageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
    search?: string;
  }>;
}

export default async function AdminCoursesPage({
  searchParams,
}: AdminCoursesPageProps) {
  await requireAdmin();
  const { page: pageParam, status, search } = await searchParams;
  const page = parseInt(pageParam || "1", 10);
  const limit = 10;

  const activeStatus = status || "UNDER_REVIEW";

  const { courses, pages } = await getCoursesForAdmin({
    page,
    limit,
    status: activeStatus === "ALL" ? undefined : activeStatus,
    search,
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Course Moderation"
        description="Audit courses submitted by teachers requesting review before publishing them live on the platform."
      />

      <CourseModeration initialCourses={courses} />

      <Pagination totalPages={pages} currentPage={page} />
    </div>
  );
}
