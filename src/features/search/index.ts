// Auto-generated barrel: re-exports all repositories for the search feature.
export * from "./repositories/search.repository";

// Services
export { searchService } from "./services/search.service";
export type { SearchService } from "./services/search.service";

// Permissions
export { canSearch as canSearch, assertSearchAccess } from "./permissions/search.permissions";

// Contracts
export { createSearchSchema, updateSearchSchema, listSearchQuerySchema } from "./contracts/search.contract";
export type { CreateSearchInput, UpdateSearchInput, ListSearchQuery } from "./contracts/search.contract";

// Hooks
export {  useSearchList, useSearchDetail, useSearchCreate, useSearchUpdate, useSearchDelete } from "./hooks/use-search";

