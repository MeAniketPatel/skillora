"use client";

import * as React from "react";
import { 
  ArrowRight, 
  Sparkles, 
  Play, 
  BookOpen, 
  Clock, 
  Award, 
  BarChart2, 
  CheckCircle2, 
  Star 
} from "lucide-react";
import LinkButton from "@/shared/components/ui/link-button";
import { ROUTES } from "@/shared/constants/routes";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-zinc-950 pt-8 pb-16 md:pt-16 md:pb-24">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px] transition-all" />
      <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-[100px] transition-all" />
      
      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Left: Copy & Actions */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/50 dark:border-indigo-850 bg-indigo-50/50 dark:bg-indigo-950/30 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Next-Gen Learning Experience</span>
            </div>

            <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-zinc-900 dark:text-white leading-[1.1]">
              Master In-Demand Skills That{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 bg-clip-text text-transparent">
                Transform Careers.
              </span>
            </h1>

            <p className="max-w-xl text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
              Skillora is the premium learning platform designed for ambitious professionals. Learn from top-tier experts, track your progress with analytics, and earn verified credentials.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <LinkButton
                size="lg"
                href={ROUTES.COURSES}
                className="rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 px-8 py-3 border-none transition-all duration-300"
              >
                Browse Courses <ArrowRight className="ml-2 h-4 w-4" />
              </LinkButton>
              <LinkButton
                size="lg"
                variant="outline"
                href={`${ROUTES.REGISTER}?role=teacher`}
                className="rounded-full border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 font-semibold px-8 py-3 transition-colors"
              >
                Become an Instructor
              </LinkButton>
            </div>

            {/* Micro stats & ratings */}
            <div className="flex items-center gap-6 pt-4 border-t border-zinc-100 dark:border-zinc-900">
              <div className="flex -space-x-2.5">
                {[1, 2, 3, 4].map((i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-zinc-950 object-cover"
                    src={`https://images.unsplash.com/photo-${
                      i === 1 ? "1534528741775-53994a69daeb" :
                      i === 2 ? "1507003211169-0a1dd7228f2d" :
                      i === 3 ? "1494790108377-be9c29b29330" :
                      "1500648767791-00dcc994a43e"
                    }?auto=format&fit=crop&w=80&h=80&q=80`}
                    alt="Learner"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1 text-sm font-bold text-zinc-900 dark:text-white">4.9 / 5</span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Loved by <span className="font-semibold text-indigo-600 dark:text-indigo-400">50,000+</span> learners worldwide
                </p>
              </div>
            </div>

            {/* Trusted by logos */}
            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Trusted by engineering & design teams at
              </p>
              <div className="flex flex-wrap gap-x-8 gap-y-4 mt-3 opacity-60 grayscale dark:invert">
                <span className="font-heading font-extrabold text-zinc-700 tracking-tight text-base">Google</span>
                <span className="font-heading font-extrabold text-zinc-700 tracking-tight text-base">stripe</span>
                <span className="font-heading font-extrabold text-zinc-700 tracking-tight text-base">linear</span>
                <span className="font-heading font-extrabold text-zinc-700 tracking-tight text-base">Vercel</span>
                <span className="font-heading font-extrabold text-zinc-700 tracking-tight text-base">Framer</span>
              </div>
            </div>
          </div>

          {/* Right: Dashboard Mockup */}
          <div className="lg:col-span-6 relative mt-10 lg:mt-0">
            {/* Ambient glows behind the dashboard mockup */}
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-indigo-500/20 to-blue-500/20 blur-2xl opacity-60 dark:opacity-40" />

            {/* Main Mockup Frame */}
            <div className="relative rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl shadow-2xl p-4 transition-all duration-500 hover:border-indigo-500/30">
              
              {/* Header bar */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200/50 dark:border-zinc-800/50 mb-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="h-5 px-3 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px] font-medium text-zinc-400 dark:text-zinc-500 flex items-center">
                  dashboard.skillora.com
                </div>
                <div className="w-6" />
              </div>

              {/* Mockup Grid layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                
                {/* Left Mini Sidebar Mockup (Col span 3) */}
                <div className="hidden md:flex md:col-span-3 flex-col gap-4 border-r border-zinc-200/40 dark:border-zinc-800/40 pr-3">
                  <div className="flex items-center gap-2 px-1">
                    <div className="h-6 w-6 rounded bg-indigo-600 flex items-center justify-center text-white font-extrabold text-xs">
                      S
                    </div>
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Academy</span>
                  </div>
                  <nav className="flex flex-col gap-1.5">
                    <div className="h-7 px-2.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold flex items-center gap-2">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>My Courses</span>
                    </div>
                    <div className="h-7 px-2.5 rounded-lg text-zinc-500 dark:text-zinc-400 text-xs font-medium flex items-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <BarChart2 className="h-3.5 w-3.5" />
                      <span>Analytics</span>
                    </div>
                    <div className="h-7 px-2.5 rounded-lg text-zinc-500 dark:text-zinc-400 text-xs font-medium flex items-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <Award className="h-3.5 w-3.5" />
                      <span>Certificates</span>
                    </div>
                  </nav>
                </div>

                {/* Main Content Area (Col span 9) */}
                <div className="md:col-span-9 space-y-4">
                  {/* Greeting & Analytics Summary */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Welcome back, Sarah!</h4>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500">You are in the top 5% of learners this week</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                      <Clock className="h-3 w-3" />
                      <span>12h Learn Time</span>
                    </div>
                  </div>

                  {/* Analytics Chart Mockup */}
                  <div className="border border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-950/50 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Learning Activity</span>
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">+24% vs last week</span>
                    </div>
                    {/* Simulated SVG Graph */}
                    <div className="h-20 w-full flex items-end justify-between pt-2 gap-1.5">
                      {[30, 45, 35, 60, 50, 75, 90].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div 
                            className="w-full bg-gradient-to-t from-indigo-500 to-blue-500 rounded-t-sm transition-all duration-500 hover:from-indigo-600 hover:to-blue-600 cursor-pointer"
                            style={{ height: `${h}%` }}
                          />
                          <span className="text-[8px] font-semibold text-zinc-400 dark:text-zinc-500">
                            {["M", "T", "W", "T", "F", "S", "S"][i]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active Course Card */}
                  <div className="border border-zinc-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-950/80 rounded-xl p-3 flex items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">ACTIVE ENROLLMENT</span>
                      <h5 className="text-xs font-bold text-zinc-800 dark:text-zinc-100 truncate">Next.js 16 Enterprise Architecture</h5>
                      
                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[9px] text-zinc-400 dark:text-zinc-500">
                          <span>7 of 11 Lessons</span>
                          <span className="font-bold text-zinc-700 dark:text-zinc-300">68%</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-600 rounded-full" style={{ width: "68%" }} />
                        </div>
                      </div>
                    </div>

                    <button className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-sm shrink-0">
                      <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
                    </button>
                  </div>

                </div>
              </div>
            </div>

            {/* Floating UI Badges */}
            <div className="absolute -top-6 -right-6 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl p-3 shadow-lg flex items-center gap-3 animate-[bounce_5s_infinite_ease-in-out]">
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <Award className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-900 dark:text-white">Badge Earned</p>
                <p className="text-[8px] text-zinc-400 dark:text-zinc-500">AI Architect Master</p>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl p-3 shadow-lg flex items-center gap-3 animate-[bounce_6s_infinite_ease-in-out]">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-900 dark:text-white">Exam Passed</p>
                <p className="text-[8px] text-zinc-400 dark:text-zinc-500">Score: 98% (Verified)</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
