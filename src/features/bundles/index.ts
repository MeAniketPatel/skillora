// Auto-generated barrel: re-exports all repositories for the bundles feature.
export * from "./repositories/bundle.repository";

// Services
export { bundlesService } from "./services/bundles.service";
export type { BundlesService } from "./services/bundles.service";

// Permissions
export { canBundles as canBundles, assertBundlesAccess } from "./permissions/bundles.permissions";

// Contracts
export { createBundlesSchema, updateBundlesSchema, listBundlesQuerySchema } from "./contracts/bundles.contract";
export type { CreateBundlesInput, UpdateBundlesInput, ListBundlesQuery } from "./contracts/bundles.contract";

// Hooks
export {  useBundlesList, useBundlesDetail, useBundlesCreate, useBundlesUpdate, useBundlesDelete } from "./hooks/use-bundles";

