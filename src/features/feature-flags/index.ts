// Auto-generated barrel: re-exports all repositories for the feature-flags feature.

// Permissions
export { canFeatureFlags as canFeatureFlags, assertFeatureFlagsAccess } from "./permissions/feature-flags.permissions";

// Contracts
export { createFeatureFlagsSchema, updateFeatureFlagsSchema, listFeatureFlagsQuerySchema } from "./contracts/feature-flags.contract";
export type { CreateFeatureFlagsInput, UpdateFeatureFlagsInput, ListFeatureFlagsQuery } from "./contracts/feature-flags.contract";

// Hooks
export {  useFeatureFlagsList, useFeatureFlagsDetail, useFeatureFlagsCreate, useFeatureFlagsUpdate, useFeatureFlagsDelete } from "./hooks/use-feature-flags";

