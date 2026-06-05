import { z } from "zod";

export const createCartSchema = z.object({
  // TODO: define input shape
});

export const updateCartSchema = z.object({
  id: z.string(),
});

export const listCartQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateCartInput = z.infer<typeof createCartSchema>;
export type UpdateCartInput = z.infer<typeof updateCartSchema>;
export type ListCartQuery = z.infer<typeof listCartQuerySchema>;
