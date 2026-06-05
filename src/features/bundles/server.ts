// Server-only barrel. Import this from server actions, route handlers,
// server components, and middleware. NEVER import from "use client" files.

// Repository functions
export { getCourseBundles, getCourseBundleDetail, createCourseBundle } from "./repositories/bundle.repository";

// Service

// Service
import { bundlesService as service } from "./services/bundles.service";
export { service };
