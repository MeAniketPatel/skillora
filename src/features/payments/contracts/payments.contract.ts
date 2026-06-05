import { z } from "zod";

export const createPaymentsSchema = z.object({
  // TODO: define input shape
});

export const updatePaymentsSchema = z.object({
  id: z.string(),
});

export const listPaymentsQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreatePaymentsInput = z.infer<typeof createPaymentsSchema>;
export type UpdatePaymentsInput = z.infer<typeof updatePaymentsSchema>;
export type ListPaymentsQuery = z.infer<typeof listPaymentsQuerySchema>;
