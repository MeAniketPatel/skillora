"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { toggleFollowAction } from "@/actions/follow.actions";
import { UserCheck, UserPlus, Loader2 } from "lucide-react";

interface FollowButtonProps {
  targetUserId: string;
  initialFollowing: boolean;
}

export function FollowButton({ targetUserId, initialFollowing }: FollowButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [following, setFollowing] = useState(initialFollowing);

  const handleFollow = () => {
    startTransition(async () => {
      const res = await toggleFollowAction(targetUserId);
      if (!res.success) {
        alert(res.error || "Failed to toggle follow connection.");
      } else {
        setFollowing(res.data.following);
      }
    });
  };

  return (
    <Button
      variant={following ? "secondary" : "default"}
      size="sm"
      disabled={isPending}
      onClick={handleFollow}
      className="h-9 rounded-xl text-xs gap-1.5 font-bold"
    >
      {isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : following ? (
        <UserCheck className="h-3.5 w-3.5" />
      ) : (
        <UserPlus className="h-3.5 w-3.5" />
      )}
      {following ? "Following" : "Follow"}
    </Button>
  );
}
