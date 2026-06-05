"use server";

import { actionHandler } from "@/lib/action-utils";
import { globalSearch, SearchFilters } from "@/data";

export async function searchAction(query: string, filters: SearchFilters = {}) {
  return actionHandler(async () => {
    return globalSearch(query, filters);
  });
}
