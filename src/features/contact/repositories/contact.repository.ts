import db from "@/shared/lib/prisma";

export async function createContactMessage(data: { name: string; email: string; subject: string; message: string }) {
  return db.contactMessage.create({ data });
}

export async function getContactMessages(params: { page?: number; limit?: number; isReplied?: boolean }) {
  const page = params.page || 1;
  const limit = params.limit || 20;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (params.isReplied !== undefined) where.isReplied = params.isReplied;

  const [messages, total] = await Promise.all([
    db.contactMessage.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    db.contactMessage.count({ where }),
  ]);

  return { messages, total, pages: Math.ceil(total / limit) };
}

export async function markContactMessageReplied(id: string, repliedBy: string) {
  return db.contactMessage.update({
    where: { id },
    data: {
      isReplied: true,
      repliedAt: new Date(),
      repliedBy,
    },
  });
}
