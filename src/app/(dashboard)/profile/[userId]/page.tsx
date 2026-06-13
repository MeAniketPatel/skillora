import React from "react";
import { redirect } from "next/navigation";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { PageHeader } from "@/shared/components/shared/page-header";

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

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <PageHeader
        title="User Profile"
        description="Browse student portfolio projects, active streaks and social handles."
      />
      <p className="text-muted-foreground">Profile coming soon.</p>
    </div>
  );
}
