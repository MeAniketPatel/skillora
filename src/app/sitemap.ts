import { MetadataRoute } from "next";
import db from "@/shared/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Since we use prisma driver adapter, let's initialize or query safely
  let courseUrls: any[] = [];
  try {
    const courses = await db.course.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    });

    courseUrls = courses.map((course) => ({
      url: `${baseUrl}/courses/${course.slug}`,
      lastModified: course.updatedAt,
    }));
  } catch (e) {
    console.error("Sitemap generation database query failed", e);
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
    },
    ...courseUrls,
  ];
}
