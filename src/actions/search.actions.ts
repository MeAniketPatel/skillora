"use server";

import { actionHandler } from "@/shared/lib/action-utils";
import { globalSearch, SearchFilters } from "@/features/search/server";
export async function searchAction(query: string, filters: SearchFilters = {}) {
  return actionHandler(async () => {
    return globalSearch(query, filters);
  });
}
