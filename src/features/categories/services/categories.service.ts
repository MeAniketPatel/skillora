// Auto-generated service wrapper for the categories feature.
// Delegates to the repositories by default (DI via default-param pattern
// per ADR-007). Mutation methods emit domain events on the in-process
// event bus for cross-feature side effects.
import { eventBus } from "@/shared/events";
import * as categoryRepo from "../repositories/category.repository";

export const categoriesService = {
  getAllCategories: categoryRepo.getAllCategories,
  getCategoriesWithCounts: categoryRepo.getCategoriesWithCounts,
  getCategoryBySlug: categoryRepo.getCategoryBySlug,
  async createCategory(...args: Parameters<typeof categoryRepo.createCategory>): Promise<Awaited<ReturnType<typeof categoryRepo.createCategory>>> {
    const result = await categoryRepo.createCategory(...args);
    await eventBus.emit({ name: "categories.createCategory", feature: "categories", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async updateCategory(...args: Parameters<typeof categoryRepo.updateCategory>): Promise<Awaited<ReturnType<typeof categoryRepo.updateCategory>>> {
    const result = await categoryRepo.updateCategory(...args);
    await eventBus.emit({ name: "categories.updateCategory", feature: "categories", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async deleteCategory(...args: Parameters<typeof categoryRepo.deleteCategory>): Promise<Awaited<ReturnType<typeof categoryRepo.deleteCategory>>> {
    const result = await categoryRepo.deleteCategory(...args);
    await eventBus.emit({ name: "categories.deleteCategory", feature: "categories", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
};

export type CategoriesService = typeof categoriesService;
