import { requireTeacher } from "@/shared/lib/auth-helpers";
import { getTeacherCoupons } from "@/features/admin";
import { DataTable } from "@/shared/components/shared/data-table";
import { Ticket } from "lucide-react";
import { format } from "date-fns";

export default async function TeacherCouponsPage() {
  const user = await requireTeacher();
  const coupons = await getTeacherCoupons(user.id);

  const columns = [
    {
      header: "Code",
      cell: (item: any) => <span className="font-mono font-bold text-lg">{item.code}</span>,
    },
    {
      header: "Discount",
      cell: (item: any) => (
        <span>{item.type === "PERCENTAGE" ? `${item.discount}%` : `$${item.discount.toFixed(2)}`}</span>
      ),
    },
    {
      header: "Course Limit",
      cell: (item: any) => <span>{item.course ? item.course.title : "All Courses"}</span>,
    },
    {
      header: "Uses",
      cell: (item: any) => (
        <span>{item.usedCount} {item.maxUses ? `/ ${item.maxUses}` : "(Unlimited)"}</span>
      ),
    },
    {
      header: "Expires",
      cell: (item: any) => <span>{item.expiresAt ? format(new Date(item.expiresAt), "MMM d, yyyy") : "Never"}</span>,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Promotions & Coupons</h1>
          <p className="text-muted-foreground">Manage discount codes for your courses.</p>
        </div>
      </div>
      <DataTable 
        data={coupons} 
        columns={columns} 
        emptyIcon={Ticket}
        emptyTitle="No coupons found"
        emptyDescription="Create coupons to run promotions for your courses."
      />
    </div>
  );
}
