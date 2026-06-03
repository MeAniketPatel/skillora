"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/lib/action-utils";
import { requireAdmin } from "@/lib/auth-helpers";
import { createContactMessage as createContactMessageData, markContactMessageReplied } from "@/data";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(10),
});

export async function submitContactForm(values: any) {
  return actionHandler(async () => {
    const validated = contactSchema.parse(values);
    const msg = await createContactMessageData(validated);
    return msg;
  });
}

export async function markContactReplied(id: string) {
  return actionHandler(async () => {
    const admin = await requireAdmin();
    const msg = await markContactMessageReplied(id, admin.id);
    revalidatePath(`/admin/contact`);
    return msg;
  });
}
