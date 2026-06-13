import { z } from "zod";

export const createPaymentsSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
});

export const updatePaymentsSchema = z.object({
  id: z.string(),
});

export const listPaymentsQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export const checkoutSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
});

export type CreatePaymentsInput = z.infer<typeof createPaymentsSchema>;
export type UpdatePaymentsInput = z.infer<typeof updatePaymentsSchema>;
export type ListPaymentsQuery = z.infer<typeof listPaymentsQuerySchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
