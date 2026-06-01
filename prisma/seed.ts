import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

async function main() {
  const categories = [
    { name: "Development", slug: "development" },
    { name: "Business", slug: "business" },
    { name: "Finance & Accounting", slug: "finance-accounting" },
    { name: "IT & Software", slug: "it-software" },
    { name: "Office Productivity", slug: "office-productivity" },
    { name: "Personal Development", slug: "personal-development" },
    { name: "Design", slug: "design" },
    { name: "Marketing", slug: "marketing" },
    { name: "Lifestyle", slug: "lifestyle" },
    { name: "Photography & Video", slug: "photography-video" },
    { name: "Health & Fitness", slug: "health-fitness" },
    { name: "Music", slug: "music" },
  ];

  console.log("Seeding categories...");

  for (const category of categories) {
    await db.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log("Categories seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
