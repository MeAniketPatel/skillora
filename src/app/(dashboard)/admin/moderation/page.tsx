import React from "react";
import { requireAdmin } from "@/shared/lib/auth-helpers";
import { getPendingModerationItems } from "@/features/admin";
import { PageHeader } from "@/shared/components/shared/page-header";
import { ContentModerationQueue } from "@/features/admin";

export default async function AdminModerationPage() {
  await requireAdmin();

  const items = await getPendingModerationItems();

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="Content Moderation Queue"
        description="Review reported reviews, comments, discussions, and other user-generated content flagged for safety."
      />

      <ContentModerationQueue initialItems={items as any} />
    </div>
  );
}
