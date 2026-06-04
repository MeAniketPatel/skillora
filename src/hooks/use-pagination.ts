"use client";

import { useSearchParams } from "next/navigation";
import { APP } from "@/constants/app";

export function usePagination(defaultLimit = APP.PAGINATION_DEFAULT || 10) {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");

  const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
  const limit = limitParam ? Math.max(1, parseInt(limitParam, 10)) : defaultLimit;

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
}
