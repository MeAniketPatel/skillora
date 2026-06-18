"use client";

import Link from "next/link";
import { Star, ArrowRight, Users, BookOpen, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import LinkButton from "@/shared/components/ui/link-button";
import { ROUTES } from "@/shared/constants/routes";

interface FeaturedCourse {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  shortDescription: string | null;
  level: string;
  price: number | null;
  averageRating?: number;
  totalReviews?: number;
  totalStudents?: number;
  category?: { name: string } | null;
  teacher?: { name: string | null; image: string | null } | null;
  sections?: { lessons: { id: string }[] }[];
  _count?: { enrollments: number; reviews: number };
}

interface FeaturedCoursesProps {
  courses: FeaturedCourse[];
}

const MOCK_COURSES: FeaturedCourse[] = [
  {
    id: "mock-1",
    title: "Next.js 16 Enterprise Architecture & Micro-Frontends",
    slug: "nextjs-enterprise-architecture",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&h=380&q=80",
    shortDescription: "Build production-ready Next.js apps with monorepos, advanced caching, secure authentication, and custom deployment pipelines.",
    level: "ADVANCED",
    price: 49,
    averageRating: 4.9,
    totalReviews: 248,
    totalStudents: 14820,
    category: { name: "Web Development" },
    teacher: { 
      name: "Marcus Aurelius", 
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80" 
    },
    sections: [{ lessons: Array(16).fill({ id: "1" }) }]
  },
  {
    id: "mock-2",
    title: "Creative UI/UX Design Systems for Modern SaaS",
    slug: "creative-ui-ux-design-systems",
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&h=380&q=80",
    shortDescription: "Learn to construct scalable Figma design tokens, custom components, responsive grids, and micro-interactions that wow users.",
    level: "INTERMEDIATE",
    price: 39,
    averageRating: 4.8,
    totalReviews: 194,
    totalStudents: 9400,
    category: { name: "UI/UX Design" },
    teacher: { 
      name: "Sarah Connor", 
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80" 
    },
    sections: [{ lessons: Array(12).fill({ id: "1" }) }]
  },
  {
    id: "mock-3",
    title: "AI Agent & Large Language Models in Production",
    slug: "ai-agents-llms-production",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&h=380&q=80",
    shortDescription: "Master LangChain, vector databases, prompt engineering, agentic workflows, and semantic search orchestration for enterprise tools.",
    level: "ADVANCED",
    price: 79,
    averageRating: 4.95,
    totalReviews: 312,
    totalStudents: 6800,
    category: { name: "AI & Machine Learning" },
    teacher: { 
      name: "Leo DaVinci", 
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80" 
    },
    sections: [{ lessons: Array(20).fill({ id: "1" }) }]
  }
];

export function FeaturedCourses({ courses = [] }: FeaturedCoursesProps) {
  // Use DB courses, fallback/merge to mock if DB is empty or has very few items
  const displayCourses = courses.length > 0 ? courses : MOCK_COURSES;

  return (
    <section className="bg-zinc-50/50 dark:bg-zinc-900/10 py-24 border-b border-zinc-200/50 dark:border-zinc-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-14 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Hand-picked catalog
            </span>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Featured Courses
            </h2>
            <p className="max-w-2xl text-sm text-zinc-500 dark:text-zinc-400 font-normal">
              Acquire cutting-edge credentials led by premium industry practitioners.
            </p>
          </div>
          <LinkButton
            href={ROUTES.COURSES}
            variant="outline"
            className="rounded-full border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 font-semibold px-6 transition-all shrink-0"
          >
            See All Courses <ArrowRight className="ml-2 h-4 w-4" />
          </LinkButton>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {displayCourses.slice(0, 6).map((course) => (
            <FeaturedCourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedCourseCard({ course }: { course: FeaturedCourse }) {
  const rating = course.averageRating ?? 4.8;
  const reviews = course.totalReviews ?? course._count?.reviews ?? 0;
  const students = course.totalStudents ?? course._count?.enrollments ?? 0;
  
  // Calculate lessons count
  let lessonCount = 0;
  if (course.sections) {
    lessonCount = course.sections.reduce((acc, sec) => acc + (sec.lessons?.length || 0), 0);
  }
  if (lessonCount === 0) lessonCount = 12; // fallback

  const levelText = course.level.replace("_", " ");

  const levelColor = 
    course.level === "ADVANCED" 
      ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20" 
      : course.level === "BEGINNER"
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
      : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";

  return (
    <Card className="flex flex-col overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-500/20 group">
      
      {/* Cover Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        {course.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.thumbnail}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400">
            <BookOpen className="h-10 w-10 stroke-[1.5]" />
          </div>
        )}
        
        {/* Floating level badge */}
        <span className={`absolute right-3 top-3 rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider shadow-xs backdrop-blur-sm ${levelColor}`}>
          {levelText}
        </span>
      </div>

      {/* Card Body */}
      <CardHeader className="space-y-3 p-6 pb-4">
        
        {/* Category & Ratings Row */}
        <div className="flex items-center justify-between text-xs">
          <span className="rounded-md bg-zinc-100 dark:bg-zinc-900 px-2.5 py-1 font-semibold text-zinc-600 dark:text-zinc-400 border border-zinc-200/30 dark:border-zinc-800/30">
            {course.category?.name || "General"}
          </span>
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-zinc-800 dark:text-zinc-200">
              {rating.toFixed(1)}
            </span>
            <span className="text-zinc-400 dark:text-zinc-500">({reviews})</span>
          </div>
        </div>

        {/* Title */}
        <CardTitle className="line-clamp-2 text-base font-extrabold leading-snug tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          <Link href={ROUTES.COURSE_DETAIL(course.slug)}>{course.title}</Link>
        </CardTitle>

        {/* Short Description */}
        <CardDescription className="line-clamp-2 text-xs leading-relaxed text-zinc-400 dark:text-zinc-500 font-normal">
          {course.shortDescription || "Unlock master-level outcomes in this guided, project-based learning experience."}
        </CardDescription>
      </CardHeader>

      {/* Instructor, Specs & Price */}
      <CardContent className="mt-auto p-6 pt-0 space-y-4">
        
        {/* Divider */}
        <hr className="border-zinc-100 dark:border-zinc-900" />

        {/* Info Rows */}
        <div className="flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={course.teacher?.image || ""} alt={course.teacher?.name || "Teacher"} />
              <AvatarFallback className="bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                {(course.teacher?.name || "IN").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium truncate max-w-[100px] text-zinc-600 dark:text-zinc-400">
              {course.teacher?.name || "Expert"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-zinc-400" />
              <span>{lessonCount} Lessons</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-zinc-400" />
              <span>{students.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Pricing Row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider font-bold text-zinc-400 dark:text-zinc-500">Price</span>
            <span className="text-xl font-black text-zinc-950 dark:text-white font-heading">
              {course.price && course.price > 0 ? `$${course.price}` : "Free"}
            </span>
          </div>
          <LinkButton
            size="sm"
            href={ROUTES.COURSE_DETAIL(course.slug)}
            className="rounded-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 px-5 text-xs font-bold border-none transition-all duration-300"
          >
            Enroll Now
          </LinkButton>
        </div>
      </CardContent>
    </Card>
  );
}
