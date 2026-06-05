import db from "@/shared/lib/prisma";

export async function getFeatureFlags() {
  return db.featureFlag.findMany({ orderBy: { createdAt: "asc" } });
}

export async function getFeatureFlagByKey(key: string) {
  return db.featureFlag.findUnique({ where: { key } });
}

export async function createFeatureFlag(data: {
  key: string;
  name: string;
  description?: string;
  isEnabled?: boolean;
  rolloutPct?: number;
}) {
  return db.featureFlag.create({ data });
}

export async function toggleFeatureFlag(id: string, isEnabled: boolean) {
  return db.featureFlag.update({
    where: { id },
    data: { isEnabled },
  });
}

export async function updateFeatureFlagRollout(id: string, rolloutPct: number) {
  return db.featureFlag.update({
    where: { id },
    data: { rolloutPct },
  });
}

export async function deleteFeatureFlag(id: string) {
  return db.featureFlag.delete({ where: { id } });
}
