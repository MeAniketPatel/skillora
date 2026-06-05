import db from "@/shared/lib/prisma";

export async function getUserWishlist(userId: string) {
  return db.wishlist.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          teacher: { select: { name: true } },
          _count: { select: { reviews: true, enrollments: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function isWishlisted(userId: string, courseId: string) {
  const item = await db.wishlist.findUnique({
    where: {
      userId_courseId: { userId, courseId },
    },
  });
  return !!item;
}

export async function toggleWishlist(userId: string, courseId: string) {
  const existing = await isWishlisted(userId, courseId);
  
  if (existing) {
    await db.wishlist.delete({
      where: { userId_courseId: { userId, courseId } },
    });
    return { isWishlisted: false };
  } else {
    await db.wishlist.create({
      data: { userId, courseId },
    });
    return { isWishlisted: true };
  }
}
