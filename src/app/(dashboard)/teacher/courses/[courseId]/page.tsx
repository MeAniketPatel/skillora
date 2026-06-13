import { requireTeacher } from "@/shared/lib/auth-helpers";
import { getCourseByIdForOwner } from "@/features/courses/server";
import { getAllCategories } from "@/features/categories/server";
import { notFound } from "next/navigation";
import { CourseEditor } from "@/features/courses";

export default async function TeacherCourseDashboard({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const user = await requireTeacher();
  const { courseId } = await params;

  const course = await getCourseByIdForOwner(courseId, user.id);
  
  if (!course) {
    notFound();
  }

  const categories = await getAllCategories();

  const formattedCourse = {
    id: course.id,
    title: course.title,
    description: course.description,
    thumbnail: course.thumbnail,
    promoVideo: course.promoVideo,
    price: course.price,
    categoryId: course.categoryId,
    level: course.level,
    status: course.status,
    sections: course.sections,
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <CourseEditor
        course={formattedCourse}
        categories={categories}
      />
    </div>
  );
}

