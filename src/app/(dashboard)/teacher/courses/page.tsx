import { requireTeacher } from "@/shared/lib/auth-helpers";
import { getTeacherCourses } from "@/features/courses/server";
import { DataTable } from "@/shared/components/shared/data-table";
import { BookOpen, Plus } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/shared/components/ui/button";

export default async function TeacherCoursesPage() {
  const user = await requireTeacher();
  const { courses } = await getTeacherCourses(user.id, {});

  const columns = [
    {
      header: "Course",
      cell: (item: any) => (
        <div className="flex items-center gap-4">
          {item.thumbnail ? (
            <img src={item.thumbnail} alt={item.title} className="w-16 h-12 object-cover rounded" />
          ) : (
            <div className="w-16 h-12 bg-muted rounded flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <span className="font-medium">{item.title}</span>
        </div>
      ),
    },
    {
      header: "Price",
      cell: (item: any) => (
        <span>{item.price === 0 || item.price === null ? "Free" : `$${item.price.toFixed(2)}`}</span>
      ),
    },
    {
      header: "Status",
      cell: (item: any) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          item.status === "PUBLISHED" ? "bg-green-100 text-green-800" :
          item.status === "DRAFT" ? "bg-yellow-100 text-yellow-800" :
          "bg-gray-100 text-gray-800"
        }`}>
          {item.status}
        </span>
      ),
    },
    {
      header: "Students",
      cell: (item: any) => <span>{item._count.enrollments}</span>,
    },
    {
      header: "Actions",
      cell: (item: any) => (
        <Link href={`/teacher/courses/${item.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
          Manage
        </Link>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Courses</h1>
          <p className="text-muted-foreground">Manage your existing courses or create a new one.</p>
        </div>
        <Link href="/teacher/courses/new" className={buttonVariants()}>
          <Plus className="h-4 w-4 mr-2" />
          New Course
        </Link>
      </div>
      <DataTable 
        data={courses} 
        columns={columns} 
        emptyIcon={BookOpen}
        emptyTitle="No courses found"
        emptyDescription="You haven't created any courses yet."
      />
    </div>
  );
}
