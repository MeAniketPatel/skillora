"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAdmin } from "@/shared/lib/auth-helpers";
import { service as contactService } from "@/features/contact/server";
import { contactSchema } from "@/features/contact/contracts/contact.contract";;

import { assertContactAccess } from "@/features/contact/permissions/contact.permissions";
export async function submitContactForm(values: any) {
  return actionHandler(async () => {
    const validated = contactSchema.parse(values);
    const msg = await contactService.createContactMessage(validated);
    return msg;
  });
}

export async function markContactReplied(id: string) {
  return actionHandler(async () => {
    const admin = await requireAdmin();
    const msg = await contactService.markContactMessageReplied(id, admin.id);
    revalidatePath(`/admin/contact`);
    return msg;
  });
}
