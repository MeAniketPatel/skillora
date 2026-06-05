import { globalSearch } from "@/features/search";
import db from "@/shared/lib/prisma";
import { CourseFilters } from "@/components/course/course-filters";
import { formatPrice } from "@/shared/lib/utils";
import Link from "next/link";
import { Star, BookOpen, User, Calendar, Search, ArrowRight, MessageSquare, Award } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    level?: string;
    price?: string;
    rating?: string;
  }>;
}

export const metadata = {
  title: "Search Courses & Articles | Skillora",
  description: "Faceted search matching courses, lectures, teachers, and blogs on Skillora.",
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "", category, level, price, rating } = await searchParams;

  // Fetch categories for filter list
  const categories = await db.category.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  });

  // Format filter variables
  const filters = {
    categorySlug: category || null,
    level: level as any || null,
    priceType: price as any || null,
    minRating: rating ? parseFloat(rating) : null,
  };

  // Run search
  const { courses, teachers, blogPosts } = await globalSearch(q, filters);

  const totalResults = courses.length + teachers.length + blogPosts.length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 min-h-screen">
      {/* Header Search Info */}
      <div className="flex flex-col gap-2 border-b border-neutral-100 dark:border-neutral-850 pb-6">
        <div className="flex items-center gap-3 text-neutral-450 mb-1">
          <Search className="h-5 w-5 text-blue-500" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider">Search Command Center</span>
        </div>
        <h1 className="text-3xl font-extrabold text-neutral-850 dark:text-neutral-50 tracking-tight">
          {q ? `Search results for "${q}"` : "Explore Catalog"}
        </h1>
        <p className="text-xs text-neutral-500 font-medium">
          Found <span className="text-neutral-800 dark:text-neutral-250 font-bold">{totalResults}</span> matches matching your active filters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Facets */}
        <div className="lg:col-span-1">
          <CourseFilters categories={categories} />
        </div>

        {/* Results Container */}
        <div className="lg:col-span-3 space-y-10">
          {/* 1. Courses Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
              <h2 className="text-lg font-extrabold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-500" /> Courses ({courses.length})
              </h2>
            </div>

            {courses.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900/10">
                <p className="text-xs text-neutral-400 font-medium">No courses found matching these filter categories.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map((course: any) => (
                  <div
                    key={course.id}
                    className="group flex flex-col justify-between bg-white dark:bg-neutral-900 border border-neutral-250/50 dark:border-neutral-800/60 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div>
                      {/* Thumbnail */}
                      <div className="h-40 w-full relative overflow-hidden bg-neutral-105">
                        {course.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-blue-50/50 dark:bg-blue-950/20 text-blue-500 font-bold text-lg">
                            {course.title.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <Badge className="absolute top-3 right-3 bg-neutral-900/80 backdrop-blur-sm text-white border-0 text-[10px] font-bold py-0.5 px-2">
                          {course.level}
                        </Badge>
                      </div>

                      {/* Info body */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                            {course.category?.name || "Uncategorized"}
                          </span>
                          <div className="flex items-center gap-1 text-xs">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span className="font-bold text-neutral-800 dark:text-neutral-200">
                              {course.avgRating > 0 ? course.avgRating.toFixed(1) : "N/A"}
                            </span>
                            <span className="text-[10px] text-neutral-400">({course.totalReviews})</span>
                          </div>
                        </div>

                        <h3 className="text-sm font-extrabold text-neutral-850 dark:text-neutral-100 group-hover:text-blue-500 transition-colors line-clamp-1">
                          {course.title}
                        </h3>

                        <p className="text-xs text-neutral-450 line-clamp-2 leading-relaxed">
                          {course.shortDescription || course.description || "No description provided."}
                        </p>
                      </div>
                    </div>

                    {/* Footer price & instructor */}
                    <div className="p-5 pt-0 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800/60 pt-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={course.teacher.image || undefined} />
                          <AvatarFallback className="text-[8px] font-bold bg-neutral-100 dark:bg-neutral-800">
                            {course.teacher.name?.slice(0, 2).toUpperCase() || "TH"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300">
                          {course.teacher.name || "Instructor"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-extrabold text-neutral-850 dark:text-neutral-50">
                          {course.price && course.price > 0 ? formatPrice(course.price) : "Free"}
                        </span>
                        <Link
                          href={`/courses/${course.slug}`}
                          className="p-1.5 bg-neutral-50 dark:bg-neutral-800 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white text-neutral-500 dark:text-neutral-450 rounded-lg transition-all"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Grid for Teachers and Blogs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 2. Instructors Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
                <h2 className="text-base font-extrabold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                  <User className="h-4 w-4 text-purple-500" /> Instructors ({teachers.length})
                </h2>
              </div>

              {teachers.length === 0 ? (
                <div className="p-6 text-center rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/20">
                  <p className="text-xs text-neutral-400 font-medium">No instructors match this query.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {teachers.map((teacher: any) => (
                    <div
                      key={teacher.id}
                      className="p-4 bg-white dark:bg-neutral-900 border border-neutral-250/50 dark:border-neutral-800/60 rounded-xl flex items-center gap-4 shadow-sm hover:shadow transition-all"
                    >
                      <Avatar className="h-12 w-12 border border-neutral-150">
                        <AvatarImage src={teacher.image || undefined} />
                        <AvatarFallback className="font-bold bg-neutral-150">
                          {teacher.name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{teacher.name}</h4>
                        <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium truncate mb-1">
                          {teacher.headline || "Skillora Educator"}
                        </p>
                        <p className="text-[11px] text-neutral-450 line-clamp-1 leading-relaxed">
                          {teacher.bio || "No biography provided."}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Blogs Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
                <h2 className="text-base font-extrabold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-500" /> Blog Articles ({blogPosts.length})
                </h2>
              </div>

              {blogPosts.length === 0 ? (
                <div className="p-6 text-center rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/20">
                  <p className="text-xs text-neutral-400 font-medium">No articles match this query.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {blogPosts.map((post: any) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="block p-4 bg-white dark:bg-neutral-900 border border-neutral-250/50 dark:border-neutral-800/60 rounded-xl shadow-sm hover:shadow hover:border-blue-500/50 transition-all duration-300"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold text-neutral-400 uppercase font-mono">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                          <Badge variant="outline" className="text-[8px] font-bold py-0 px-1">
                            {post.author.role}
                          </Badge>
                        </div>
                        <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 line-clamp-1 hover:text-blue-500 transition-colors">
                          {post.title}
                        </h4>
                        <p className="text-[11px] text-neutral-450 line-clamp-2 leading-relaxed">
                          {post.excerpt || post.content}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
