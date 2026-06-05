import { getLearningPathDetail, isEnrolledInPath } from "@/features/learning-paths";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { PathTimeline } from "@/features/learning-paths";
import { Badge } from "@/shared/components/ui/badge";
import { Sparkles, Calendar, BookOpen } from "lucide-react";

interface PathDetailPageProps {
  params: Promise<{
    pathId: string;
  }>;
}

export async function generateMetadata({ params }: PathDetailPageProps) {
  const { pathId } = await params;
  const path = await getLearningPathDetail(pathId);
  return {
    title: `${path?.title || "Learning Path"} | Skillora`,
    description: path?.description,
  };
}

export default async function LearningPathDetailPage({ params }: PathDetailPageProps) {
  const { pathId } = await params;
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const path = await getLearningPathDetail(pathId);
  if (!path) {
    notFound();
  }

  const isEnrolled = await isEnrolledInPath(pathId, session.user.id!);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header card with gradient background */}
      <div className="bg-gradient-to-tr from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/40 dark:border-amber-900/30 p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute right-6 top-6 opacity-10">
          <Sparkles className="h-24 w-24 text-amber-500" />
        </div>

        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-amber-100/50 text-amber-700 border-amber-250 dark:bg-amber-950/20 dark:text-amber-400 text-[10px] font-bold">
              Curated Pathway
            </Badge>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-850 dark:text-neutral-50">
            {path.title}
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-350 leading-relaxed">
            {path.description}
          </p>

          <div className="flex items-center gap-4 text-xs font-semibold text-neutral-500 pt-2">
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {path.courses.length} Courses
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Created {new Date(path.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Timeline component */}
      <PathTimeline pathId={pathId} courses={path.courses} isEnrolled={isEnrolled} />
    </div>
  );
}
