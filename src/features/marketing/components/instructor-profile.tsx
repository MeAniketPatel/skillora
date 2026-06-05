import Link from "next/link";
import { GraduationCap, BookOpen, Mail, Star, Users, BookMarked } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import LinkButton from "@/shared/components/ui/link-button";
import { ROUTES } from "@/shared/constants/routes";

interface InstructorProfileViewModel {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  bio: string | null;
  headline: string | null;
  totalStudents: number;
  averageRating: number;
  courses: {
    id: string;
    title: string;
    slug: string;
    thumbnail: string | null;
    level: string;
    price: number | null;
    category: { name: string } | null;
    sections: { lessons: { id: string }[] }[];
    _count: { enrollments: number; reviews: number };
  }[];
}

export function InstructorProfile({ teacher }: { teacher: InstructorProfileViewModel }) {
  const initials = (teacher.name || "I").slice(0, 1).toUpperCase();

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <aside className="space-y-6">
        <Card className="border-border/60 bg-card text-center">
          <CardContent className="space-y-5 p-8">
            <Avatar className="mx-auto h-28 w-28 border-4 border-primary/10">
              <AvatarImage src={teacher.image || undefined} alt={teacher.name || "Instructor"} />
              <AvatarFallback className="bg-muted text-2xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <h1 className="font-heading text-2xl font-extrabold">
                {teacher.name || "Instructor"}
              </h1>
              <p className="text-xs font-semibold text-muted-foreground">
                {teacher.headline || "Expert Educator"}
              </p>
            </div>

            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              <span className="truncate">{teacher.email}</span>
            </div>

            <div className="grid grid-cols-3 gap-4 border-y border-border/60 py-4">
              <Stat
                icon={<BookMarked className="h-3.5 w-3.5" />}
                label="Courses"
                value={teacher.courses.length}
              />
              <Stat
                icon={<Users className="h-3.5 w-3.5" />}
                label="Students"
                value={teacher.totalStudents}
              />
              <Stat
                icon={<Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                label="Rating"
                value={teacher.averageRating.toFixed(1)}
              />
            </div>

            {teacher.bio && (
              <div className="space-y-2 text-left">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  About
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {teacher.bio}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </aside>

      <section className="space-y-6 lg:col-span-2">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl font-extrabold tracking-tight">
            Courses by {teacher.name || "Instructor"}
          </h2>
          <span className="text-xs text-muted-foreground">
            {teacher.courses.length}{" "}
            {teacher.courses.length === 1 ? "course" : "courses"}
          </span>
        </div>

        {teacher.courses.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {teacher.courses.map((course) => {
              const totalLessons = course.sections.reduce(
                (acc, s) => acc + s.lessons.length,
                0,
              );
              return (
                <Card
                  key={course.id}
                  className="group flex flex-col overflow-hidden border-border/60 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    {course.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary/5 text-primary">
                        <GraduationCap className="h-10 w-10" />
                      </div>
                    )}
                    <span className="absolute right-3 top-3 rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow">
                      {course.level.replace("_", " ")}
                    </span>
                  </div>
                  <CardContent className="flex flex-1 flex-col justify-between gap-4 p-5">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="rounded-md bg-muted px-2 py-0.5 font-semibold">
                          {course.category?.name || "General"}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" /> {totalLessons} lessons
                        </span>
                      </div>
                      <h3 className="line-clamp-2 text-base font-bold leading-snug group-hover:text-primary">
                        <Link href={ROUTES.COURSE_DETAIL(course.slug)}>
                          {course.title}
                        </Link>
                      </h3>
                    </div>
                    <div className="flex items-center justify-between border-t border-border/60 pt-3">
                      <span className="text-sm font-extrabold">
                        {course.price && course.price > 0
                          ? `$${course.price}`
                          : "Free"}
                      </span>
                      <LinkButton
                        size="sm"
                        href={ROUTES.COURSE_DETAIL(course.slug)}
                        className="rounded-lg"
                      >
                        View Details
                      </LinkButton>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
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
    <div className="text-center">
      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </span>
      <span className="mt-1 block text-base font-extrabold">{value}</span>
    </div>
  );
}

function EmptyState() {
  return (
    <Card className="flex flex-col items-center justify-center border-dashed border-border/60 p-16 text-center">
      <div className="rounded-full bg-muted p-4 text-muted-foreground">
        <GraduationCap className="h-8 w-8" />
      </div>
      <h3 className="mt-4 text-base font-bold">No published courses yet</h3>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">
        This instructor hasn&apos;t published any courses. Check back soon —
        great things take time!
      </p>
    </Card>
  );
}
