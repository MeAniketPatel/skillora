import { requireAuth } from "@/shared/lib/auth-helpers";
import { getUserEnrollments } from "@/features/enrollment";
import { DataTable } from "@/shared/components/shared/data-table";
import { ActionButton } from "@/shared/components/shared/action-button";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export default async function StudentCoursesPage() {
  const user = await requireAuth();
  const enrollments = await getUserEnrollments(user.id, {});

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
      cell: (item: any) => (
        <Link href={`/learn/${item.course.id}`}>
          <Button>
            {item.progress === 0 ? "Start Course" : "Continue"}
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Courses</h1>
        <p className="text-muted-foreground">Continue learning your enrolled courses.</p>
      </div>
      <DataTable 
        data={enrollments} 
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
