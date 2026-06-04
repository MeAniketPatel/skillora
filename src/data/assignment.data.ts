import db from "@/lib/prisma";

export async function submitAssignment(userId: string, lessonId: string, content: string, attachmentUrl?: string) {
  return db.assignmentSubmission.upsert({
    where: {
      userId_lessonId: { userId, lessonId },
    },
    update: {
      content,
      attachmentUrl,
      status: "SUBMITTED",
      submittedAt: new Date(),
    },
    create: {
      userId,
      lessonId,
      content,
      attachmentUrl,
      status: "SUBMITTED",
    },
  });
}

export async function getSubmission(userId: string, lessonId: string) {
  return db.assignmentSubmission.findUnique({
    where: {
      userId_lessonId: { userId, lessonId },
    },
  });
}

export async function getSubmissionsForLesson(lessonId: string) {
  return db.assignmentSubmission.findMany({
    where: { lessonId },
    include: {
      user: { select: { name: true, email: true, image: true } },
    },
    orderBy: { submittedAt: "desc" },
  });
}

export async function gradeSubmission(submissionId: string, score: number, feedback?: string) {
  return db.assignmentSubmission.update({
    where: { id: submissionId },
    data: {
      score,
      feedback,
      status: "GRADED",
      gradedAt: new Date(),
    },
    include: {
      lesson: {
        include: {
          section: true,
        },
      },
    },
  });
}

export async function getTeacherPendingSubmissions(teacherId: string) {
  return db.assignmentSubmission.findMany({
    where: {
      lesson: {
        section: {
          course: {
            teacherId,
          },
        },
      },
      status: "SUBMITTED",
    },
    include: {
      user: { select: { name: true, email: true, image: true } },
      lesson: {
        select: {
          title: true,
          section: {
            select: {
              course: { select: { title: true, id: true } },
            },
          },
        },
      },
    },
    orderBy: { submittedAt: "desc" },
  });
}

export async function getAllTeacherSubmissions(lessonIds: string[]) {
  return db.assignmentSubmission.findMany({
    where: {
      lessonId: { in: lessonIds },
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      lesson: {
        select: {
          title: true,
          section: {
            select: {
              course: {
                select: {
                  title: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { submittedAt: "desc" },
  });
}

export async function getCourseSubmissions(courseId: string) {
  return db.assignmentSubmission.findMany({
    where: {
      lesson: {
        section: {
          courseId,
        },
      },
    },
    include: {
      user: { select: { name: true, email: true, image: true } },
      lesson: { select: { title: true, id: true } },
    },
    orderBy: { submittedAt: "desc" },
  });
}
