import React from "react";
import { requireAdmin } from "@/lib/auth-helpers";
import { getPendingModerationItems } from "@/data/moderation.data";
import { PageHeader } from "@/components/shared/page-header";
import { ContentModerationQueue } from "@/components/admin/content-moderation-queue";

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
