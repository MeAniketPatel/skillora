import { redirect } from "next/navigation";
import Link from "next/link";
import { GraduationCap, BookOpen, Layers, CheckCircle } from "lucide-react";

import { auth } from "@/auth";
import { getCourseWithFullDetails } from "@/features/courses/server";
import { getEnrollment } from "@/features/enrollment/server";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Navbar } from "@/shared/components/layout/navbar";
import { Footer } from "@/shared/components/layout/footer";
import { EnrollButton } from "@/features/courses";
interface CourseDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const session = await auth();
  const { slug } = await params;

  const course = await getCourseWithFullDetails(slug);

  if (!course || course.status !== "PUBLISHED") {
    redirect("/courses");
  }

  // Find first lesson id
  const firstSection = course.sections[0];
  const firstLesson = firstSection?.lessons[0];
  const firstLessonId = firstLesson?.id || null;

  // Check enrollment
  let isEnrolled = false;
  if (session?.user) {
    const enrollment = await getEnrollment(session.user.id, course.id);
    isEnrolled = !!enrollment;
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Metadata & Syllabus */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <span className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                {course.category?.name || "Uncategorized"}
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight mt-4">{course.title}</h1>
              <p className="text-neutral-500 mt-2 text-sm">
                Created by <span className="font-semibold">{course.teacher.name || "Instructor"}</span>
              </p>
            </div>

            {/* Description */}
            <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
              <CardHeader>
                <CardTitle className="text-xl">About this course</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none text-neutral-600 dark:text-neutral-300">
                <div dangerouslySetInnerHTML={{ __html: course.description || "No description provided." }} />
              </CardContent>
            </Card>

            {/* Curriculum structure */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Course Syllabus</h2>
              <div className="space-y-3">
                {course.sections.map((section) => (
                  <Card key={section.id} className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
                    <CardHeader className="p-4 flex flex-row items-center gap-x-2 space-y-0">
                      <Layers className="h-4 w-4 text-neutral-400" />
                      <span className="font-semibold text-sm">{section.title}</span>
                    </CardHeader>
                    {section.lessons.length > 0 && (
                      <CardContent className="p-4 pt-0 space-y-2 border-t border-neutral-100 dark:border-neutral-800/50">
                        {section.lessons.map((lesson) => (
                          <div key={lesson.id} className="flex items-center justify-between p-2 rounded bg-neutral-50/50 dark:bg-neutral-950/20 text-xs">
                            <div className="flex items-center gap-x-2 truncate">
                              <BookOpen className="h-3.5 w-3.5 text-neutral-400" />
                              <span className="truncate">{lesson.title}</span>
                            </div>
                            {lesson.isFree && (
                              <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 font-bold uppercase text-[9px]">
                                Free Preview
                              </span>
                            )}
                          </div>
                        ))}
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Enrollment Action card */}
          <div className="space-y-6">
            <Card className="sticky top-20 overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 shadow-xl">
              <div className="aspect-video w-full bg-neutral-100 dark:bg-neutral-800 relative flex items-center justify-center">
                {course.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <GraduationCap className="h-10 w-10 text-neutral-400" />
                )}
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-baseline gap-x-2">
                  <span className="text-3xl font-extrabold tracking-tight">
                    {course.price === 0 || !course.price ? "Free" : `$${course.price}`}
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/50">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-500">Difficulty</span>
                    <span className="font-semibold">{course.level}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-500">Language</span>
                    <span className="font-semibold">{course.language === "en" ? "English" : course.language}</span>
                  </div>
                </div>

                <EnrollButton 
                  courseId={course.id}
                  isLoggedIn={!!session?.user}
                  isEnrolled={isEnrolled}
                  firstLessonId={firstLessonId}
                  price={course.price}
                />
              </CardContent>
            </Card>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
