import React from "react";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { getUserProfileCard, getUserPortfolio, getUserActivities } from "@/data";
import { PageHeader } from "@/shared/components/shared/page-header";
import { ProfileCard } from "@/components/profile/profile-card";
import { ProfilePortfolio } from "@/components/profile/profile-portfolio";
import { ProfileActivityFeed } from "@/components/profile/profile-activity-feed";

export default async function OwnProfilePage() {
  const user = await requireAuth();

  const profile = await getUserProfileCard(user.id!);
  if (!profile) {
    throw new Error("User profile not found.");
  }

  const projects = await getUserPortfolio(user.id!);
  const activities = await getUserActivities(user.id!);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <PageHeader
        title="My Profile & Portfolio"
        description="View and update your display information, social handles, achievements and projects."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1">
          <ProfileCard user={profile as any} isOwnProfile={true} initialFollowing={false} />
        </div>
        <div className="lg:col-span-2 space-y-8">
          <ProfilePortfolio projects={projects} isOwnProfile={true} />
          <ProfileActivityFeed activities={activities as any} />
        </div>
      </div>
    </div>
  );
}
