import { requireTeacher } from "@/lib/auth-helpers";
import { getTeacherReviews } from "@/data";
import { DataTable } from "@/components/shared/data-table";
import { MessageSquareQuote, Star } from "lucide-react";
import { format } from "date-fns";

export default async function TeacherReviewsPage() {
  const user = await requireTeacher();
  const { reviews } = await getTeacherReviews(user.id, {});

  const columns = [
    {
      header: "Course",
      cell: (item: any) => <span className="font-medium">{item.course.title}</span>,
    },
    {
      header: "Student",
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          {item.user.image ? (
            <img src={item.user.image} className="w-8 h-8 rounded-full" alt={item.user.name} />
          ) : (
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              {item.user.name?.charAt(0) || "U"}
            </div>
          )}
          <span>{item.user.name}</span>
        </div>
      ),
    },
    {
      header: "Rating",
      cell: (item: any) => (
        <div className="flex items-center">
          {item.rating} <Star className="h-4 w-4 ml-1 text-yellow-500 fill-yellow-500" />
        </div>
      ),
    },
    {
      header: "Review",
      cell: (item: any) => <span className="text-sm text-muted-foreground line-clamp-2">{item.comment || "No comment provided."}</span>,
    },
    {
      header: "Date",
      cell: (item: any) => format(new Date(item.createdAt), "MMM d, yyyy"),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Student Reviews</h1>
        <p className="text-muted-foreground">Manage and monitor what students are saying about your courses.</p>
      </div>
      <DataTable 
        data={reviews} 
        columns={columns} 
        emptyIcon={MessageSquareQuote}
        emptyTitle="No reviews yet"
        emptyDescription="Your students haven't left any reviews."
      />
    </div>
  );
}
