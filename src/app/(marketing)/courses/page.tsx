import Link from "next/link";
import { GraduationCap, Search, Filter } from "lucide-react";
import db from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

interface CoursesPageProps {
  searchParams: Promise<{
    title?: string;
    categoryId?: string;
  }>;
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const { title, categoryId } = await searchParams;

  // Fetch categories for the filter bar
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  // Query published courses
  const courses = await db.course.findMany({
    where: {
      status: "PUBLISHED",
      title: title ? { contains: title, mode: "insensitive" } : undefined,
      categoryId: categoryId || undefined,
    },
    include: {
      category: true,
      teacher: true,
      sections: {
        include: {
          lessons: {
            where: { isPublished: true },
          },
        },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
  });

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Explore Courses</h1>
            <p className="text-neutral-500 mt-2">Discover professional courses taught by industry leaders.</p>
          </div>

          {/* Search and Filters */}
          <form method="GET" action="/courses" className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
              <Input
                name="title"
                defaultValue={title || ""}
                placeholder="Search courses..."
                className="pl-10 bg-white dark:bg-neutral-900"
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <Link href="/courses">
                <Button variant={!categoryId ? "default" : "outline"} size="sm" type="button">
                  All
                </Button>
              </Link>
              {categories.map((cat) => (
                <Link key={cat.id} href={`/courses?categoryId=${cat.id}${title ? `&title=${title}` : ""}`}>
                  <Button variant={categoryId === cat.id ? "default" : "outline"} size="sm" type="button">
                    {cat.name}
                  </Button>
                </Link>
              ))}
            </div>
          </form>

          {/* Course Grid */}
          {courses.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-neutral-900">
              <GraduationCap className="h-12 w-12 text-neutral-400 mb-4" />
              <CardTitle className="text-xl font-bold">No courses found</CardTitle>
              <CardDescription className="max-w-sm mt-2">
                Try adjusting your search queries or select a different category to explore.
              </CardDescription>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
                const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0);

                return (
                  <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 flex flex-col justify-between">
                    <div className="aspect-video w-full bg-neutral-100 dark:bg-neutral-800 relative flex items-center justify-center">
                      {course.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                      ) : (
                        <GraduationCap className="h-10 w-10 text-neutral-400" />
                      )}
                    </div>
                    <CardHeader className="p-4 flex-1">
                      <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                        <span className="font-semibold px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">
                          {course.category?.name || "Uncategorized"}
                        </span>
                        <span>{totalLessons} lessons</span>
                      </div>
                      <CardTitle className="text-lg line-clamp-2 hover:underline">
                        <Link href={`/courses/${course.slug}`}>
                          {course.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="text-xs mt-2">
                        By {course.teacher.name || "Instructor"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 border-t border-neutral-100 dark:border-neutral-800/50 flex justify-between items-center bg-white dark:bg-neutral-900">
                      <span className="font-bold text-base">
                        {course.price === 0 || !course.price ? "Free" : `$${course.price}`}
                      </span>
                      <Button size="sm" nativeButton={false} render={<Link href={`/courses/${course.slug}`} />}>
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
