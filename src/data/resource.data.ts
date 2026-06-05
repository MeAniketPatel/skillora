import db from "@/lib/prisma";

export async function createResource(
  courseId: string,
  name: string,
  url: string,
  fileSize?: number | null,
  fileType?: string | null
) {
  return db.resource.create({
    data: {
      courseId,
      name,
      url,
      fileSize,
      fileType,
    },
  });
}

export async function getCourseResources(courseId: string) {
  return db.resource.findMany({
    where: { courseId },
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteResource(id: string) {
  return db.resource.delete({
    where: { id },
  });
}
