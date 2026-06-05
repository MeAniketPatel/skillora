import { requireTeacher } from "@/shared/lib/auth-helpers";
import { getQuestionsForTeacher } from "@/features/discussions";
import { DataTable } from "@/shared/components/shared/data-table";
import { HelpCircle } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Button, buttonVariants } from "@/shared/components/ui/button";

export default async function TeacherQAPage() {
  const user = await requireTeacher();
  const { questions } = await getQuestionsForTeacher(user.id, {});

  const columns = [
    {
      header: "Student",
      cell: (item: any) => <span className="font-medium">{item.user.name}</span>,
    },
    {
      header: "Course / Lesson",
      cell: (item: any) => (
        <div>
          <div className="font-medium truncate max-w-[200px]">{item.lesson.section.course.title}</div>
          <div className="text-xs text-muted-foreground truncate max-w-[200px]">{item.lesson.title}</div>
        </div>
      ),
    },
    {
      header: "Question",
      cell: (item: any) => (
        <div>
          <div className="font-medium">{item.title}</div>
          <div className="text-sm text-muted-foreground line-clamp-1">{item.body}</div>
        </div>
      ),
    },
    {
      header: "Asked On",
      cell: (item: any) => format(new Date(item.createdAt), "MMM d, yyyy"),
    },
    {
      header: "Action",
      cell: (item: any) => (
        <Link href={`/learn/${item.courseId}/lesson/${item.lessonId}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
          View Lesson
        </Link>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Q&A Management</h1>
        <p className="text-muted-foreground">Answer unresolved questions from your students.</p>
      </div>
      <DataTable 
        data={questions} 
        columns={columns} 
        emptyIcon={HelpCircle}
        emptyTitle="No unresolved questions"
        emptyDescription="You're all caught up! There are no pending questions."
      />
    </div>
  );
}
