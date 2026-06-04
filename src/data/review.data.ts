import db from "@/lib/prisma";

export async function createReview(userId: string, courseId: string, rating: number, comment?: string) {
  return db.review.create({
    data: { userId, courseId, rating, comment },
  });
}

export async function updateReview(reviewId: string, userId: string, data: { rating?: number; comment?: string }) {
  return db.review.update({
    where: { id: reviewId, userId },
    data,
  });
}

export async function deleteReview(reviewId: string, userId: string) {
  return db.review.delete({
    where: { id: reviewId, userId },
  });
}

export async function getCourseReviews(courseId: string, params: { page?: number; limit?: number }) {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    db.review.findMany({
      where: { courseId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, image: true } },
      },
    }),
    db.review.count({ where: { courseId } }),
  ]);

  return { reviews, total, pages: Math.ceil(total / limit) };
}

export async function getUserReviewForCourse(userId: string, courseId: string) {
  return db.review.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
}

export async function getCourseRatingStats(courseId: string) {
  const reviews = await db.review.findMany({
    where: { courseId },
    select: { rating: true },
  });

  const count = reviews.length;
  const average = count > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / count : 0;
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  
  reviews.forEach(r => {
    if (r.rating >= 1 && r.rating <= 5) {
      distribution[r.rating as keyof typeof distribution]++;
    }
  });

  return { average, count, distribution };
}

export async function getTeacherReviews(teacherId: string, params: { page?: number; limit?: number }) {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const skip = (page - 1) * limit;

  const where = { course: { teacherId } };

  const [reviews, total] = await Promise.all([
    db.review.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, image: true } },
        course: { select: { title: true, id: true } },
      },
    }),
    db.review.count({ where }),
  ]);

  return { reviews, total, pages: Math.ceil(total / limit) };
}

export async function getTeacherAverageRating(teacherId: string) {
  const reviews = await db.review.findMany({
    where: { course: { teacherId } },
    select: { rating: true },
  });

  const count = reviews.length;
  const average = count > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / count : 5.0;
  return average;
}
