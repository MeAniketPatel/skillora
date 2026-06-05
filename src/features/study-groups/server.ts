// Server-only barrel. Import this from server actions, route handlers,
// server components, and middleware. NEVER import from "use client" files.

// Service

// Service
import { studyGroupsService as service } from "./services/study-groups.service";
export { service };

export * from './index';
