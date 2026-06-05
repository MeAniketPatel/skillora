// Auto-generated barrel: re-exports all repositories for the categories feature.
export * from "./repositories/category.repository";

// Services
export { categoriesService } from "./services/categories.service";
export type { CategoriesService } from "./services/categories.service";

// Permissions
export { canCategories as canCategories, assertCategoriesAccess } from "./permissions/categories.permissions";
