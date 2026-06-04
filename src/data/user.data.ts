import db from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function getUserById(id: string) {
  return db.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      bio: true,
      headline: true,
      socialLinks: true,
      createdAt: true,
      isBanned: true,
    },
  });
}

export async function getUserByEmail(email: string) {
  return db.user.findUnique({
    where: { email },
  });
}

export async function createUser(data: { name?: string; email: string; password?: string; role?: Role }) {
  return db.user.create({
    data,
  });
}

export async function getUserProfile(id: string) {
  return db.user.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          courses: true,
          enrollments: true,
        },
      },
    },
  });
}

export async function getAllUsers(params: { page?: number; limit?: number; search?: string; role?: Role }) {
  const page = params.page || 1;
  const limit = params.limit || 12;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { email: { contains: params.search, mode: "insensitive" } },
    ];
  }
  if (params.role) {
    where.role = params.role;
  }

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    db.user.count({ where }),
  ]);

  return { users, total, pages: Math.ceil(total / limit) };
}

export async function getUserCount() {
  return db.user.count();
}

export async function getUserCountByRole() {
  const counts = await db.user.groupBy({
    by: ["role"],
    _count: {
      id: true,
    },
  });
  return counts.reduce((acc, curr) => {
    acc[curr.role] = curr._count.id;
    return acc;
  }, {} as Record<Role, number>);
}

export async function updateUser(id: string, data: any) {
  return db.user.update({
    where: { id },
    data,
  });
}

export async function banUser(id: string, reason?: string) {
  return db.user.update({
    where: { id },
    data: {
      isBanned: true,
      bannedAt: new Date(),
      bannedReason: reason,
    },
  });
}

export async function unbanUser(id: string) {
  return db.user.update({
    where: { id },
    data: {
      isBanned: false,
      bannedAt: null,
      bannedReason: null,
    },
  });
}

export async function getUserGrowthTimeline() {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  const users = await db.user.findMany({
    where: {
      createdAt: { gte: startDate },
    },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const timeline: Record<string, number> = {};
  users.forEach((u) => {
    const key = u.createdAt.toISOString().split("T")[0];
    timeline[key] = (timeline[key] || 0) + 1;
  });

  return Object.entries(timeline).map(([date, count]) => ({ date, count }));
}

