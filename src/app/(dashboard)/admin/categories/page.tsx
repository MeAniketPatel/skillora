import { requireAdmin } from "@/shared/lib/auth-helpers";
import { getAllCategories } from "@/features/categories/server";
import { AdminCategoriesClient } from "./client";

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await getAllCategories();

  return <AdminCategoriesClient initialCategories={categories} />;
}
