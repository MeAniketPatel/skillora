import db from "@/shared/lib/prisma";
import { APP } from "@/shared/constants/app";
import { SKILL_KEYWORDS } from "@/shared/constants/skill-keywords";
import type {
  SkillGapRecommendation,
  SkillNode,
} from "@/types/marketing.types";

export interface RecommendedCourse {
  id: string;
  slug: string;
  title: string;
  shortDescription: string | null;
  thumbnail: string | null;
  level: string;
  price: number | null;
  teacher: { name: string | null; image: string | null };
  category: { name: string } | null;
  averageRating: number;
  totalReviews: number;
  matchedSkills: string[];
}

export interface SkillGapResult {
  skill: SkillNode;
  courses: RecommendedCourse[];
}

function matchesSkill(course: { title: string; shortDescription: string | null; description: string | null }, keywords: string[]): boolean {
  const haystack = `${course.title} ${course.shortDescription ?? ""} ${course.description ?? ""}`.toLowerCase();
  return keywords.some((kw) => haystack.includes(kw.toLowerCase()));
}

export async function getCoursesForSkill(skill: SkillNode): Promise<RecommendedCourse[]> {
  const keywords = SKILL_KEYWORDS[skill.id] ?? [];

  if (keywords.length === 0) {
    return [];
  }

  const courses = await db.course.findMany({
    where: {
      status: "PUBLISHED",
      OR: keywords.map((kw) => ({
        OR: [
          { title: { contains: kw, mode: "insensitive" as const } },
          { shortDescription: { contains: kw, mode: "insensitive" as const } },
          { description: { contains: kw, mode: "insensitive" as const } },
        ],
      })),
    },
    include: {
      teacher: { select: { name: true, image: true } },
      category: { select: { name: true } },
      _count: { select: { reviews: true } },
    },
    take: 6,
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  if (courses.length === 0) return [];

  const courseIds = courses.map((c) => c.id);
  const ratings = await db.review.groupBy({
    by: ["courseId"],
    where: { courseId: { in: courseIds } },
    _avg: { rating: true },
  });

  const ratingMap = new Map(
    ratings.map((r) => [r.courseId, r._avg.rating ?? 0] as const),
  );

  return courses.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    shortDescription: c.shortDescription,
    thumbnail: c.thumbnail,
    level: c.level,
    price: c.price,
    teacher: c.teacher,
    category: c.category,
    averageRating: ratingMap.get(c.id) ?? 0,
    totalReviews: c._count.reviews,
    matchedSkills: keywords.slice(0, 3),
  }));
}

export async function getSkillGapRecommendations(
  skillIds: string[],
): Promise<SkillGapResult[]> {
  if (skillIds.length === 0) return [];

  const uniqueSkillIds = Array.from(new Set(skillIds)).slice(0, 4);

  const results = await Promise.all(
    uniqueSkillIds.map(async (id) => {
      const skill = await getSkillNodeById(id);
      if (!skill) return null;
      const courses = await getCoursesForSkill(skill);
      return { skill, courses };
    }),
  );

  return results.filter((r): r is SkillGapResult => r !== null);
}

export async function getSkillNodeById(id: string): Promise<SkillNode | null> {
  const { SKILL_CATALOG } = await import("@/shared/constants/marketing");
  return SKILL_CATALOG.find((s: { id: string }) => s.id === id) ?? null;
}

export async function getFeaturedSkillsCatalog(): Promise<SkillNode[]> {
  const { SKILL_CATALOG } = await import("@/shared/constants/marketing");
  return SKILL_CATALOG;
}

export interface FeaturedCourse {
  id: string;
  slug: string;
  title: string;
  shortDescription: string | null;
  thumbnail: string | null;
  level: string;
  price: number | null;
  teacher: { name: string | null; image: string | null };
  category: { name: string } | null;
  averageRating: number;
  totalReviews: number;
  totalStudents: number;
}

export async function getFeaturedCourses(limit: number = 6): Promise<FeaturedCourse[]> {
  const courses = await db.course.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take: limit,
    include: {
      teacher: { select: { name: true, image: true } },
      category: { select: { name: true } },
      _count: { select: { reviews: true, enrollments: true } },
    },
  });

  const ids = courses.map((c) => c.id);
  const ratings = ids.length
    ? await db.review.groupBy({
        by: ["courseId"],
        where: { courseId: { in: ids } },
        _avg: { rating: true },
      })
    : [];
  const ratingMap = new Map(
    ratings.map((r) => [r.courseId, r._avg.rating ?? 0] as const),
  );

  return courses.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    shortDescription: c.shortDescription,
    thumbnail: c.thumbnail,
    level: c.level,
    price: c.price,
    teacher: c.teacher,
    category: c.category,
    averageRating: ratingMap.get(c.id) ?? 0,
    totalReviews: c._count.reviews,
    totalStudents: c._count.enrollments,
  }));
}

export interface PlatformStatsResult {
  students: number;
  courses: number;
  instructors: number;
  certificates: number;
}

export async function getPlatformStats(): Promise<PlatformStatsResult> {
  const [students, courses, instructors, certificates] = await Promise.all([
    db.enrollment.count(),
    db.course.count({ where: { status: "PUBLISHED" } }),
    db.user.count({ where: { role: { in: ["TEACHER", "ADMIN"] } } }),
    db.certificate.count(),
  ]);

  return {
    students: students + APP.PLATFORM_BASE_STUDENTS,
    courses: courses + APP.PLATFORM_BASE_COURSES,
    instructors: instructors + APP.PLATFORM_BASE_INSTRUCTORS,
    certificates: certificates + APP.PLATFORM_BASE_CERTIFICATES,
  };
}

export async function getRecommendation(
  skill: SkillNode,
): Promise<SkillGapRecommendation | null> {
  const courses = await getCoursesForSkill(skill);
  if (courses.length === 0) return null;
  return { skill, courseIds: courses.map((c) => c.id) };
}
