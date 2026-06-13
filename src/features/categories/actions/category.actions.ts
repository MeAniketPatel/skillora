"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAdmin } from "@/shared/lib/auth-helpers";
import { categoryCreateSchema, categoryUpdateSchema } from "@/features/admin";
import { service as categoriesService } from "@/features/categories/server";
export async function createCategory(values: any) {
  return actionHandler(async () => {
    await requireAdmin();
    const validated = categoryCreateSchema.parse(values);
    
    const cat = await categoriesService.createCategory(validated);
    revalidatePath(`/admin/categories`);
    return cat;
  });
}

export async function updateCategory(id: string, values: any) {
  return actionHandler(async () => {
    await requireAdmin();
    const validated = categoryUpdateSchema.parse(values);
    
    const cat = await categoriesService.updateCategory(id, validated);
    revalidatePath(`/admin/categories`);
    return cat;
  });
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  await categoriesService.deleteCategory(id);
  revalidatePath(`/admin/categories`);
}
