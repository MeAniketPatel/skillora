"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAdmin } from "@/shared/lib/auth-helpers";
import {
  featureFlagSchema,
  toggleFeatureFlagSchema,
  updateRolloutSchema,
} from "@/validations/feature-flag.schema";
import { createFeatureFlag as createFeatureFlagDAL, toggleFeatureFlag as toggleFeatureFlagDAL, updateFeatureFlagRollout, deleteFeatureFlag as deleteFeatureFlagDAL } from "@/features/feature-flags/server";
export async function createFeatureFlagAction(
  values: z.infer<typeof featureFlagSchema>
) {
  return actionHandler(async () => {
    await requireAdmin();
    const validated = featureFlagSchema.parse(values);
    const flag = await createFeatureFlagDAL(validated);
    revalidatePath("/admin/feature-flags");
    return flag;
  });
}

export async function toggleFeatureFlagAction(
  values: z.infer<typeof toggleFeatureFlagSchema>
) {
  return actionHandler(async () => {
    await requireAdmin();
    const validated = toggleFeatureFlagSchema.parse(values);
    const flag = await toggleFeatureFlagDAL(validated.id, validated.isEnabled);
    revalidatePath("/admin/feature-flags");
    return flag;
  });
}

export async function updateFeatureFlagRolloutAction(
  values: z.infer<typeof updateRolloutSchema>
) {
  return actionHandler(async () => {
    await requireAdmin();
    const validated = updateRolloutSchema.parse(values);
    const flag = await updateFeatureFlagRollout(validated.id, validated.rolloutPct);
    revalidatePath("/admin/feature-flags");
    return flag;
  });
}

export async function deleteFeatureFlagAction(id: string) {
  return actionHandler(async () => {
    await requireAdmin();
    await deleteFeatureFlagDAL(id);
    revalidatePath("/admin/feature-flags");
    return { success: true };
  });
}
