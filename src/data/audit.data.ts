import db from "@/lib/prisma";
import { AuthAuditAction } from "@prisma/client";

export async function getAuditLogs(params: { page?: number; limit?: number; action?: AuthAuditAction; userId?: string; startDate?: Date; endDate?: Date }) {
  const page = params.page || 1;
  const limit = params.limit || 20;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (params.action) where.action = params.action;
  if (params.userId) where.userId = params.userId;
  if (params.startDate || params.endDate) {
    where.createdAt = {};
    if (params.startDate) where.createdAt.gte = params.startDate;
    if (params.endDate) where.createdAt.lte = params.endDate;
  }

  const [logs, total] = await Promise.all([
    db.authAuditLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
      },
    }),
    db.authAuditLog.count({ where }),
  ]);

  return { logs, total, pages: Math.ceil(total / limit) };
}
