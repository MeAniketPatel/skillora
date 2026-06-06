// Auto-generated service wrapper for the search feature.
// Delegates to the repositories by default (DI via default-param pattern
// per ADR-007). Mutation methods emit domain events on the in-process
// event bus for cross-feature side effects.
import * as searchRepo from "../repositories/search.repository";

export const searchService = {
  globalSearch: searchRepo.globalSearch,
};

export type SearchService = typeof searchService;
