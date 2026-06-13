export { getAllCategories, getCategoriesWithCounts, getCategoryBySlug, createCategory, updateCategory, deleteCategory } from "./repositories/category.repository";

import { categoriesService as service } from "./services/categories.service";
export { service };

