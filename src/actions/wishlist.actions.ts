"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { service as wishlistService } from "@/features/wishlist/server";
export async function toggleWishlist(courseId: string) {
  return actionHandler(async () => {
    const user = await requireAuth();
    
    const result = await wishlistService.toggleWishlist(user.id, courseId);
    
    revalidatePath(`/courses/${courseId}`);
    revalidatePath(`/student/wishlist`);
    
    return result;
  });
}
