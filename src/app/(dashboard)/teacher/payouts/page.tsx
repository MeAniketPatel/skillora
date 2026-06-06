import React from "react";
import { requireTeacher } from "@/shared/lib/auth-helpers";
import { getPayoutBalance, getPayoutHistory } from "@/features/teachers/server";
import { PageHeader } from "@/shared/components/shared/page-header";
import { PayoutDashboard } from "@/features/teachers";

export default async function TeacherPayoutsPage() {
  const user = await requireTeacher();

  const balance = await getPayoutBalance(user.id);
  const history = await getPayoutHistory(user.id);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="Payout Dashboard"
        description="Monitor your course earnings, view your balance, and request payouts to your account."
      />

      <PayoutDashboard balance={balance} history={history} />
    </div>
  );
}
