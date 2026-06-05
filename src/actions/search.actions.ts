"use server";

import { actionHandler } from "@/shared/lib/action-utils";
import { service as searchService, SearchFilters } from "@/features/search/server";

export async function searchAction(query: string, filters: SearchFilters = {}) {
  return actionHandler(async () => {
    return searchService.globalSearch(query, filters);
  });
}
