// Auto-generated barrel: re-exports all repositories for the categories feature.

// Permissions
export { canCategories as canCategories, assertCategoriesAccess } from "./permissions/categories.permissions";

// Contracts
export { createCategoriesSchema, updateCategoriesSchema, listCategoriesQuerySchema } from "./contracts/categories.contract";
export type { CreateCategoriesInput, UpdateCategoriesInput, ListCategoriesQuery } from "./contracts/categories.contract";

// Hooks
export {  useCategoriesList, useCategoriesDetail, useCategoriesCreate, useCategoriesUpdate, useCategoriesDelete } from "./hooks/use-categories";

