"use server";

import { actionHandler } from "@/shared/lib/action-utils";
import { service as searchService, SearchFilters } from "@/features/search/server";

import { assertSearchAccess } from "@/features/search/permissions/search.permissions";
export async function searchAction(query: string, filters: SearchFilters = {}) {
  return actionHandler(async () => {
    return searchService.globalSearch(query, filters);
  });
}
