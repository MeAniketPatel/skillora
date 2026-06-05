// Auto-generated barrel: re-exports all repositories for the feature-flags feature.
export * from "./repositories/feature-flag.repository";

// Services
export { featureFlagsService } from "./services/feature-flags.service";
export type { FeatureFlagsService } from "./services/feature-flags.service";

// Permissions
export { canFeatureFlags as canFeatureFlags, assertFeatureFlagsAccess } from "./permissions/feature-flags.permissions";

// Contracts
export { createFeatureFlagsSchema, updateFeatureFlagsSchema, listFeatureFlagsQuerySchema } from "./contracts/feature-flags.contract";
export type { CreateFeatureFlagsInput, UpdateFeatureFlagsInput, ListFeatureFlagsQuery } from "./contracts/feature-flags.contract";

// Hooks
export {  useFeatureFlagsList, useFeatureFlagsDetail, useFeatureFlagsCreate, useFeatureFlagsUpdate, useFeatureFlagsDelete } from "./hooks/use-feature-flags";

