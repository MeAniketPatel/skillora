import { getLearningPaths } from "@/features/learning-paths/server";
import { Card, CardContent } from "@/shared/components/ui/card";
import LinkButton from "@/shared/components/ui/link-button";
import { GraduationCap, ArrowRight, BookOpen, Users } from "lucide-react";

export const metadata = {
  title: "Learning Paths | Skillora",
  description: "Browse curated collections of courses to master specific learning paths.",
};

export default async function LearningPathsPage() {
  const paths = await getLearningPaths();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-850 dark:text-neutral-50">Curated Learning Paths</h1>
        <p className="text-xs text-neutral-500 mt-1">
          Structured curriculums put together by experts to guide you from basic concepts to advanced mastery.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paths.length === 0 ? (
          <Card className="col-span-full p-8 text-center border-neutral-200/50 dark:border-neutral-800/50">
            <GraduationCap className="h-10 w-10 text-neutral-400 mx-auto mb-3" />
            <h3 className="font-bold text-neutral-800 dark:text-neutral-200">No Learning Paths Available</h3>
            <p className="text-xs text-neutral-500 mt-1">Check back later for curated tracks.</p>
          </Card>
        ) : (
          paths.map((path) => (
            <Card
              key={path.id}
              className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">{path.title}</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                    {path.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold text-neutral-550 dark:text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-amber-500" />
                    {path._count.courses} Courses
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-blue-500" />
                    {path._count.enrollments} Enrolled Students
                  </span>
                </div>
              </CardContent>

              <div className="px-6 pb-6 pt-0">
                <LinkButton href={`/learning-paths/${path.id}`} className="w-full rounded-xl text-xs font-bold gap-1.5">
                  View Path Details
                  <ArrowRight className="h-3.5 w-3.5" />
                </LinkButton>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

