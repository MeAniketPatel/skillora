import { z } from "zod";


export const createCollectionSchema = z.object({
  name: z.string().min(1, "Collection name is required").max(100),
  description: z.string().max(500).optional().or(z.literal("")),
});

export const courseToCollectionSchema = z.object({
  collectionId: z.string().min(1),
  courseId: z.string().min(1),
});
