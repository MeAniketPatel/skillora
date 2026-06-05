import db from "@/shared/lib/prisma";
import { getTeacherEarnings } from "@/features/payments/server";
export async function getPayoutHistory(userId: string) {
  return db.payoutRequest.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPayoutBalance(userId: string) {
  // Fetch teacher earnings (which already deducts 10% platform fee)
  const { totalEarnings } = await getTeacherEarnings(userId);

  // Fetch all payout requests that are PENDING or PAID (REJECTED are not paid out)
  const payoutSummaries = await db.payoutRequest.aggregate({
    where: {
      userId,
      status: { in: ["PENDING", "PAID"] },
    },
    _sum: {
      amount: true,
    },
  });

  const totalRequested = payoutSummaries._sum.amount || 0;
  const availableBalance = Math.max(0, totalEarnings - totalRequested);

  return {
    totalEarnings,
    totalRequested,
    availableBalance,
  };
}

export async function createPayoutRequest(userId: string, amount: number) {
  return db.payoutRequest.create({
    data: {
      userId,
      amount,
      status: "PENDING",
    },
  });
}
