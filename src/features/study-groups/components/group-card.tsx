"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { joinStudyGroupAction, leaveStudyGroupAction } from "@/actions/study-group.actions";
import { Users, Lock, Unlock, MessageSquare, Loader2 } from "lucide-react";

interface StudyGroupType {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  isPrivate: boolean;
  creatorId: string;
  _count: {
    members: number;
  };
}

interface GroupCardProps {
  group: StudyGroupType;
  isMember: boolean;
}

export function GroupCard({ group, isMember }: GroupCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAction = () => {
    startTransition(async () => {
      if (isMember) {
        const res = await leaveStudyGroupAction(group.id);
        if (!res.success) alert(res.error || "Failed to leave group.");
      } else {
        const res = await joinStudyGroupAction(group.id);
        if (!res.success) alert(res.error || "Failed to join group.");
      }
      router.refresh();
    });
  };

  return (
    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-sm font-bold text-neutral-850 dark:text-neutral-50">{group.name}</h3>
              <Badge variant="ghost" className="p-0 border-none">
                {group.isPrivate ? (
                  <Lock className="h-3 w-3 text-neutral-400" />
                ) : (
                  <Unlock className="h-3 w-3 text-neutral-450" />
                )}
              </Badge>
            </div>
            <p className="text-xs text-neutral-550 dark:text-neutral-400 line-clamp-2 leading-relaxed">
              {group.description || "No description provided."}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800/50">
          <span className="text-[11px] text-neutral-450 font-semibold flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {group._count.members} Members
          </span>

          <div className="flex items-center gap-1.5">
            {isMember && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/student/study-groups?activeGroup=${group.id}`)}
                className="h-8 text-xs rounded-xl gap-1"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Chat
              </Button>
            )}
            <Button
              variant={isMember ? "ghost" : "default"}
              size="sm"
              disabled={isPending}
              onClick={handleAction}
              className={`h-8 text-xs rounded-xl font-bold ${
                isMember ? "text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20" : ""
              }`}
            >
              {isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : isMember ? (
                "Leave"
              ) : (
                "Join Group"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
