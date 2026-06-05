import React from "react";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { getStudyGroups, getStudyGroupById, isGroupMember } from "@/features/social";
import { PageHeader } from "@/shared/components/shared/page-header";
import { GroupCard } from "@/features/study-groups";
import { GroupChat } from "@/features/study-groups";
import { CreateGroupForm } from "@/features/study-groups";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Info, Sparkles } from "lucide-react";

interface StudyGroupsPageProps {
  searchParams: Promise<{
    activeGroup?: string;
  }>;
}

export default async function StudyGroupsPage({ searchParams }: StudyGroupsPageProps) {
  const user = await requireAuth();
  const { activeGroup } = await searchParams;

  const groups = await getStudyGroups();

  let activeGroupDetails = null;
  let isCurrentMember = false;

  if (activeGroup) {
    activeGroupDetails = await getStudyGroupById(activeGroup);
    if (activeGroupDetails) {
      isCurrentMember = await isGroupMember(activeGroup, user.id!);
    }
  }

  // Find which groups the user is a member of to pass to GroupCards
  const userJoinedGroupIds = new Set(
    groups
      .filter((g) => g.creatorId === user.id) // Creator is automatically a member
      .map((g) => g.id)
  );

  // We should also check explicit memberships for the logged in user
  for (const group of groups) {
    const member = await isGroupMember(group.id, user.id!);
    if (member) {
      userJoinedGroupIds.add(group.id);
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <PageHeader
          title="Student Study Groups"
          description="Browse peer learning cohorts, start team discussion channels, and coordinate group projects."
        />
        <CreateGroupForm />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-sm font-bold text-neutral-850 dark:text-neutral-50 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            Discover Groups
          </h2>

          {groups.length === 0 ? (
            <Card className="border border-dashed border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-10 text-center bg-white dark:bg-neutral-900 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center space-y-3 p-0">
                <div className="h-10 w-10 bg-neutral-50 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                  <Info className="h-5 w-5 text-neutral-400" />
                </div>
                <p className="text-sm font-semibold text-neutral-850 dark:text-neutral-50">No study groups online</p>
                <p className="text-xs text-neutral-400">
                  Be the first to click &ldquo;Create Study Group&rdquo; and recruit peers!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group as any}
                  isMember={userJoinedGroupIds.has(group.id)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          {activeGroupDetails && isCurrentMember ? (
            <GroupChat
              groupId={activeGroupDetails.id}
              groupName={activeGroupDetails.name}
              initialMessages={activeGroupDetails.messages as any}
              currentUserId={user.id!}
              members={activeGroupDetails.members as any}
            />
          ) : (
            <Card className="bg-neutral-50 dark:bg-neutral-950 border border-dashed border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-6 text-center h-[500px] flex items-center justify-center">
              <p className="text-xs text-neutral-450 italic max-w-[200px]">
                Click &ldquo;Chat&rdquo; on any group you have joined to load its group discussion channel.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
