import db from "@/lib/prisma";

export async function createPurchase(data: any) {
  return db.purchase.create({ data });
}

export async function getPurchaseByStripeId(stripePaymentId: string) {
  return db.purchase.findUnique({
    where: { stripePaymentId },
  });
}

export async function getUserPurchases(userId: string, params: { page?: number; limit?: number }) {
  const page = params.page || 1;
  const limit = params.limit || 12;
  const skip = (page - 1) * limit;

  const [purchases, total] = await Promise.all([
    db.purchase.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        enrollment: {
          include: {
            course: { select: { title: true, slug: true, thumbnail: true } },
          },
        },
      },
    }),
    db.purchase.count({ where: { userId } }),
  ]);

  return { purchases, total, pages: Math.ceil(total / limit) };
}

export async function getTeacherEarnings(teacherId: string, params?: { startDate?: Date; endDate?: Date }) {
  const where: any = {
    enrollment: { course: { teacherId } },
    status: "COMPLETED",
  };

  if (params?.startDate || params?.endDate) {
    where.createdAt = {};
    if (params.startDate) where.createdAt.gte = params.startDate;
    if (params.endDate) where.createdAt.lte = params.endDate;
  }

  const purchases = await db.purchase.findMany({
    where,
    include: {
      enrollment: {
        include: {
          course: { select: { id: true, title: true } },
        },
      },
    },
  });

  let totalEarnings = 0;
  const earningsByCourse: Record<string, { title: string; revenue: number; sales: number }> = {};

  for (const purchase of purchases) {
    const amount = purchase.amount * 0.9; // Deduct platform fee
    totalEarnings += amount;

    const courseId = purchase.enrollment.course.id;
    if (!earningsByCourse[courseId]) {
      earningsByCourse[courseId] = { title: purchase.enrollment.course.title, revenue: 0, sales: 0 };
    }
    earningsByCourse[courseId].revenue += amount;
    earningsByCourse[courseId].sales += 1;
  }

  return { totalEarnings, earningsByCourse };
}

export async function getPlatformRevenue(params?: { startDate?: Date; endDate?: Date }) {
  const where: any = { status: "COMPLETED" };
  if (params?.startDate || params?.endDate) {
    where.createdAt = {};
    if (params.startDate) where.createdAt.gte = params.startDate;
    if (params.endDate) where.createdAt.lte = params.endDate;
  }

  const result = await db.purchase.aggregate({
    where,
    _sum: { amount: true },
    _count: { id: true },
  });

  const grossSales = result._sum.amount || 0;
  const platformRevenue = grossSales * 0.1; // 10% platform fee
  
  return { grossSales, platformRevenue, totalTransactions: result._count.id };
}

export async function getRevenueTimeSeries(params: { startDate: Date; endDate: Date; groupBy: "day" | "week" | "month" }) {
  // Using raw query for time series since Prisma doesn't natively support Date truncation well
  // For now, returning mock data or simple grouping by fetching and processing in memory
  const purchases = await db.purchase.findMany({
    where: {
      status: "COMPLETED",
      createdAt: { gte: params.startDate, lte: params.endDate },
    },
    select: { amount: true, createdAt: true },
    orderBy: { createdAt: "asc" }
  });

  const timeSeries: Record<string, number> = {};
  
  purchases.forEach(p => {
    let key = "";
    if (params.groupBy === "day") {
      key = p.createdAt.toISOString().split("T")[0];
    } else if (params.groupBy === "month") {
      key = p.createdAt.toISOString().slice(0, 7); // YYYY-MM
    } else {
      // rough week
      const d = new Date(p.createdAt);
      d.setDate(d.getDate() - d.getDay()); // Sunday
      key = d.toISOString().split("T")[0];
    }
    
    timeSeries[key] = (timeSeries[key] || 0) + p.amount;
  });

  return Object.entries(timeSeries).map(([date, amount]) => ({ date, amount }));
}

export async function getRecentPurchases(limit: number = 10) {
  return db.purchase.findMany({
    where: { status: "COMPLETED" },
    include: {
      enrollment: {
        include: {
          course: true,
          user: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
