import Link from "next/link";
import { GraduationCap, BookOpen, Star, ArrowRight, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LinkButton from "@/components/ui/link-button";
import { ROUTES } from "@/shared/constants/routes";
import type { FeaturedCourse } from "@/data/skill-gap.data";

interface FeaturedCoursesProps {
  courses: FeaturedCourse[];
}

export function FeaturedCourses({ courses }: FeaturedCoursesProps) {
  if (courses.length === 0) return null;

  return (
    <section className="bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Hand-picked for you
            </span>
            <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
              Featured courses
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Standout classes from our top-rated instructors — refreshed
              every week.
            </p>
          </div>
          <LinkButton
            href={ROUTES.COURSES}
            variant="outline"
            className="rounded-full"
          >
            See all courses <ArrowRight className="ml-2 h-4 w-4" />
          </LinkButton>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <FeaturedCourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedCourseCard({ course }: { course: FeaturedCourse }) {
  return (
    <Card className="flex flex-col overflow-hidden border-border/60 bg-card transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {course.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.thumbnail}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/5 text-primary">
            <GraduationCap className="h-10 w-10" />
          </div>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-foreground shadow">
          {course.level.replace("_", " ")}
        </span>
      </div>
      <CardHeader className="space-y-2 p-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="rounded-md bg-muted px-2 py-0.5 font-semibold">
            {course.category?.name || "General"}
          </span>
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-foreground">
              {course.averageRating > 0
                ? course.averageRating.toFixed(1)
                : "New"}
            </span>
            <span className="text-muted-foreground">({course.totalReviews})</span>
          </div>
        </div>
        <CardTitle className="line-clamp-2 text-base font-bold leading-snug">
          <Link href={ROUTES.COURSE_DETAIL(course.slug)}>{course.title}</Link>
        </CardTitle>
        <CardDescription className="line-clamp-2 text-xs">
          {course.shortDescription || "A hands-on learning experience."}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto flex items-center justify-between border-t border-border/60 p-5 pt-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          <span className="font-semibold">
            {course.totalStudents.toLocaleString()} students
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base font-extrabold text-foreground">
            {course.price && course.price > 0 ? `$${course.price}` : "Free"}
          </span>
          <LinkButton
            size="sm"
            href={ROUTES.COURSE_DETAIL(course.slug)}
            className="rounded-lg"
          >
            View
          </LinkButton>
        </div>
      </CardContent>
    </Card>
  );
}
