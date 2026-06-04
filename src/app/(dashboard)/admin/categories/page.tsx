import { requireAdmin } from "@/lib/auth-helpers";
import { getAllCategories } from "@/data";
import { DataTable } from "@/components/shared/data-table";
import { Tags, Plus } from "lucide-react";
import { createCategory, deleteCategory } from "@/actions";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/shared/action-button";

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await getAllCategories();

  const columns = [
    {
      header: "Name",
      cell: (item: any) => <span className="font-medium">{item.name}</span>,
    },
    {
      header: "Description",
      cell: (item: any) => <span className="text-muted-foreground">{item.description || "-"}</span>,
    },
    {
      header: "Courses",
      cell: (item: any) => <span>{item._count?.courses || 0}</span>,
    },
    {
      header: "Actions",
      cell: (item: any) => (
        <div className="flex gap-2">
          <form action={async () => {
            "use server";
            await deleteCategory(item.id);
          }}>
            <Button type="submit" variant="destructive" size="sm">
              Delete
            </Button>
          </form>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Manage course categories for the platform.</p>
        </div>
        <form action={async (formData) => {
          "use server";
          await createCategory({
            name: formData.get("name"),
            description: formData.get("description"),
          });
        }} className="flex items-center gap-2">
          <input 
            name="name" 
            placeholder="Category name" 
            className="flex h-9 w-40 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            required
          />
          <input 
            name="description" 
            placeholder="Description (opt)" 
            className="flex h-9 w-40 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          />
          <Button type="submit" size="sm">
            <Plus className="h-4 w-4 mr-2" /> Add
          </Button>
        </form>
      </div>
      <DataTable 
        data={categories} 
        columns={columns} 
        emptyIcon={Tags}
        emptyTitle="No categories found"
        emptyDescription="Create a category to get started."
      />
    </div>
  );
}
