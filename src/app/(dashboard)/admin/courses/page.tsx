import { PageHeader } from "@/shared/components/shared/page-header";
import { getCoursesForAdmin } from "@/data/course.data";
import { CourseModeration } from "@/components/admin/course-moderation";
import { Pagination } from "@/shared/components/shared/pagination";

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
  const { page: pageParam, status, search } = await searchParams;
  const page = parseInt(pageParam || "1", 10);
  const limit = 10;

  // Moderation tab: defaults to UNDER_REVIEW
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
