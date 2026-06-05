import db from "@/lib/prisma";
import { Role } from "@prisma/client";
import { APP } from "@/shared/constants/app";

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

export async function getAllInstructors(params: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const page = params.page || 1;
  const limit = params.limit || APP.PAGINATION_DEFAULT;
  const skip = (page - 1) * limit;

  const where: any = {
    role: { in: ["TEACHER", "ADMIN"] },
    isBanned: false,
  };

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { headline: { contains: params.search, mode: "insensitive" } },
    ];
  }

  const [instructors, total] = await Promise.all([
    db.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        image: true,
        bio: true,
        headline: true,
        createdAt: true,
        _count: {
          select: {
            courses: { where: { status: "PUBLISHED" } },
          },
        },
      },
    }),
    db.user.count({ where }),
  ]);

  const instructorIds = instructors.map((i) => i.id);

  const enrollmentCounts = instructorIds.length
    ? await db.enrollment.groupBy({
        by: ["courseId"],
        where: { course: { teacherId: { in: instructorIds } } },
        _count: { id: true },
      })
    : [];

  const courseTeacherMap = instructorIds.length
    ? await db.course.findMany({
        where: { teacherId: { in: instructorIds } },
        select: { id: true, teacherId: true },
      })
    : [];

  const totalStudentsByInstructor: Record<string, number> = {};
  courseTeacherMap.forEach((c) => {
    const count = enrollmentCounts.find((e) => e.courseId === c.id)?._count.id ?? 0;
    totalStudentsByInstructor[c.teacherId] =
      (totalStudentsByInstructor[c.teacherId] || 0) + count;
  });

  return {
    instructors: instructors.map((i) => ({
      id: i.id,
      name: i.name,
      image: i.image,
      bio: i.bio,
      headline: i.headline,
      publishedCourseCount: i._count.courses,
      totalStudents: totalStudentsByInstructor[i.id] || 0,
    })),
    total,
    pages: Math.ceil(total / limit),
  };
}

export async function getInstructorProfile(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bio: true,
      headline: true,
      socialLinks: true,
      createdAt: true,
      role: true,
    },
  });

  if (!user || (user.role !== "TEACHER" && user.role !== "ADMIN")) {
    return null;
  }

  const [courses, totalStudentsAgg, averageRating] = await Promise.all([
    db.course.findMany({
      where: { teacherId: userId, status: "PUBLISHED" },
      include: {
        category: { select: { name: true } },
        sections: { select: { lessons: { select: { id: true } } } },
        _count: { select: { enrollments: true, reviews: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.enrollment.count({ where: { course: { teacherId: userId } } }),
    db.review.aggregate({
      where: { course: { teacherId: userId } },
      _avg: { rating: true },
    }),
  ]);

  return {
    ...user,
    courses,
    totalStudents: totalStudentsAgg,
    averageRating: averageRating._avg.rating ?? 0,
  };
}

