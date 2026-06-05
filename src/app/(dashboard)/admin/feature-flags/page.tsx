import React from "react";
import { requireAdmin } from "@/shared/lib/auth-helpers";
import { getFeatureFlags } from "@/features/feature-flags";
import { PageHeader } from "@/shared/components/shared/page-header";
import { FeatureFlagsPanel } from "@/features/admin";

export default async function AdminFeatureFlagsPage() {
  await requireAdmin();

  const flags = await getFeatureFlags();

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="Feature Flags Manager"
        description="Release features dynamically, control rollouts, and toggle features platform-wide."
      />

      <FeatureFlagsPanel initialFlags={flags as any} />
    </div>
  );
}
