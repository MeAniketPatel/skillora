"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/shared/components/shared/data-table";
import { Tags, Plus, AlertCircle } from "lucide-react";
import { createCategory, deleteCategory } from "@/features/categories";
import { Button } from "@/shared/components/ui/button";
import { slugify } from "@/shared/lib/utils";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: { courses: number };
}

interface AdminCategoriesClientProps {
  initialCategories: Category[];
}

export function AdminCategoriesClient({ initialCategories }: AdminCategoriesClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const handleDelete = (id: string) => {
    setError(null);
    startTransition(async () => {
      try {
        await deleteCategory(id);
        toast.success("Category deleted.");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete category.");
      }
    });
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    setError(null);
    startTransition(async () => {
      const result = await createCategory({
        name: name.trim(),
        slug: slug.trim() || slugify(name.trim()),
      });
      if (result && !result.success) {
        setError(result.error ?? "Failed to create category.");
      } else {
        toast.success("Category created.");
        setName("");
        setSlug("");
        router.refresh();
      }
    });
  };

  const columns = [
    {
      header: "Name",
      cell: (item: Category) => <span className="font-medium">{item.name}</span>,
    },
    {
      header: "Slug",
      cell: (item: Category) => (
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{item.slug}</code>
      ),
    },
    {
      header: "Courses",
      cell: (item: Category) => <span>{item._count?.courses || 0}</span>,
    },
    {
      header: "Actions",
      cell: (item: Category) => (
        <Button
          variant="destructive"
          size="sm"
          disabled={isPending}
          onClick={() => handleDelete(item.id)}
        >
          Delete
        </Button>
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
        <div className="flex items-center gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            className="flex h-9 w-40 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          />
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Slug (auto)"
            className="flex h-9 w-40 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          />
          <Button size="sm" disabled={isPending || !name.trim()} onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" /> Add
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800/40 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <DataTable
        data={initialCategories}
        columns={columns}
        emptyIcon={Tags}
        emptyTitle="No categories found"
        emptyDescription="Create a category to get started."
      />
    </div>
  );
}
