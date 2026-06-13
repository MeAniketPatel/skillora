import db from "@/shared/lib/prisma";

export async function getEnrollment(userId: string, courseId: string) {
  return db.enrollment.findUnique({
    where: {
      userId_courseId: { userId, courseId },
    },
  });
}

export async function createEnrollment(userId: string, courseId: string) {
  return db.enrollment.create({
    data: { userId, courseId },
  });
}

export async function getUserEnrollments(userId: string, params: { status?: "active" | "completed" }) {
  const where: any = { userId };
  if (params.status === "active") where.progress = { lt: 100 };
  if (params.status === "completed") where.progress = 100;

  return db.enrollment.findMany({
    where,
    include: {
      course: {
        include: {
          teacher: { select: { name: true } },
        },
      },
      certificate: {
        select: { certificateId: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getCourseEnrollments(courseId: string, params: { page?: number; limit?: number }) {
  const page = params.page || 1;
  const limit = params.limit || 12;
  const skip = (page - 1) * limit;

  const [enrollments, total] = await Promise.all([
    db.enrollment.findMany({
      where: { courseId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true, image: true } },
      },
    }),
    db.enrollment.count({ where: { courseId } }),
  ]);

  return { enrollments, total, pages: Math.ceil(total / limit) };
}

export async function getEnrollmentWithProgress(userId: string, courseId: string) {
  return db.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
    include: {
      lessonProgress: true,
    },
  });
}

export async function getEnrollmentWithUserAndCourse(enrollmentId: string) {
  return db.enrollment.findUnique({
    where: { id: enrollmentId },
    include: { user: true, course: true },
  });
}

export async function updateEnrollmentProgress(enrollmentId: string, progress: number, completedAt?: Date) {
  return db.enrollment.update({
    where: { id: enrollmentId },
    data: {
      progress,
      completedAt,
    },
  });
}

export async function getEnrollmentCount(courseId: string) {
  return db.enrollment.count({ where: { courseId } });
}

export async function getTotalEnrollmentCount() {
  return db.enrollment.count();
}

export async function getUserEnrollmentCount(userId: string) {
  return db.enrollment.count({
    where: { userId },
  });
}

export async function getResumeLessonId(userId: string, courseId: string) {
  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
    include: {
      lessonProgress: {
        where: { isCompleted: true },
        select: { lessonId: true },
      },
    },
  });

  if (!enrollment) return null;

  const lessons = await db.lesson.findMany({
    where: {
      section: { courseId },
      isPublished: true,
    },
    orderBy: [
      { section: { position: "asc" } },
      { position: "asc" },
    ],
    select: { id: true },
  });

  if (lessons.length === 0) return null;

  const completedLessonIds = new Set(enrollment.lessonProgress.map((p) => p.lessonId));
  const nextLesson = lessons.find((l) => !completedLessonIds.has(l.id));

  return nextLesson ? nextLesson.id : lessons[0].id;
}

export async function getTeacherRecentEnrollments(teacherId: string, limit: number = 5) {
  return db.enrollment.findMany({
    where: { course: { teacherId } },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
      course: {
        select: {
          title: true,
        },
      },
    },
  });
}

export async function getTeacherStudentCount(teacherId: string) {
  return db.enrollment.count({
    where: { course: { teacherId } },
  });
}

export async function getEnrolledStudentIds(courseId: string) {
  const enrollments = await db.enrollment.findMany({
    where: { courseId },
    select: { userId: true },
  });
  return enrollments.map((e) => e.userId);
}

export async function getEnrollmentTrends() {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  const enrollments = await db.enrollment.findMany({
    where: {
      createdAt: { gte: startDate },
    },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const timeline: Record<string, number> = {};
  enrollments.forEach((e) => {
    const key = e.createdAt.toISOString().split("T")[0];
    timeline[key] = (timeline[key] || 0) + 1;
  });

  return Object.entries(timeline).map(([date, count]) => ({ date, count }));
}


