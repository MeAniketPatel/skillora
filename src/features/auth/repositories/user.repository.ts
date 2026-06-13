import db from "@/shared/lib/prisma";
import { AuthAuditAction, AuthSessionRevocationReason } from "@prisma/client";
import { APP } from "@/shared/constants/app";
import type { Role } from "@/core/entities/role";

// Re-export Prisma enums for cross-feature consumers.
// Centralizing enum exports here keeps the rest of the codebase free of
// direct @prisma/client imports (architecture boundary rule).
export { AuthAuditAction, AuthSessionRevocationReason };

export interface IUserRepository {
  getUserById(id: string): Promise<UserSummary | null>;
  getUserByEmail(email: string): Promise<UserWithPassword | null>;
  createUser(data: CreateUserInput): Promise<UserWithPassword>;
  getUserProfile(id: string): Promise<UserProfile | null>;
  getAllUsers(params: GetAllUsersParams): Promise<PaginatedUsers>;
  getUserCount(): Promise<number>;
  getUserCountByRole(): Promise<Record<Role, number>>;
  updateUser(id: string, data: UpdateUserInput): Promise<UserWithPassword>;
  banUser(id: string, reason?: string): Promise<UserWithPassword>;
  unbanUser(id: string): Promise<UserWithPassword>;
  getUserGrowthTimeline(): Promise<{ date: string; count: number }[]>;
  getAllInstructors(params: GetAllInstructorsParams): Promise<PaginatedInstructors>;
  getInstructorProfile(userId: string): Promise<InstructorProfile | null>;
}

export interface UserSummary {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: Role;
  bio: string | null;
  headline: string | null;
  socialLinks: unknown;
  createdAt: Date;
  isBanned: boolean;
}

export interface UserWithPassword {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  password: string | null;
  role: Role;
  bio: string | null;
  headline: string | null;
  socialLinks: unknown;
  stripeCustomerId: string | null;
  stripeConnectId: string | null;
  createdAt: Date;
  updatedAt: Date;
  isBanned: boolean;
  bannedAt: Date | null;
  bannedReason: string | null;
}

export interface CreateUserInput {
  name?: string;
  email: string;
  password?: string;
  role?: Role;
}

export type UpdateUserInput = Partial<Omit<UserWithPassword, "id" | "createdAt" | "updatedAt">>;

export interface GetAllUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role;
}

export interface PaginatedUsers {
  users: UserWithPassword[];
  total: number;
  pages: number;
}

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: Role;
  bio: string | null;
  headline: string | null;
  socialLinks: unknown;
  createdAt: Date;
  isBanned: boolean;
  _count: { courses: number; enrollments: number };
}

export interface InstructorListItem {
  id: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  headline: string | null;
  publishedCourseCount: number;
  totalStudents: number;
  averageRating: number;
}

export interface GetAllInstructorsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedInstructors {
  instructors: InstructorListItem[];
  total: number;
  pages: number;
}

export interface InstructorProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  bio: string | null;
  headline: string | null;
  socialLinks: unknown;
  createdAt: Date;
  role: Role;
  courses: InstructorCourse[];
  totalStudents: number;
  averageRating: number;
}

interface InstructorCourse {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  thumbnail: string | null;
  price: number;
  level: string;
  status: string;
  createdAt: Date;
  category: { name: string } | null;
  sections: { lessons: { id: string }[] }[];
  _count: { enrollments: number; reviews: number };
}

export const userRepository: IUserRepository = {
  async getUserById(id) {
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
    }) as Promise<UserSummary | null>;
  },
  async getUserByEmail(email) {
    return db.user.findUnique({ where: { email } });
  },
  async createUser(data) {
    return db.user.create({ data });
  },
  async getUserProfile(id) {
    return db.user.findUnique({
      where: { id },
      include: {
        _count: { select: { courses: true, enrollments: true } },
      },
    }) as Promise<UserProfile | null>;
  },
  async getAllUsers(params) {
    const page = params.page || 1;
    const limit = params.limit || 12;
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};
    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { email: { contains: params.search, mode: "insensitive" } },
      ];
    }
    if (params.role) where.role = params.role;
    const [users, total] = await Promise.all([
      db.user.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
      db.user.count({ where }),
    ]);
    return { users: users as UserWithPassword[], total, pages: Math.ceil(total / limit) };
  },
  async getUserCount() {
    return db.user.count();
  },
  async getUserCountByRole() {
    const counts = await db.user.groupBy({ by: ["role"], _count: { id: true } });
    return counts.reduce(
      (acc, curr) => ({ ...acc, [curr.role]: curr._count.id }),
      {} as Record<Role, number>,
    );
  },
  async updateUser(id, data) {
    return db.user.update({
      where: { id },
      data: data as Parameters<typeof db.user.update>[0]["data"],
    });
  },
  async banUser(id, reason) {
    return db.user.update({
      where: { id },
      data: { isBanned: true, bannedAt: new Date(), bannedReason: reason },
    });
  },
  async unbanUser(id) {
    return db.user.update({
      where: { id },
      data: { isBanned: false, bannedAt: null, bannedReason: null },
    });
  },
  async getUserGrowthTimeline() {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const users = await db.user.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    });
    const timeline: Record<string, number> = {};
    users.forEach((u) => {
      const key = u.createdAt.toISOString().split("T")[0];
      timeline[key] = (timeline[key] || 0) + 1;
    });
    return Object.entries(timeline).map(([date, count]) => ({ date, count }));
  },
  async getAllInstructors(params) {
    const page = params.page || 1;
    const limit = params.limit || APP.PAGINATION_DEFAULT;
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {
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
          _count: { select: { courses: { where: { status: "PUBLISHED" } } } },
        },
      }),
      db.user.count({ where }),
    ]);
    const instructorIds = instructors.map((i) => i.id);
    const [enrollmentCounts, ratingGroups] = await Promise.all([
      instructorIds.length
        ? db.enrollment.groupBy({
            by: ["courseId"],
            where: { course: { teacherId: { in: instructorIds } } },
            _count: { id: true },
          })
        : Promise.resolve([]),
      instructorIds.length
        ? db.review.groupBy({
            by: ["courseId"],
            where: { course: { teacherId: { in: instructorIds } } },
            _avg: { rating: true },
            _count: { id: true },
          })
        : Promise.resolve([]),
    ]);
    const courseTeacherMap = instructorIds.length
      ? await db.course.findMany({
          where: { teacherId: { in: instructorIds } },
          select: { id: true, teacherId: true },
        })
      : [];
    const totalStudentsByInstructor: Record<string, number> = {};
    const ratingSumByInstructor: Record<string, { sum: number; count: number }> = {};
    courseTeacherMap.forEach((c) => {
      const enrollmentCount = enrollmentCounts.find((e) => e.courseId === c.id)?._count.id ?? 0;
      totalStudentsByInstructor[c.teacherId] =
        (totalStudentsByInstructor[c.teacherId] || 0) + enrollmentCount;

      const ratingEntry = ratingGroups.find((r) => r.courseId === c.id);
      if (ratingEntry && ratingEntry._avg.rating != null) {
        const bucket = ratingSumByInstructor[c.teacherId] ?? { sum: 0, count: 0 };
        bucket.sum += ratingEntry._avg.rating * ratingEntry._count.id;
        bucket.count += ratingEntry._count.id;
        ratingSumByInstructor[c.teacherId] = bucket;
      }
    });
    return {
      instructors: instructors.map((i) => {
        const rating = ratingSumByInstructor[i.id];
        const averageRating =
          rating && rating.count > 0 ? Math.round((rating.sum / rating.count) * 10) / 10 : 0;
        return {
          id: i.id,
          name: i.name,
          image: i.image,
          bio: i.bio,
          headline: i.headline,
          publishedCourseCount: i._count.courses,
          totalStudents: totalStudentsByInstructor[i.id] || 0,
          averageRating,
        };
      }),
      total,
      pages: Math.ceil(total / limit),
    };
  },
  async getInstructorProfile(userId) {
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
      courses: courses as unknown as InstructorCourse[],
      totalStudents: totalStudentsAgg,
      averageRating: averageRating._avg.rating ?? 0,
    };
  },
};

export async function getUserById(id: string) {
  return userRepository.getUserById(id);
}
export async function getUserByEmail(email: string) {
  return userRepository.getUserByEmail(email);
}
export async function createUser(data: CreateUserInput) {
  return userRepository.createUser(data);
}
export async function getUserProfile(id: string) {
  return userRepository.getUserProfile(id);
}
export async function getAllUsers(params: GetAllUsersParams) {
  return userRepository.getAllUsers(params);
}
export async function getUserCount() {
  return userRepository.getUserCount();
}
export async function getUserCountByRole() {
  return userRepository.getUserCountByRole();
}
export async function updateUser(id: string, data: UpdateUserInput) {
  return userRepository.updateUser(id, data);
}
export async function banUser(id: string, reason?: string) {
  return userRepository.banUser(id, reason);
}
export async function unbanUser(id: string) {
  return userRepository.unbanUser(id);
}
export async function getUserGrowthTimeline() {
  return userRepository.getUserGrowthTimeline();
}
export async function getAllInstructors(params: GetAllInstructorsParams) {
  return userRepository.getAllInstructors(params);
}
export async function getInstructorProfile(userId: string) {
  return userRepository.getInstructorProfile(userId);
}

export async function getUserPasswordHash(id: string) {
  return db.user.findUnique({
    where: { id },
    select: { password: true },
  });
}

export async function getVerificationToken(token: string) {
  return db.verificationToken.findFirst({
    where: { token },
  });
}

export async function markEmailVerified(email: string) {
  return db.user.update({
    where: { email },
    data: { emailVerified: new Date() },
  });
}

export async function deleteVerificationToken(identifier: string, token: string) {
  return db.verificationToken.delete({
    where: { identifier_token: { identifier, token } },
  });
}

export async function updateUserRoleById(id: string, role: Role) {
  return db.user.update({
    where: { id },
    data: { role },
  });
}
