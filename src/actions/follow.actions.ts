"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { followUser, unfollowUser, isFollowing } from "@/data";

export async function toggleFollowAction(targetUserId: string) {
  return actionHandler(async () => {
    const user = await requireAuth();
    if (user.id === targetUserId) {
      throw new Error("You cannot follow yourself.");
    }

    const following = await isFollowing(user.id!, targetUserId);

    if (following) {
      await unfollowUser(user.id!, targetUserId);
    } else {
      await followUser(user.id!, targetUserId);
    }

    revalidatePath(`/profile/${targetUserId}`);
    revalidatePath("/profile");
    return { following: !following };
  });
}
