import { z } from "zod";
import { APP } from "@/shared/constants/app";

export const pageSizeSchema = z.coerce
  .number()
  .int()
  .min(1)
  .max(APP.PAGINATION_MAX)
  .default(APP.PAGINATION_DEFAULT);

export const pageNumberSchema = z.coerce.number().int().min(1).default(1);

export const paginationSchema = z.object({
  page: pageNumberSchema.optional(),
  pageSize: pageSizeSchema.optional(),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
