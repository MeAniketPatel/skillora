import { getCourseBySlug } from "@/data";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Globe, Award, PlayCircle } from "lucide-react";
import { enrollInFreeCourse } from "@/actions";
import { ActionButton } from "@/components/shared/action-button";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-slate-900 text-slate-50 py-12 md:py-20">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {course.category && (
              <Badge variant="secondary" className="bg-slate-800 hover:bg-slate-700 text-slate-100 border-none">
                {course.category.name}
              </Badge>
            )}
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">{course.title}</h1>
            <p className="text-lg text-slate-300 max-w-xl">
              {course.shortDescription || "Master the concepts and build real-world projects with this comprehensive course."}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1"><Award className="w-4 h-4" /> {course.level || "ALL_LEVELS"}</span>
              <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> English</span>
              <span className="flex items-center gap-1">Created by <span className="text-white underline decoration-dotted underline-offset-4">{course.teacher.name}</span></span>
            </div>
            <div className="pt-4 flex items-center gap-4">
              <div className="text-3xl font-bold">
                {course.price === 0 || course.price === null ? "Free" : `$${course.price.toFixed(2)}`}
              </div>
              
              {course.price === 0 || course.price === null ? (
                <form action={async () => {
                  "use server";
                  await enrollInFreeCourse(course.id);
                }}>
                  <ActionButton action={async () => {}} size="lg" className="px-8 bg-blue-600 hover:bg-blue-700 text-white">
                    Enroll for Free
                  </ActionButton>
                </form>
              ) : (
                <Button size="lg" className="px-8 bg-blue-600 hover:bg-blue-700 text-white" asChild>
                  <a href={`/api/checkout?courseId=${course.id}`}>Buy Now</a>
                </Button>
              )}
            </div>
          </div>
          <div className="hidden md:block">
            {course.thumbnail ? (
              <img 
                src={course.thumbnail} 
                alt={course.title} 
                className="w-full rounded-xl shadow-2xl border border-slate-800"
              />
            ) : (
              <div className="w-full aspect-video bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700">
                <PlayCircle className="w-20 h-20 text-slate-600" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-6 py-12 grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-12">
          {/* About */}
          <section>
            <h2 className="text-2xl font-bold mb-4">About This Course</h2>
            <div className="prose max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: course.description || "<p>No description provided.</p>" }} />
          </section>

          {/* Curriculum */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Course Curriculum</h2>
            <div className="text-sm text-muted-foreground mb-4">
              {course.sections.length} sections • {totalLessons} lectures
            </div>
            <div className="border rounded-lg divide-y bg-card">
              {course.sections.map((section, idx) => (
                <div key={section.id} className="p-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <span className="text-muted-foreground text-sm font-normal">Section {idx + 1}:</span>
                    {section.title}
                  </h3>
                  <ul className="mt-3 space-y-2 pl-4 border-l-2 ml-2 border-muted">
                    {section.lessons.map(lesson => (
                      <li key={lesson.id} className="flex items-center gap-3 text-sm text-muted-foreground">
                        <PlayCircle className="w-4 h-4" />
                        {lesson.title}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="border rounded-xl p-6 shadow-sm sticky top-24 bg-card">
            <h3 className="font-bold text-lg mb-4">This course includes:</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 text-muted-foreground"><Clock className="w-4 h-4 text-primary" /> Full lifetime access</li>
              <li className="flex items-center gap-3 text-muted-foreground"><Award className="w-4 h-4 text-primary" /> Certificate of completion</li>
              <li className="flex items-center gap-3 text-muted-foreground"><CheckCircle2 className="w-4 h-4 text-primary" /> Access on mobile and TV</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
