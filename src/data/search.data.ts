import db from "@/lib/prisma";
import { CourseLevel } from "@prisma/client";

export interface SearchFilters {
  categorySlug?: string | null;
  level?: CourseLevel | null;
  priceType?: "FREE" | "PAID" | "ALL" | null;
  minRating?: number | null;
}

export async function globalSearch(query: string, filters: SearchFilters = {}) {
  const cleanQuery = query.trim();

  // 1. Course Search with filters
  const courseConditions: any = {
    status: "PUBLISHED",
  };

  if (cleanQuery) {
    courseConditions.OR = [
      { title: { contains: cleanQuery, mode: "insensitive" } },
      { description: { contains: cleanQuery, mode: "insensitive" } },
      { shortDescription: { contains: cleanQuery, mode: "insensitive" } },
    ];
  }

  if (filters.categorySlug) {
    courseConditions.category = {
      slug: filters.categorySlug,
    };
  }

  if (filters.level) {
    courseConditions.level = filters.level;
  }

  if (filters.priceType === "FREE") {
    courseConditions.OR = [
      { price: 0 },
      { price: null },
    ];
  } else if (filters.priceType === "PAID") {
    courseConditions.price = { gt: 0 };
  }

  let courses = await db.course.findMany({
    where: courseConditions,
    include: {
      category: true,
      teacher: {
        select: {
          name: true,
          image: true,
        },
      },
      reviews: {
        select: {
          rating: true,
        },
      },
    },
  });

  // Calculate average rating and filter if minRating is specified
  const coursesWithRating = courses.map((course) => {
    const totalReviews = course.reviews.length;
    const avgRating =
      totalReviews > 0
        ? course.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    return {
      ...course,
      avgRating,
      totalReviews,
    };
  });

  let filteredCourses = coursesWithRating;
  if (filters.minRating) {
    filteredCourses = coursesWithRating.filter(
      (course) => course.avgRating >= filters.minRating!
    );
  }

  // 2. Teacher search
  let teachers: any[] = [];
  if (cleanQuery) {
    teachers = await db.user.findMany({
      where: {
        role: "TEACHER",
        isBanned: false,
        OR: [
          { name: { contains: cleanQuery, mode: "insensitive" } },
          { headline: { contains: cleanQuery, mode: "insensitive" } },
          { bio: { contains: cleanQuery, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        image: true,
        headline: true,
        bio: true,
      },
      take: 5,
    });
  }

  // 3. Blog post search
  let blogPosts: any[] = [];
  if (cleanQuery) {
    blogPosts = await db.blogPost.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: cleanQuery, mode: "insensitive" } },
          { content: { contains: cleanQuery, mode: "insensitive" } },
          { excerpt: { contains: cleanQuery, mode: "insensitive" } },
        ],
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
            role: true,
          },
        },
      },
      take: 5,
    });
  }

  return {
    courses: filteredCourses,
    teachers,
    blogPosts,
  };
}
