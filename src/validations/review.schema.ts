import { z } from "zod";
import { APP } from "@/constants/app";

export const reviewCreateSchema = z.object({
  courseId: z.string().min(1),
  rating: z.number().min(APP.REVIEW_MIN_RATING).max(APP.REVIEW_MAX_RATING),
  comment: z.string().max(2000).optional(),
});

export const reviewUpdateSchema = z.object({
  rating: z.number().min(APP.REVIEW_MIN_RATING).max(APP.REVIEW_MAX_RATING).optional(),
  comment: z.string().max(2000).optional(),
});

export type ReviewCreateInput = z.infer<typeof reviewCreateSchema>;
export type ReviewUpdateInput = z.infer<typeof reviewUpdateSchema>;
