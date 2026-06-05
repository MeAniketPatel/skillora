import db from "@/lib/prisma";
import { ModerationStatus, ModerationContentType } from "@prisma/client";

export async function getPendingModerationItems(limit = 50) {
  return db.moderationItem.findMany({
    where: { status: ModerationStatus.PENDING },
    orderBy: { createdAt: "asc" },
    take: limit,
  });
}

export async function getModerationItems(filter?: {
  status?: ModerationStatus;
  contentType?: ModerationContentType;
}) {
  return db.moderationItem.findMany({
    where: {
      ...(filter?.status ? { status: filter.status } : {}),
      ...(filter?.contentType ? { contentType: filter.contentType } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createModerationItem(data: {
  contentType: ModerationContentType;
  contentId: string;
  reason?: string;
}) {
  // Upsert: only one pending item per content
  const existing = await db.moderationItem.findFirst({
    where: { contentType: data.contentType, contentId: data.contentId, status: ModerationStatus.PENDING },
  });
  if (existing) return existing;
  return db.moderationItem.create({
    data: { ...data, status: ModerationStatus.PENDING },
  });
}

export async function approveModerationItem(id: string, reviewedBy: string) {
  return db.moderationItem.update({
    where: { id },
    data: {
      status: ModerationStatus.APPROVED,
      reviewedBy,
      reviewedAt: new Date(),
    },
  });
}

export async function rejectModerationItem(id: string, reviewedBy: string) {
  return db.moderationItem.update({
    where: { id },
    data: {
      status: ModerationStatus.REJECTED,
      reviewedBy,
      reviewedAt: new Date(),
    },
  });
}

export async function getModerationStats() {
  const [pending, approved, rejected] = await Promise.all([
    db.moderationItem.count({ where: { status: ModerationStatus.PENDING } }),
    db.moderationItem.count({ where: { status: ModerationStatus.APPROVED } }),
    db.moderationItem.count({ where: { status: ModerationStatus.REJECTED } }),
  ]);
  return { pending, approved, rejected };
}
