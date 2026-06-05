import { z } from "zod";


export const webhookSchema = z.object({
  url: z.string().url("Please enter a valid HTTP/HTTPS URL"),
  event: z.string().min(2, "Event type is required"),
});

export type WebhookInput = z.infer<typeof webhookSchema>;
