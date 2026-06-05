// Server-only barrel. Import this from server actions, route handlers,
// server components, and middleware. NEVER import from "use client" files.

// Repository functions
export { getFeatureFlags, getFeatureFlagByKey, createFeatureFlag, toggleFeatureFlag, updateFeatureFlagRollout, deleteFeatureFlag } from "./repositories/feature-flag.repository";

// Service

// Service
import { featureFlagsService as service } from "./services/feature-flags.service";
export { service };

export * from './index';
