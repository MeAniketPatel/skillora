"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAdmin } from "@/shared/lib/auth-helpers";
import { categoryCreateSchema, categoryUpdateSchema } from "@/validations/admin.schema";
import { createCategory as createCategoryData, updateCategory as updateCategoryData, deleteCategory as deleteCategoryData } from "@/features/categories/server";
export async function createCategory(values: any) {
  return actionHandler(async () => {
    await requireAdmin();
    const validated = categoryCreateSchema.parse(values);
    
    const cat = await createCategoryData(validated);
    revalidatePath(`/admin/categories`);
    return cat;
  });
}

export async function updateCategory(id: string, values: any) {
  return actionHandler(async () => {
    await requireAdmin();
    const validated = categoryUpdateSchema.parse(values);
    
    const cat = await updateCategoryData(id, validated);
    revalidatePath(`/admin/categories`);
    return cat;
  });
}

export async function deleteCategory(id: string) {
  return actionHandler(async () => {
    await requireAdmin();
    await deleteCategoryData(id);
    revalidatePath(`/admin/categories`);
    return true;
  });
}
