import React from "react";
import { redirect } from "next/navigation";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { getUserProfileCard, getUserPortfolio, getUserActivities, isFollowing } from "@/features/social/server";
import { PageHeader } from "@/shared/components/shared/page-header";
import { ProfileCard } from "@/features/social/server";
import { ProfilePortfolio } from "@/features/social/server";
import { ProfileActivityFeed } from "@/features/social/server";

interface ProfilePageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function TargetProfilePage({ params }: ProfilePageProps) {
  const user = await requireAuth();
  const { userId } = await params;

  if (user.id === userId) {
    redirect("/profile");
  }

  const profile = await getUserProfileCard(userId);
  if (!profile) {
    throw new Error("User profile not found.");
  }

  const projects = await getUserPortfolio(userId);
  const activities = await getUserActivities(userId);
  const following = await isFollowing(user.id!, userId);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <PageHeader
        title={`${profile.name || "Learner"}'s Profile`}
        description="Browse student portfolio projects, active streaks and social handles."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1">
          <ProfileCard user={profile as any} isOwnProfile={false} initialFollowing={following} />
        </div>
        <div className="lg:col-span-2 space-y-8">
          <ProfilePortfolio projects={projects} isOwnProfile={false} />
          <ProfileActivityFeed activities={activities as any} />
        </div>
      </div>
    </div>
  );
}

