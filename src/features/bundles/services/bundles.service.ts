// Auto-generated service wrapper for the bundles feature.
// Delegates to the repositories by default (DI via default-param pattern
// per ADR-007). Mutation methods emit domain events on the in-process
// event bus for cross-feature side effects.
import { eventBus } from "@/shared/events";
import * as bundleRepo from "../repositories/bundle.repository";

export const bundlesService = {
  getCourseBundles: bundleRepo.getCourseBundles,
  getCourseBundleDetail: bundleRepo.getCourseBundleDetail,
  async createCourseBundle(...args: Parameters<typeof bundleRepo.createCourseBundle>): Promise<Awaited<ReturnType<typeof bundleRepo.createCourseBundle>>> {
    const result = await bundleRepo.createCourseBundle(...args);
    await eventBus.emit({ name: "bundles.createCourseBundle", feature: "bundles", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
};

export type BundlesService = typeof bundlesService;
