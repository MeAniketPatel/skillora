import { notFound } from "next/navigation";
import Link from "next/link";
import { GraduationCap, BookOpen, Mail } from "lucide-react";
import { getUserProfile } from "@/data/user.data";
import { getTeacherPublishedCourses } from "@/data/course.data";
import { getTeacherAverageRating } from "@/data/review.data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LinkButton from "@/components/ui/link-button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

interface InstructorPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function InstructorProfilePage({
  params,
}: InstructorPageProps) {
  const { id } = await params;
  const teacher = await getUserProfile(id);

  if (!teacher || (teacher.role !== "TEACHER" && teacher.role !== "ADMIN")) {
    notFound();
  }

  const courses = await getTeacherPublishedCourses(id);
  const averageRating = await getTeacherAverageRating(id);
  const totalStudents = courses.reduce(
    (acc, c) => acc + c._count.enrollments,
    0,
  );

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Profile Card */}
          <div className="space-y-6">
            <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-xl overflow-hidden text-center p-8">
              <Avatar className="h-28 w-28 mx-auto border-4 border-primary/10">
                <AvatarImage src={teacher.image || ""} />
                <AvatarFallback className="bg-neutral-100 dark:bg-neutral-800 text-3xl">
                  {teacher.name?.[0] || "T"}
                </AvatarFallback>
              </Avatar>

              <h1 className="text-2xl font-bold mt-4">
                {teacher.name || "Instructor"}
              </h1>
              <p className="text-xs text-neutral-500 mt-1 font-semibold">
                {teacher.headline || "Expert Educator"}
              </p>

              <div className="flex items-center justify-center gap-1 mt-3 text-xs text-neutral-400">
                <Mail className="h-3.5 w-3.5" />
                <span>{teacher.email}</span>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-b border-neutral-100 dark:border-neutral-800/80 py-4 my-6">
                <div className="text-center">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Courses
                  </span>
                  <span className="text-sm font-extrabold mt-1 block">
                    {courses.length}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Students
                  </span>
                  <span className="text-sm font-extrabold mt-1 block">
                    {totalStudents}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Rating
                  </span>
                  <span className="text-sm font-extrabold mt-1 block text-yellow-500">
                    ★ {averageRating.toFixed(1)}
                  </span>
                </div>
              </div>

              {teacher.bio && (
                <div className="text-left text-xs text-neutral-600 dark:text-neutral-350 leading-relaxed whitespace-pre-wrap">
                  <h3 className="font-bold text-neutral-800 dark:text-neutral-100 mb-2">
                    About Me
                  </h3>
                  <p>{teacher.bio}</p>
                </div>
              )}
            </Card>
          </div>

          {/* Right: Courses Grid */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">
              Courses by {teacher.name || "Instructor"}
            </h2>

            {courses.length === 0 ? (
              <Card className="flex flex-col items-center justify-center p-16 text-center bg-white dark:bg-neutral-900/60 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl">
                <div className="h-16 w-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4 border border-neutral-200 dark:border-neutral-700">
                  <GraduationCap className="h-8 w-8 text-neutral-400" />
                </div>
                <CardTitle className="text-lg font-bold">
                  No published courses
                </CardTitle>
                <CardDescription className="max-w-sm mt-1 text-xs">
                  This instructor hasn't published any courses yet. Check back
                  later!
                </CardDescription>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                          <GraduationCap className="h-12 w-12 opacity-65 text-neutral-400" />
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
                            <BookOpen className="h-3 w-3" /> {totalLessons}{" "}
                            lessons
                          </span>
                        </div>
                        <CardTitle className="text-base font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          <Link href={`/courses/${course.slug}`}>
                            {course.title}
                          </Link>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-5 pt-0 border-t border-neutral-100 dark:border-neutral-800/50 flex justify-between items-center bg-white/30 dark:bg-neutral-900/30">
                        <span className="font-extrabold text-sm text-neutral-850 dark:text-neutral-200">
                          {course.price === 0 || !course.price
                            ? "Free"
                            : `$${course.price}`}
                        </span>
                        <LinkButton
                          size="sm"
                          href={`/courses/${course.slug}`}
                          className="rounded-xl px-4 text-xs h-8"
                        >
                          View Details
                        </LinkButton>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
