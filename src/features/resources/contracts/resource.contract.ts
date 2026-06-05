import { z } from "zod";


export const addResourceSchema = z.object({
  name: z.string().min(3).max(100),
  url: z.string().url(),
  fileSize: z.coerce.number().optional().nullable(),
  fileType: z.string().optional().nullable(),
});
