"use server";

import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { toggleBookmarkSchema } from "@/validations/bookmark.schema";
import { toggleBookmark } from "@/data/bookmark.data";
import { revalidatePath } from "next/cache";

export async function toggleBookmarkAction(values: { lessonId: string }) {
  return actionHandler(async () => {
    const user = await requireAuth();
    const validated = toggleBookmarkSchema.parse(values);

    const result = await toggleBookmark(user.id, validated.lessonId);
    
    // Revalidate learning space and bookmarks list
    revalidatePath("/student/bookmarks");
    revalidatePath(`/learn`);
    return result;
  });
}
