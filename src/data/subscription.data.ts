import db from "@/shared/lib/prisma";

export async function getUserSubscription(userId: string) {
  return db.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      endDate: {
        gt: new Date(),
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createSubscription(userId: string, plan: string, durationDays = 30) {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + durationDays);

  // Deactivate any existing subscriptions first
  await db.subscription.updateMany({
    where: {
      userId,
      status: "ACTIVE",
    },
    data: {
      status: "EXPIRED",
    },
  });

  return db.subscription.create({
    data: {
      userId,
      plan,
      status: "ACTIVE",
      startDate,
      endDate,
    },
  });
}
