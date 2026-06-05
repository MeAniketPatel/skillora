import db from "@/shared/lib/prisma";

export async function getUserProfileCard(userId: string) {
  return db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      bio: true,
      headline: true,
      socialLinks: true,
      points: true,
      createdAt: true,
      _count: {
        select: {
          followers: true,
          following: true,
          portfolioProjects: true,
        },
      },
    },
  });
}

export async function getUserPortfolio(userId: string) {
  return db.portfolioProject.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createPortfolioProject(
  userId: string,
  data: {
    title: string;
    description: string;
    projectUrl?: string;
    imageUrl?: string;
  }
) {
  return db.portfolioProject.create({
    data: {
      ...data,
      userId,
    },
  });
}

export async function deletePortfolioProject(userId: string, projectId: string) {
  return db.portfolioProject.deleteMany({
    where: {
      id: projectId,
      userId,
    },
  });
}
