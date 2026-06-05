import { requireAuth } from "@/shared/lib/auth-helpers";
import { PageHeader } from "@/shared/components/shared/page-header";
import { getUserNotifications } from "@/features/notifications";
import { NotificationsClient } from "@/components/notifications/notifications-client";

export default async function NotificationsPage() {
  const user = await requireAuth();
  const notifications = await getUserNotifications(user.id, { limit: 50 });

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        title="Notifications"
        description="Stay up to date with your course announcements, reviews, feedback, and student interactions."
      />
      <NotificationsClient initialNotifications={notifications} />
    </div>
  );
}
