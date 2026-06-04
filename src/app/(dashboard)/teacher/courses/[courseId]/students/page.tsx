import { requireTeacher } from "@/lib/auth-helpers";
import { getCourseByIdForOwner } from "@/data/course.data";
import { getCourseEnrollments } from "@/data/enrollment.data";
import { PageHeader } from "@/components/shared/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, CheckCircle, Clock } from "lucide-react";
import { Pagination } from "@/components/shared/pagination";
import { Card, CardContent } from "@/components/ui/card";
import LinkButton from "@/components/ui/link-button";

interface StudentManagementPageProps {
  params: Promise<{
    courseId: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function StudentManagementPage({
  params,
  searchParams,
}: StudentManagementPageProps) {
  const user = await requireTeacher();
  const { courseId } = await params;
  const { page: pageParam } = await searchParams;

  const page = parseInt(pageParam || "1", 10);
  const limit = 10;

  // Validate ownership
  const course = await getCourseByIdForOwner(courseId, user.id);

  // Fetch enrollments
  const { enrollments, pages } = await getCourseEnrollments(courseId, {
    page,
    limit,
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader
          title="Student Roster"
          description={`View progress logs and enrollment details for course: ${course.title}`}
        />
        <LinkButton
          href={`/teacher/courses/${courseId}`}
          variant="outline"
          size="sm"
          className="rounded-xl shrink-0 h-9"
        >
          Back to Course
        </LinkButton>
      </div>

      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl overflow-hidden shadow-sm">
        <CardContent className="p-0">
          {enrollments.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 italic text-sm">
              No students are currently enrolled in this course.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/20">
                    <TableHead className="py-3.5 pl-6">Student</TableHead>
                    <TableHead className="py-3.5">Enrolled Date</TableHead>
                    <TableHead className="py-3.5">Course Progress</TableHead>
                    <TableHead className="py-3.5 pr-6">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrollments.map((e) => {
                    const isCompleted = e.progress >= 100;
                    return (
                      <TableRow
                        key={e.id}
                        className="border-b border-neutral-100 dark:border-neutral-800/80 hover:bg-neutral-50/20 dark:hover:bg-neutral-950/10"
                      >
                        <TableCell className="py-4 pl-6 flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={e.user.image || ""} />
                            <AvatarFallback className="bg-neutral-100 dark:bg-neutral-850">
                              <User className="h-3.5 w-3.5 text-neutral-400" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0 text-xs">
                            <span className="font-bold truncate text-neutral-850 dark:text-neutral-50">
                              {e.user.name || "Student"}
                            </span>
                            <span className="text-[10px] text-neutral-400 truncate">
                              {e.user.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-xs text-neutral-500">
                          {new Date(e.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2 max-w-[200px]">
                            <div className="flex-1 bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-primary h-full rounded-full transition-all duration-300"
                                style={{ width: `${e.progress}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-bold text-neutral-500 shrink-0">
                              {Math.round(e.progress)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 pr-6">
                          {isCompleted ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400">
                              <CheckCircle className="h-3 w-3" />
                              Completed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-755 dark:bg-yellow-950/20 dark:text-yellow-400">
                              <Clock className="h-3 w-3" />
                              Learning
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Pagination totalPages={pages} currentPage={page} />
    </div>
  );
}
