import { z } from "zod";

export const createCertificatesSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
});

export const updateCertificatesSchema = z.object({
  id: z.string(),
});

export const listCertificatesQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateCertificatesInput = z.infer<typeof createCertificatesSchema>;
export type UpdateCertificatesInput = z.infer<typeof updateCertificatesSchema>;
export type ListCertificatesQuery = z.infer<typeof listCertificatesQuerySchema>;
