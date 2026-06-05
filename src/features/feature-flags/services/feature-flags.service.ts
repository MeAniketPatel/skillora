// Auto-generated service wrapper for the feature-flags feature.
// Delegates to the repositories by default (DI via default-param pattern
// per ADR-007). Mutation methods emit domain events on the in-process
// event bus for cross-feature side effects.
import { eventBus } from "@/shared/events";
import * as featureFlagRepo from "../repositories/feature-flag.repository";

export const featureFlagsService = {
  getFeatureFlags: featureFlagRepo.getFeatureFlags,
  getFeatureFlagByKey: featureFlagRepo.getFeatureFlagByKey,
  async createFeatureFlag(...args: Parameters<typeof featureFlagRepo.createFeatureFlag>): Promise<Awaited<ReturnType<typeof featureFlagRepo.createFeatureFlag>>> {
    const result = await featureFlagRepo.createFeatureFlag(...args);
    await eventBus.emit({ name: "feature-flags.createFeatureFlag", feature: "feature-flags", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async toggleFeatureFlag(...args: Parameters<typeof featureFlagRepo.toggleFeatureFlag>): Promise<Awaited<ReturnType<typeof featureFlagRepo.toggleFeatureFlag>>> {
    const result = await featureFlagRepo.toggleFeatureFlag(...args);
    await eventBus.emit({ name: "feature-flags.toggleFeatureFlag", feature: "feature-flags", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async updateFeatureFlagRollout(...args: Parameters<typeof featureFlagRepo.updateFeatureFlagRollout>): Promise<Awaited<ReturnType<typeof featureFlagRepo.updateFeatureFlagRollout>>> {
    const result = await featureFlagRepo.updateFeatureFlagRollout(...args);
    await eventBus.emit({ name: "feature-flags.updateFeatureFlagRollout", feature: "feature-flags", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async deleteFeatureFlag(...args: Parameters<typeof featureFlagRepo.deleteFeatureFlag>): Promise<Awaited<ReturnType<typeof featureFlagRepo.deleteFeatureFlag>>> {
    const result = await featureFlagRepo.deleteFeatureFlag(...args);
    await eventBus.emit({ name: "feature-flags.deleteFeatureFlag", feature: "feature-flags", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
};

export type FeatureFlagsService = typeof featureFlagsService;
