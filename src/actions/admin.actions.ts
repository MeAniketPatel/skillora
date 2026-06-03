"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/lib/action-utils";
import { requireAdmin } from "@/lib/auth-helpers";
import { userRoleUpdateSchema } from "@/validations/admin.schema";
import { updateUser, banUser as banUserData, unbanUser as unbanUserData } from "@/data";

export async function updateUserRole(values: any) {
  return actionHandler(async () => {
    await requireAdmin();
    const validated = userRoleUpdateSchema.parse(values);
    
    const user = await updateUser(validated.userId, { role: validated.role });
    revalidatePath(`/admin/users`);
    return user;
  });
}

export async function banUser(userId: string, reason?: string) {
  return actionHandler(async () => {
    await requireAdmin();
    
    const user = await banUserData(userId, reason);
    revalidatePath(`/admin/users`);
    return user;
  });
}

export async function unbanUser(userId: string) {
  return actionHandler(async () => {
    await requireAdmin();
    
    const user = await unbanUserData(userId);
    revalidatePath(`/admin/users`);
    return user;
  });
}
