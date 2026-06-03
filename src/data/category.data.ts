import db from "@/lib/prisma";

export async function getAllCategories() {
  return db.category.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getCategoriesWithCounts() {
  return db.category.findMany({
    include: {
      _count: {
        select: { courses: true },
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function getCategoryBySlug(slug: string) {
  return db.category.findUnique({
    where: { slug },
  });
}

export async function createCategory(data: { name: string; slug: string; icon?: string }) {
  return db.category.create({ data });
}

export async function updateCategory(id: string, data: any) {
  return db.category.update({
    where: { id },
    data,
  });
}

export async function deleteCategory(id: string) {
  return db.category.delete({
    where: { id },
  });
}
