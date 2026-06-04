import db from "@/lib/prisma";

export async function createAttachment(data: {
  name: string;
  url: string;
  size?: number;
  type?: string;
  lessonId: string;
}) {
  return db.attachment.create({
    data,
  });
}

export async function deleteAttachment(attachmentId: string, lessonId: string) {
  return db.attachment.delete({
    where: { id: attachmentId, lessonId },
  });
}
