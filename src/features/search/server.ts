// Server-only barrel. Import this from server actions, route handlers,
// server components, and middleware. NEVER import from "use client" files.

// Repository functions
export { globalSearch } from "./repositories/search.repository";
export type { SearchFilters } from "./repositories/search.repository";

// Service

// Service
import { searchService as service } from "./services/search.service";
export { service };
