import db from "@/shared/lib/prisma";

export async function recordActivity(userId: string, type: string, metadata?: any) {
  return db.activity.create({
    data: {
      userId,
      type,
      metadata: metadata || {},
    },
  });
}

export async function getUserActivities(userId: string, limit = 20) {
  return db.activity.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
