import db from "@/shared/lib/prisma";

export async function createSection(courseId: string, title: string) {
  const lastSection = await db.section.findFirst({
    where: { courseId },
    orderBy: { position: "desc" },
  });

  const newPosition = lastSection ? lastSection.position + 1 : 1;

  return db.section.create({
    data: {
      title,
      courseId,
      position: newPosition,
    },
  });
}

export async function updateSection(sectionId: string, courseId: string, data: { title: string }) {
  return db.section.update({
    where: { id: sectionId, courseId },
    data,
  });
}

export async function deleteSection(sectionId: string, courseId: string) {
  return db.section.delete({
    where: { id: sectionId, courseId },
  });
}

export async function reorderSections(courseId: string, items: { id: string; position: number }[], tx?: any) {
  const client = tx || db;
  const updates = items.map((item) =>
    client.section.update({
      where: { id: item.id, courseId },
      data: { position: item.position },
    })
  );
  return Promise.all(updates);
}
