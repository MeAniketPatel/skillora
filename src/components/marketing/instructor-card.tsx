import Link from "next/link";
import { BookMarked, GraduationCap, Mail, Star, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LinkButton from "@/components/ui/link-button";
import { ROUTES } from "@/shared/constants/routes";
import type { InstructorCardData } from "@/types/marketing.types";

export function InstructorCard({ instructor }: { instructor: InstructorCardData }) {
  const initials = (instructor.name || "I")
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Card className="group flex h-full flex-col border-border/60 transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <CardContent className="flex h-full flex-col gap-4 p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/10">
            <AvatarImage
              src={instructor.image || undefined}
              alt={instructor.name || "Instructor"}
            />
            <AvatarFallback className="bg-muted text-base font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-1 text-base font-extrabold">
              <Link
                href={ROUTES.INSTRUCTOR_DETAIL(instructor.id)}
                className="hover:text-primary"
              >
                {instructor.name || "Instructor"}
              </Link>
            </h3>
            <p className="line-clamp-1 text-xs font-semibold text-muted-foreground">
              {instructor.headline || "Expert Educator"}
            </p>
            {instructor.bio && (
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {instructor.bio}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-xl bg-muted/40 p-3 text-center text-xs">
          <Stat
            icon={<BookMarked className="h-3 w-3" />}
            label="Courses"
            value={instructor.publishedCourseCount}
          />
          <Stat
            icon={<Users className="h-3 w-3" />}
            label="Students"
            value={instructor.totalStudents}
          />
          <Stat
            icon={<Star className="h-3 w-3 fill-amber-400 text-amber-400" />}
            label="Rating"
            value={instructor.averageRating.toFixed(1)}
          />
        </div>

        <LinkButton
          href={ROUTES.INSTRUCTOR_DETAIL(instructor.id)}
          variant="outline"
          className="mt-auto w-full"
        >
          <GraduationCap className="mr-2 h-4 w-4" /> View Profile
        </LinkButton>
      </CardContent>
    </Card>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </span>
      <span className="text-sm font-extrabold">{value}</span>
    </div>
  );
}
