"use client";

import * as React from "react";
import { Star, Users, BookOpen, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Card, CardContent } from "@/shared/components/ui/card";
import LinkButton from "@/shared/components/ui/link-button";
import { ROUTES } from "@/shared/constants/routes";

interface InstructorData {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  bio: string;
  rating: number;
  students: number;
  coursesCount: number;
}

const INSTRUCTORS: InstructorData[] = [
  {
    id: "inst-1",
    name: "Marcus Aurelius",
    role: "Former Staff Engineer",
    company: "Google",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    bio: "Over 12 years building distributed systems and high-throughput web frontends. Passionate about teaching clean code patterns.",
    rating: 4.9,
    students: 24500,
    coursesCount: 4
  },
  {
    id: "inst-2",
    name: "Sarah Connor",
    role: "Principal Product Designer",
    company: "Figma",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    bio: "UX design system pioneer. Crafted foundational interaction patterns used daily by millions of developers.",
    rating: 4.85,
    students: 19800,
    coursesCount: 3
  },
  {
    id: "inst-3",
    name: "Leo DaVinci",
    role: "Research Scientist",
    company: "OpenAI",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    bio: "Focuses on prompt orchestration, vector databases, and multi-agent systems. Believes in democratizing AI logic.",
    rating: 4.95,
    students: 14200,
    coursesCount: 2
  }
];

export function InstructorShowcase() {
  return (
    <section className="bg-white dark:bg-zinc-950 py-24 border-b border-zinc-200/50 dark:border-zinc-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Elite Pedagogy
          </span>
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Learn From Elite Practitioners
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-normal">
            Our instructors are engineering leaders, design partners, and systems architects at top global firms.
          </p>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {INSTRUCTORS.map((inst) => (
            <Card 
              key={inst.id}
              className="border border-zinc-200/40 dark:border-zinc-800/40 bg-zinc-50/20 dark:bg-zinc-900/10 rounded-2xl overflow-hidden hover:border-indigo-500/20 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
            >
              <CardContent className="p-6 space-y-6 flex flex-col justify-between h-full">
                
                {/* Header: Avatar, Name, Company Badge */}
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 ring-2 ring-indigo-500/10 shrink-0">
                    <AvatarImage src={inst.avatar} alt={inst.name} className="object-cover" />
                    <AvatarFallback className="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-bold">
                      {inst.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 transition-colors">
                      {inst.name}
                    </h3>
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                      {inst.role}
                    </p>
                    <div className="inline-flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[9px] px-2 py-0.5 rounded-full font-bold">
                      <ShieldCheck className="h-3 w-3 text-indigo-600 shrink-0" />
                      <span>EX- {inst.company.toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                {/* Bio text */}
                <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed font-normal min-h-[48px]">
                  {inst.bio}
                </p>

                {/* Specs Divider */}
                <hr className="border-zinc-100 dark:border-zinc-900" />

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200/20 dark:border-zinc-850 p-3 text-center text-xs">
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      <BookOpen className="h-3 w-3 text-indigo-500" /> Courses
                    </span>
                    <span className="text-sm font-extrabold text-zinc-800 dark:text-zinc-200">{inst.coursesCount}</span>
                  </div>

                  <div className="flex flex-col items-center gap-0.5 border-x border-zinc-100 dark:border-zinc-900">
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      <Users className="h-3 w-3 text-violet-500" /> Learners
                    </span>
                    <span className="text-sm font-extrabold text-zinc-800 dark:text-zinc-200">
                      {inst.students >= 1000 ? `${(inst.students / 1000).toFixed(1)}K` : inst.students}
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-0.5">
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> Rating
                    </span>
                    <span className="text-sm font-extrabold text-zinc-800 dark:text-zinc-200">{inst.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* View profile button */}
                <LinkButton
                  href={ROUTES.INSTRUCTORS}
                  variant="outline"
                  className="w-full rounded-full border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 font-semibold"
                >
                  View All Instructors
                </LinkButton>

              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
