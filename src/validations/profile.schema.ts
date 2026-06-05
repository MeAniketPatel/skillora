import { z } from "zod";

export const profileUpdateSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  headline: z.string().max(100).optional(),
  bio: z.string().max(1000).optional(),
  twitter: z.string().url().or(z.literal("")).optional(),
  linkedin: z.string().url().or(z.literal("")).optional(),
  github: z.string().url().or(z.literal("")).optional(),
});

export const portfolioProjectSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().min(10).max(500),
  projectUrl: z.string().url().or(z.literal("")).optional(),
  imageUrl: z.string().url().or(z.literal("")).optional(),
});
