import { requireAuth } from "@/shared/lib/auth-helpers";
import { getUserEnrollments, getResumeLessonId } from "@/features/enrollment/server";
import { DataTable } from "@/shared/components/shared/data-table";
import Link from "next/link";
import { GraduationCap, Play, Award } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export default async function StudentCoursesPage() {
  const user = await requireAuth();
  const enrollments = await getUserEnrollments(user.id, {});

  const enrollmentsWithResume = await Promise.all(
    enrollments.map(async (e) => ({
      ...e,
      resumeLessonId: await getResumeLessonId(user.id, e.courseId),
    })),
  );

  const columns = [
    {
      header: "Course",
      cell: (item: any) => (
        <div className="flex items-center gap-4">
          {item.course.thumbnail && (
            <img src={item.course.thumbnail} alt={item.course.title} className="w-16 h-12 object-cover rounded" />
          )}
          <div>
            <div className="font-medium">{item.course.title}</div>
            <div className="text-sm text-muted-foreground">{item.course.teacher.name}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Progress",
      cell: (item: any) => (
        <div className="w-[150px]">
          <div className="flex justify-between mb-1 text-sm">
            <span>{Math.round(item.progress)}%</span>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${item.progress}%` }} />
          </div>
        </div>
      ),
    },
    {
      header: "Actions",
      cell: (item: any) => {
        const href = item.resumeLessonId
          ? `/learn/${item.course.id}/${item.resumeLessonId}`
          : `/courses/${item.course.slug}`;
        return (
          <Link href={href}>
            <Button>
              <Play className="h-4 w-4 mr-1" />
              {item.progress === 0 ? "Start Course" : "Continue Learning"}
            </Button>
          </Link>
        );
      },
    },
    {
      header: "Certificate",
      cell: (item: any) => {
        if (item.progress === 100) {
          const certId = item.certificate?.certificateId;
          if (certId) {
            return (
              <Link href={`/certificates/${certId}`}>
                <Button variant="default">
                  <Award className="h-4 w-4 mr-1" />
                  View Certificate
                </Button>
              </Link>
            );
          }
          return (
            <Button variant="outline" disabled className="text-xs">
              <Award className="h-4 w-4 mr-1" />
              Certificate Pending
            </Button>
          );
        }
        return (
          <Button variant="outline" disabled className="text-xs opacity-50">
            <Award className="h-4 w-4 mr-1" />
            Complete Course
          </Button>
        );
      },
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Courses</h1>
          <p className="text-muted-foreground">Continue learning your enrolled courses.</p>
        </div>
        <Link href="/courses">
          <Button variant="outline">Browse Courses</Button>
        </Link>
      </div>
      <DataTable 
        data={enrollmentsWithResume} 
        columns={columns} 
        emptyIcon={GraduationCap}
        emptyTitle="No courses yet"
        emptyDescription="You haven't enrolled in any courses yet. Browse our catalog to start learning."
        emptyAction={
          <Link href="/courses">
            <Button>Browse Courses</Button>
          </Link>
        }
      />
    </div>
  );
}

