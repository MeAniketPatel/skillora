import db from "@/shared/lib/prisma";

export async function getCertificateById(certificateId: string) {
  return db.certificate.findUnique({
    where: { certificateId },
    include: {
      enrollment: {
        include: {
          user: { select: { name: true, email: true } },
          course: { select: { title: true, teacher: { select: { name: true } } } },
        },
      },
    },
  });
}

export async function getUserCertificates(userId: string) {
  return db.certificate.findMany({
    where: {
      enrollment: { userId },
    },
    include: {
      enrollment: {
        include: {
          course: { select: { title: true, slug: true, thumbnail: true } },
        },
      },
    },
    orderBy: { issuedAt: "desc" },
  });
}

export async function createCertificate(enrollmentId: string) {
  const certificateId = Math.random().toString(36).substring(2, 12).toUpperCase();
  
  return db.certificate.create({
    data: {
      certificateId,
      enrollmentId,
    },
  });
}

export async function getCertificateByEnrollment(enrollmentId: string) {
  return db.certificate.findUnique({
    where: { enrollmentId },
  });
}

export async function getUserCertificatesCount(userId: string) {
  return db.certificate.count({
    where: {
      enrollment: { userId },
    },
  });
}
