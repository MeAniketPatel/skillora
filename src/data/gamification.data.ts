import db from "@/lib/prisma";

export async function getUserXPPoints(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { points: true },
  });
  return user?.points || 0;
}

export async function awardXPPoints(userId: string, amount: number, reason: string) {
  // Update user's aggregate points
  await db.user.update({
    where: { id: userId },
    data: {
      points: {
        increment: amount,
      },
    },
  });

  // Log the transaction
  return db.xPTransaction.create({
    data: {
      userId,
      amount,
      reason,
    },
  });
}

export async function getUserBadgesList(userId: string) {
  return db.userBadge.findMany({
    where: { userId },
    orderBy: { awardedAt: "desc" },
  });
}

export async function unlockBadgeForUser(userId: string, badgeId: string) {
  const existing = await db.userBadge.findUnique({
    where: {
      userId_badgeId: {
        userId,
        badgeId,
      },
    },
  });
  if (existing) return existing;

  return db.userBadge.create({
    data: {
      userId,
      badgeId,
    },
  });
}

export async function getLeaderboardRankings(limit = 10) {
  return db.user.findMany({
    orderBy: { points: "desc" },
    take: limit,
    select: {
      id: true,
      name: true,
      image: true,
      points: true,
      headline: true,
    },
  });
}
