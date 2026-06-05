import db from "@/shared/lib/prisma";

export async function createReferral(referrerId: string, referredId: string) {
  const existing = await db.referral.findFirst({
    where: { referredId },
  });

  if (existing) return existing;

  return db.referral.create({
    data: {
      referrerId,
      referredId,
      pointsAwarded: 100,
      isConverted: false,
    },
  });
}

export async function convertReferral(referredId: string) {
  const referral = await db.referral.findUnique({
    where: { referredId },
  });

  if (!referral || referral.isConverted) return null;

  // Convert the referral
  const updatedReferral = await db.referral.update({
    where: { referredId },
    data: {
      isConverted: true,
    },
  });

  // Award the referrer points
  await db.user.update({
    where: { id: referral.referrerId },
    data: {
      points: {
        increment: referral.pointsAwarded,
      },
    },
  });

  return updatedReferral;
}

export async function getReferralStats(referrerId: string) {
  const referrals = await db.referral.findMany({
    where: { referrerId },
    include: {
      referred: {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalCount = referrals.length;
  const convertedCount = referrals.filter((r: any) => r.isConverted).length;
  const pointsEarned = referrals.filter((r: any) => r.isConverted).reduce((acc: number, curr: any) => acc + curr.pointsAwarded, 0);

  return {
    referrals,
    totalCount,
    convertedCount,
    pointsEarned,
  };
}
