import db from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";

export async function getCourseById(id: string) {
  return db.course.findUnique({ where: { id } });
}

export async function getCourseBySlug(slug: string) {
  return db.course.findUnique({
    where: { slug },
    include: {
      teacher: true,
      category: true,
    },
  });
}

export async function getCourseByIdForOwner(courseId: string, teacherId: string) {
  const course = await db.course.findUnique({
    where: { id: courseId, teacherId },
    include: {
      sections: {
        include: { lessons: true }
      }
    }
  });
  if (!course) throw new NotFoundError("Course");
  return course;
}

export async function getCourseWithCurriculum(courseId: string) {
  return db.course.findUnique({
    where: { id: courseId },
    include: {
      sections: {
        orderBy: { position: "asc" },
        include: {
          lessons: {
            orderBy: { position: "asc" },
          },
        },
      },
    },
  });
}

export async function getCourseWithFullDetails(slug: string) {
  return db.course.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      teacher: true,
      category: true,
      sections: {
        orderBy: { position: "asc" },
        include: {
          lessons: {
            where: { isPublished: true },
            orderBy: { position: "asc" },
          },
        },
      },
      _count: {
        select: {
          enrollments: true,
          reviews: true,
        },
      },
    },
  });
}

export async function getPublishedCourses(params: { page?: number; limit?: number; categoryId?: string; level?: any; search?: string; sort?: string }) {
  const page = params.page || 1;
  const limit = params.limit || 12;
  const skip = (page - 1) * limit;

  const where: any = { status: "PUBLISHED" };
  if (params.categoryId) where.categoryId = params.categoryId;
  if (params.level) where.level = params.level;
  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
    ];
  }

  let orderBy: any = { createdAt: "desc" };
  if (params.sort === "popular") orderBy = { enrollments: { _count: "desc" } };
  if (params.sort === "price-low") orderBy = { price: "asc" };
  if (params.sort === "price-high") orderBy = { price: "desc" };

  const [courses, total] = await Promise.all([
    db.course.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        teacher: { select: { name: true, image: true } },
        category: { select: { name: true } },
        sections: { select: { lessons: { select: { id: true } } } },
        _count: { select: { enrollments: true, reviews: true } },
      },
    }),
    db.course.count({ where }),
  ]);

  return { courses, total, pages: Math.ceil(total / limit) };
}

export async function getTeacherCourses(teacherId: string, params: { page?: number; limit?: number; status?: any }) {
  const page = params.page || 1;
  const limit = params.limit || 12;
  const skip = (page - 1) * limit;

  const where: any = { teacherId };
  if (params.status) where.status = params.status;

  const [courses, total] = await Promise.all([
    db.course.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { enrollments: true } },
      },
    }),
    db.course.count({ where }),
  ]);

  return { courses, total, pages: Math.ceil(total / limit) };
}

export async function createCourse(data: any) {
  return db.course.create({ data });
}

export async function updateCourse(id: string, data: any) {
  return db.course.update({ where: { id }, data });
}

export async function deleteCourse(id: string) {
  return db.course.delete({ where: { id } });
}

export async function requireCourseOwnership(courseId: string, teacherId: string) {
  const course = await db.course.findUnique({
    where: { id: courseId, teacherId },
    select: { id: true },
  });
  if (!course) throw new NotFoundError("Course");
  return course;
}

export async function getCoursesForAdmin(params: { page?: number; limit?: number; status?: any; search?: string }) {
  const page = params.page || 1;
  const limit = params.limit || 12;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (params.status) where.status = params.status;
  if (params.search) {
    where.title = { contains: params.search, mode: "insensitive" };
  }

  const [courses, total] = await Promise.all([
    db.course.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        teacher: { select: { name: true, email: true } },
      },
    }),
    db.course.count({ where }),
  ]);

  return { courses, total, pages: Math.ceil(total / limit) };
}

export async function getCourseCount() {
  return db.course.count();
}

export async function getTeacherAnalyticsCourses(teacherId: string) {
  return db.course.findMany({
    where: { teacherId },
    include: {
      enrollments: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      sections: {
        include: {
          lessons: {
            where: { type: "ASSIGNMENT" },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCourseWithPublishedCurriculum(courseId: string) {
  return db.course.findUnique({
    where: { id: courseId },
    include: {
      sections: {
        orderBy: { position: "asc" },
        include: {
          lessons: {
            where: { isPublished: true },
            orderBy: { position: "asc" },
          },
        },
      },
    },
  });
}

export async function getCourseForPublishing(courseId: string, teacherId: string) {
  return db.course.findUnique({
    where: { id: courseId, teacherId },
    include: { sections: { include: { lessons: true } } },
  });
}

export async function getCourseCountByStatus() {
  const counts = await db.course.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
  });
  return counts.reduce((acc, curr) => {
    acc[curr.status] = curr._count.id;
    return acc;
  }, {} as Record<string, number>);
}

export async function getCourseCountByCategory() {
  const counts = await db.course.groupBy({
    by: ["categoryId"],
    _count: {
      id: true,
    },
  });

  const categories = await db.category.findMany({
    select: { id: true, name: true },
  });

  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  const result: Record<string, number> = {};
  counts.forEach((c) => {
    const name = c.categoryId ? categoryMap.get(c.categoryId) || "Uncategorized" : "Uncategorized";
    result[name] = (result[name] || 0) + c._count.id;
  });

  return result;
}

export async function getTeacherPublishedCourses(teacherId: string) {
  return db.course.findMany({
    where: { teacherId, status: "PUBLISHED" },
    include: {
      category: { select: { name: true } },
      sections: { select: { lessons: { select: { id: true } } } },
      _count: { select: { enrollments: true, reviews: true } },
    },
  });
}
