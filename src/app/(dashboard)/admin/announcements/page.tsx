import React from "react";
import { requireAdmin } from "@/lib/auth-helpers";
import { getGlobalAnnouncements } from "@/data/announcement.data";
import { PageHeader } from "@/components/shared/page-header";
import { PlatformAnnouncements } from "@/components/admin/platform-announcements";

export default async function AdminAnnouncementsPage() {
  // Enforce Admin guard
  await requireAdmin();

  const announcements = await getGlobalAnnouncements();

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="Global Platform Announcements"
        description="Publish system broadcasts, maintenance alerts, or platform-wide updates visible to all users."
      />

      <PlatformAnnouncements initialAnnouncements={announcements as any} />
    </div>
  );
}
