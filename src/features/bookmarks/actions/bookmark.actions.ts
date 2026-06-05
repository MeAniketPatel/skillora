"use server";

import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { toggleBookmarkSchema } from "@/features/bookmarks/contracts/bookmark.contract";
import { service as studentsService } from "@/features/students/server";
import { revalidatePath } from "next/cache";

import { assertStudentsAccess } from "@/features/students/server";
export async function toggleBookmarkAction(values: { lessonId: string }) {
  return actionHandler(async () => {
    const user = await requireAuth();
    assertStudentsAccess(user.role, "update");
    const validated = toggleBookmarkSchema.parse(values);

    const result = await studentsService.toggleBookmark(user.id, validated.lessonId);
    
    // Revalidate learning space and bookmarks list
    revalidatePath("/student/bookmarks");
    revalidatePath(`/learn`);
    return result;
  });
}
