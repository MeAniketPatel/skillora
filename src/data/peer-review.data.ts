import db from "@/lib/prisma";

export async function getPeerReviewConfig(lessonId: string) {
  return db.peerReviewAssignment.findUnique({
    where: { lessonId },
  });
}

export async function upsertPeerReviewConfig(
  lessonId: string,
  requiredReviews: number,
  dueDate: Date
) {
  return db.peerReviewAssignment.upsert({
    where: { lessonId },
    update: {
      requiredReviews,
      dueDate,
    },
    create: {
      lessonId,
      requiredReviews,
      dueDate,
    },
  });
}

export async function deletePeerReviewConfig(lessonId: string) {
  return db.peerReviewAssignment.deleteMany({
    where: { lessonId },
  });
}
