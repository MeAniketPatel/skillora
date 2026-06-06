import { getCoursesByIds } from "@/features/courses/server";
import { CourseComparison } from "@/features/courses";
import { Badge } from "@/shared/components/ui/badge";
import { BarChart2 } from "lucide-react";

interface ComparePageProps {
  searchParams: Promise<{
    courses?: string;
  }>;
}

export const metadata = {
  title: "Compare Courses | Skillora",
  description: "Compare curriculum details, prices, and levels side-by-side.",
};

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const { courses: coursesParam } = await searchParams;
  const courseIds = coursesParam ? coursesParam.split(",") : [];
  
  const courses = courseIds.length > 0 ? await getCoursesByIds(courseIds) : [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-8">
      {/* Title */}
      <div className="space-y-2">
        <Badge variant="outline" className="bg-indigo-50/50 text-indigo-700 border-indigo-250 dark:bg-indigo-950/20 dark:text-indigo-400 text-[10px] font-bold">
          <BarChart2 className="h-3 w-3 mr-1" /> Decision Tools
        </Badge>
        <h1 className="text-2xl font-extrabold tracking-tight text-neutral-850 dark:text-neutral-50">
          Course Comparison
        </h1>
        <p className="text-xs text-neutral-500 max-w-2xl">
          Analyze price points, target student audiences, estimated durations, and difficulty levels side-by-side to choose the absolute best course for your learning path.
        </p>
      </div>

      <CourseComparison courses={courses as any} />
    </div>
  );
}

