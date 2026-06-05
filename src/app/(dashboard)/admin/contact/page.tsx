import { requireAdmin } from "@/shared/lib/auth-helpers";
import { getContactMessages } from "@/features/contact";
import { DataTable } from "@/shared/components/shared/data-table";
import { MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { markContactReplied } from "@/features/contact";
import { ActionButton } from "@/shared/components/shared/action-button";
import { Button } from "@/shared/components/ui/button";

export default async function AdminContactPage() {
  await requireAdmin();
  const { messages } = await getContactMessages({});

  const columns = [
    {
      header: "From",
      cell: (item: any) => (
        <div>
          <div className="font-medium">{item.name}</div>
          <div className="text-xs text-muted-foreground">{item.email}</div>
        </div>
      ),
    },
    {
      header: "Message",
      cell: (item: any) => (
        <div>
          <div className="font-medium truncate max-w-[200px]">{item.subject}</div>
          <div className="text-xs text-muted-foreground line-clamp-2 max-w-[300px]">{item.message}</div>
        </div>
      ),
    },
    {
      header: "Date",
      cell: (item: any) => format(new Date(item.createdAt), "MMM d, yyyy"),
    },
    {
      header: "Status",
      cell: (item: any) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          item.isReplied ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
        }`}>
          {item.isReplied ? "Replied" : "Pending"}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (item: any) => (
        <div className="flex gap-2">
          {!item.isReplied && (
            <form action={async () => {
              "use server";
              await markContactReplied(item.id);
            }}>
              <Button type="submit" variant="outline" size="sm">
                Mark Replied
              </Button>
            </form>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Contact Messages</h1>
        <p className="text-muted-foreground">View and manage messages from the contact form.</p>
      </div>
      <DataTable 
        data={messages} 
        columns={columns} 
        emptyIcon={MessageSquare}
        emptyTitle="No messages"
        emptyDescription="You have no contact form submissions."
      />
    </div>
  );
}
