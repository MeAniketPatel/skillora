"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/lib/action-utils";
import { requireAuth } from "@/lib/auth-helpers";
import { toggleWishlist as toggleWishlistData } from "@/data";

export async function toggleWishlist(courseId: string) {
  return actionHandler(async () => {
    const user = await requireAuth();
    
    const result = await toggleWishlistData(user.id, courseId);
    
    revalidatePath(`/courses/${courseId}`);
    revalidatePath(`/student/wishlist`);
    
    return result;
  });
}
