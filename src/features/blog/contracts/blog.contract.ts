import { z } from "zod"

// Real contract (migrated from src/validations/blog.schema.ts)
export const createBlogPostSchema = z.object({
  title: z.string().min(5).max(150),
  content: z.string().min(20).max(20000),
  excerpt: z.string().max(300).optional().nullable(),
  coverImage: z.string().url().optional().nullable().or(z.literal("")),
});

export const blogCommentSchema = z.object({
  content: z.string().min(2).max(1000),
});
