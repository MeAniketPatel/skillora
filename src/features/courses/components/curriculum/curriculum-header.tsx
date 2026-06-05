import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LinkButton from "@/shared/components/ui/link-button";

export function CurriculumHeader({ courseId }: { courseId: string }) {
  return (
    <div className="flex items-center gap-x-2">
      <LinkButton
        variant="ghost"
        size="icon"
        href={`/teacher/courses/${courseId}`}
      >
        <ArrowLeft className="h-4 w-4" />
      </LinkButton>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Curriculum Builder</h1>
        <p className="text-sm text-neutral-500">
          Organize sections and lessons for your students.
        </p>
      </div>
    </div>
  );
}
