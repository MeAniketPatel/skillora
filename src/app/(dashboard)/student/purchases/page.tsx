import { requireAuth } from "@/shared/lib/auth-helpers";
import { getUserPurchases } from "@/features/payments/server";
import { DataTable } from "@/shared/components/shared/data-table";
import { Receipt } from "lucide-react";
import { format } from "date-fns";

export default async function StudentPurchasesPage() {
  const user = await requireAuth();
  const { purchases } = await getUserPurchases(user.id, {});

  const columns = [
    {
      header: "Course",
      cell: (item: any) => <span className="font-medium">{item.enrollment.course.title}</span>,
    },
    {
      header: "Date",
      cell: (item: any) => format(new Date(item.createdAt), "MMM d, yyyy"),
    },
    {
      header: "Amount",
      cell: (item: any) => (
        <span className="font-semibold">
          {item.currency === "USD" ? "$" : ""}
          {item.amount.toFixed(2)}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (item: any) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          item.status === "COMPLETED" ? "bg-green-100 text-green-800" :
          item.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
          "bg-red-100 text-red-800"
        }`}>
          {item.status}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Purchase History</h1>
        <p className="text-muted-foreground">View your course payments and receipts.</p>
      </div>
      <DataTable 
        data={purchases} 
        columns={columns} 
        emptyIcon={Receipt}
        emptyTitle="No purchases"
        emptyDescription="You haven't made any purchases yet."
      />
    </div>
  );
}
