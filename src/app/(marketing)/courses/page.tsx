import Link from "next/link";
import { GraduationCap, Search, Filter, BookOpen } from "lucide-react";
import db from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import LinkButton from "@/components/ui/link-button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <div className="flex flex-col min-h-screen bg-neutral-50/50 dark:bg-neutral-950/50">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-8">
          {/* Header */}
          <div className="relative">
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-neutral-50 dark:to-neutral-400 bg-clip-text text-transparent">
              Explore Courses
            </h1>
            <p className="text-neutral-500 mt-2 text-sm max-w-2xl">
              Discover professional courses taught by industry leaders. Expand your skillset and build project-driven expertise today.
            </p>
          </div>

          {/* Search and Filters */}
          <form
            method="GET"
            action="/courses"
            className="flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-neutral-900/40 p-4 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 backdrop-blur-md"
          >
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
              <Input
                name="title"
                defaultValue={title || ""}
                placeholder="Search courses..."
                className="pl-10 bg-white/70 dark:bg-neutral-950/70 border-neutral-200 dark:border-neutral-800 h-10 rounded-xl"
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              <LinkButton
                href="/courses"
                variant={!categoryId ? "default" : "outline"}
                size="sm"
                className="!px-4 rounded-xl h-9"
              >
                All
              </LinkButton>
              {categories.map((cat) => (
                <LinkButton
                  key={cat.id}
                  href={`/courses?categoryId=${cat.id}${title ? `&title=${title}` : ""}`}
                  variant={categoryId === cat.id ? "default" : "outline"}
                  size="sm"
                  className="!px-4 rounded-xl h-9 whitespace-nowrap"
                >
                  {cat.name}
                </LinkButton>
              ))}
            </div>
          </form>

          {/* Course Grid */}
          {courses.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-16 text-center bg-white dark:bg-neutral-900/60 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl">
              <div className="h-16 w-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4 border border-neutral-200 dark:border-neutral-700">
                <GraduationCap className="h-8 w-8 text-neutral-400" />
              </div>
              <CardTitle className="text-xl font-bold">
                No courses found
              </CardTitle>
              <CardDescription className="max-w-sm mt-2">
                Try adjusting your search queries or select a different category to explore.
              </CardDescription>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
                const totalLessons = course.sections.reduce(
                  (acc, s) => acc + s.lessons.length,
                  0,
                );

                return (
                  <Card
                    key={course.id}
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-neutral-900/60 border border-neutral-200/50 dark:border-neutral-800/50 flex flex-col justify-between rounded-2xl group"
                  >
                    <div className="aspect-video w-full bg-neutral-100 dark:bg-neutral-800/50 relative flex items-center justify-center overflow-hidden">
                      {course.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-neutral-400 gap-2">
                          <GraduationCap className="h-12 w-12 opacity-65" />
                        </div>
                      )}
                      <span className="absolute top-3 left-3 text-[10px] tracking-wider uppercase font-semibold px-2 py-0.5 bg-white/90 dark:bg-neutral-950/90 rounded-md shadow border border-neutral-200/50 dark:border-neutral-800/50">
                        {course.level.replace("_", " ")}
                      </span>
                    </div>
                    <CardHeader className="p-5 flex-1 space-y-2">
                      <div className="flex items-center justify-between text-xs text-neutral-500">
                        <span className="font-semibold px-2.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-md">
                          {course.category?.name || "Uncategorized"}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" /> {totalLessons} lessons
                        </span>
                      </div>
                      <CardTitle className="text-lg font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        <Link href={`/courses/${course.slug}`}>
                          {course.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="text-xs">
                        By <span className="font-medium text-foreground">{course.teacher.name || "Instructor"}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-5 pt-0 border-t border-neutral-100 dark:border-neutral-800/50 flex justify-between items-center bg-white/30 dark:bg-neutral-900/30">
                      <span className="font-extrabold text-lg bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-neutral-50 dark:to-neutral-300 bg-clip-text text-transparent">
                        {course.price === 0 || !course.price
                          ? "Free"
                          : `$${course.price}`}
                      </span>
                      <LinkButton size="sm" href={`/courses/${course.slug}`} className="rounded-xl px-4">
                        View Details
                      </LinkButton>
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
