"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { toggleWishlist as toggleWishlistData } from "@/features/wishlist";

export async function toggleWishlist(courseId: string) {
  return actionHandler(async () => {
    const user = await requireAuth();
    
    const result = await toggleWishlistData(user.id, courseId);
    
    revalidatePath(`/courses/${courseId}`);
    revalidatePath(`/student/wishlist`);
    
    return result;
  });
}
