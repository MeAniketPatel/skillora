import db from "@/lib/prisma";
import CreateCourseForm from "@/components/course/create-course-form";

export const metadata = {
  title: "Create Course - Skillora",
  description: "Create a new course on Skillora.",
};

export default async function NewCoursePage() {
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="py-6 flex items-center justify-center">
      <CreateCourseForm categories={categories} />
    </div>
  );
}
