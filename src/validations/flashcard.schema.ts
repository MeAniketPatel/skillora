import { z } from "zod";

export const createDeckSchema = z.object({
  title: z.string().min(3).max(50),
  description: z.string().max(200).optional(),
});

export const addCardSchema = z.object({
  front: z.string().min(1).max(1000),
  back: z.string().min(1).max(1000),
});
