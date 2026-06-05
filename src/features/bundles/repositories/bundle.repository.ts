import db from "@/shared/lib/prisma";

export async function getCourseBundles() {
  return db.courseBundle.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      courses: {
        include: {
          course: {
            select: {
              id: true,
              title: true,
              shortDescription: true,
              price: true,
              thumbnail: true,
              slug: true,
            },
          },
        },
      },
    },
  });
}

export async function getCourseBundleDetail(bundleId: string) {
  return db.courseBundle.findUnique({
    where: { id: bundleId },
    include: {
      courses: {
        include: {
          course: {
            select: {
              id: true,
              title: true,
              shortDescription: true,
              price: true,
              thumbnail: true,
              slug: true,
            },
          },
        },
      },
    },
  });
}

export async function createCourseBundle(
  title: string,
  description: string,
  price: number,
  courseIds: string[]
) {
  return db.courseBundle.create({
    data: {
      title,
      description,
      price,
      courses: {
        create: courseIds.map((courseId) => ({
          courseId,
        })),
      },
    },
    include: {
      courses: true,
    },
  });
}
