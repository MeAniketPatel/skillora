import { z } from "zod"

// Real contract (migrated from src/validations/admin.schema.ts)
export const userRoleUpdateSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(["STUDENT", "TEACHER", "ADMIN"]),
});

export const categoryCreateSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes"),
  icon: z.string().optional(),
});

export const categoryUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
  icon: z.string().optional(),
});

export const couponCreateSchema = z.object({
  code: z.string().min(3).max(30).toUpperCase(),
  discount: z.number().min(0),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  maxUses: z.number().min(1).optional(),
  expiresAt: z.string().datetime().optional(),
  courseId: z.string().optional(),
});

export type UserRoleUpdateInput = z.infer<typeof userRoleUpdateSchema>;
export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
export type CouponCreateInput = z.infer<typeof couponCreateSchema>;
