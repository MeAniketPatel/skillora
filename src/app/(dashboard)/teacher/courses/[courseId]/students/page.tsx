import React from "react";
import { redirect } from "next/navigation";
import { requireTeacher } from "@/shared/lib/auth-helpers";
import { getCourseByIdForOwner, getCourseEnrollments } from "@/data";
import { PageHeader } from "@/shared/components/shared/page-header";
import { DataTable } from "@/shared/components/shared/data-table";
import { Pagination } from "@/shared/components/shared/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import { User, Calendar, GraduationCap, CheckCircle } from "lucide-react";

interface PageProps {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function CourseStudentsPage({ params, searchParams }: PageProps) {
  const user = await requireTeacher();
  const { courseId } = await params;
  const resolvedSearchParams = await searchParams;

  let course;
  try {
    course = await getCourseByIdForOwner(courseId, user.id);
  } catch {
    redirect("/teacher/courses");
  }

  const page = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page, 10) : 1;
  const limit = 10;
  const { enrollments, total, pages } = await getCourseEnrollments(courseId, { page, limit });

  const columns = [
    {
      header: "Student",
      cell: (item: any) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={item.user.image || ""} />
            <AvatarFallback className="bg-neutral-100 dark:bg-neutral-800">
              <User className="h-4 w-4 text-neutral-400" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm text-neutral-850 dark:text-neutral-50 truncate">
              {item.user.name || "Student"}
            </span>
            <span className="text-xs text-neutral-400 truncate">
              {item.user.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Enrolled Date",
      cell: (item: any) => (
        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
          <Calendar className="h-3.5 w-3.5" />
          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
        </div>
      ),
    },
    {
      header: "Progress",
      cell: (item: any) => (
        <div className="flex flex-col gap-1.5 w-full max-w-[200px]">
          <div className="flex justify-between text-[10px] font-bold text-neutral-500">
            <span>{Math.round(item.progress)}%</span>
          </div>
          <Progress value={item.progress} className="h-1.5" />
        </div>
      ),
    },
    {
      header: "Status",
      cell: (item: any) => {
        const isCompleted = item.progress >= 100;
        return isCompleted ? (
          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 border-none font-bold rounded-xl gap-1">
            <CheckCircle className="h-3 w-3" />
            Completed
          </Badge>
        ) : (
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border-none font-bold rounded-xl">
            In Progress
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <PageHeader
        title={`Students — ${course.title}`}
        description={`Manage and track progress of students enrolled in this course. Total enrolled: ${total}`}
      />

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl overflow-hidden shadow-sm p-4">
        <DataTable
          data={enrollments}
          columns={columns}
          emptyTitle="No students enrolled yet"
          emptyDescription="Once students purchase or enroll in your course, they will appear here with their progress."
          emptyIcon={GraduationCap}
        />
        {pages > 1 && (
          <div className="mt-4">
            <Pagination totalPages={pages} currentPage={page} />
          </div>
        )}
      </div>
    </div>
  );
}
