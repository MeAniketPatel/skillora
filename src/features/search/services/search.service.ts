import * as searchRepo from "../repositories/search.repository";

export const searchService = {
  globalSearch: searchRepo.globalSearch,
};

export type SearchService = typeof searchService;
