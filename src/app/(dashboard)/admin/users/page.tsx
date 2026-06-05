import { requireAdmin } from "@/shared/lib/auth-helpers";
import { getAllUsers } from "@/features/auth/server";
import { DataTable } from "@/shared/components/shared/data-table";
import { Users } from "lucide-react";
import { format } from "date-fns";
import { updateUserRole, banUser, unbanUser } from "@/features/admin/actions/admin.actions";
import { ActionButton } from "@/shared/components/shared/action-button";
import { Button } from "@/shared/components/ui/button";
import { ImpersonateButton } from "@/features/admin";


export default async function AdminUsersPage() {
  await requireAdmin();
  const { users } = await getAllUsers({});

  const columns = [
    {
      header: "User",
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          {item.image ? (
            <img src={item.image} className="w-8 h-8 rounded-full" alt={item.name} />
          ) : (
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              {item.name?.charAt(0) || "U"}
            </div>
          )}
          <div>
            <div className="font-medium">{item.name}</div>
            <div className="text-xs text-muted-foreground">{item.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      cell: (item: any) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          item.role === "ADMIN" ? "bg-purple-100 text-purple-800" :
          item.role === "TEACHER" ? "bg-blue-100 text-blue-800" :
          "bg-gray-100 text-gray-800"
        }`}>
          {item.role}
        </span>
      ),
    },
    {
      header: "Joined",
      cell: (item: any) => format(new Date(item.createdAt), "MMM d, yyyy"),
    },
    {
      header: "Status",
      cell: (item: any) => (
        item.isBanned ? (
          <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">Banned</span>
        ) : (
          <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">Active</span>
        )
      ),
    },
    {
      header: "Actions",
      cell: (item: any) => (
        <div className="flex gap-2">
          <ImpersonateButton userId={item.id} />
          <form action={async () => {
            "use server";
            await updateUserRole({ userId: item.id, role: item.role === "TEACHER" ? "STUDENT" : "TEACHER" });
          }}>
            <Button type="submit" variant="outline" size="sm">
              {item.role === "ADMIN" ? "Remove Admin" : "Make Admin"}
            </Button>
          </form>
          <form action={async () => {
            "use server";
            if (item.isBanned) await unbanUser(item.id);
            else await banUser(item.id, "Admin action");
          }}>
            <Button type="submit" variant={item.isBanned ? "outline" : "destructive"} size="sm">
              {item.isBanned ? "Unban" : "Ban"}
            </Button>
          </form>
        </div>
      ),
    },

  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users Management</h1>
          <p className="text-muted-foreground">Manage user roles, ban users, and view platform members.</p>
        </div>
      </div>
      <DataTable 
        data={users} 
        columns={columns} 
        emptyIcon={Users}
        emptyTitle="No users found"
        emptyDescription="There are no users registered on the platform."
      />
    </div>
  );
}
