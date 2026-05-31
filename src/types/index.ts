/**
 * Shared TypeScript types for the Skillora platform.
 * Add global types here that are used across multiple modules.
 */

/** User roles in the platform */
export type UserRole = "STUDENT" | "TEACHER" | "ADMIN";

/** Generic API response wrapper */
export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

/** Pagination parameters */
export type PaginationParams = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

/** Sort direction */
export type SortDirection = "asc" | "desc";
