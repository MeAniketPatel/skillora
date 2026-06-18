"use client";

import * as React from "react";
import { 
  Sparkles, 
  Calendar, 
  Video, 
  Award, 
  CheckCircle, 
  Clock, 
  GraduationCap
} from "lucide-react";

export function LearningExperience() {
  return (
    <section className="bg-white dark:bg-zinc-950 py-24 border-b border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-32">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Engineered for Outcomes
          </span>
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            A Learning Experience Built Around You
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-normal">
            No stock templates or passive watching. Skillora delivers an active, AI-guided environment with industry experts.
          </p>
        </div>

        {/* Feature 1: AI Recommendations & Personalized Learning */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Text Left */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="h-10 w-10 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="font-heading text-2xl font-extrabold text-zinc-900 dark:text-white leading-tight">
              Personalized Learning & AI-Powered Recommendations
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
              Our AI engine tracks your progress, highlights code smells, parses quiz errors, and suggests specific lessons to fill key skill gaps.
            </p>
            <ul className="space-y-3">
              {[
                "Personalized learning trajectory matching your core goals",
                "Direct AI chat tutor code reviews inside the browser editor",
                "Automated smart feedback on coding exercises"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                  <CheckCircle className="h-4.5 w-4.5 text-violet-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Visual Right */}
          <div className="lg:col-span-7 relative">
            <div className="absolute -inset-4 rounded-3xl bg-violet-500/10 blur-2xl" />
            <div className="relative border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-2xl p-5 shadow-lg max-w-xl mx-auto">
              
              {/* Mini AI Box Header */}
              <div className="flex items-center gap-2 mb-4 border-b border-zinc-200/40 dark:border-zinc-800/40 pb-3">
                <div className="h-6 w-6 rounded-full bg-violet-500 flex items-center justify-center text-white shrink-0">
                  <Sparkles className="h-3.5 w-3.5 fill-current" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">Skillora AI Tutor</span>
                  <span className="text-[9px] text-emerald-500 font-semibold ml-2 inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Online
                  </span>
                </div>
              </div>

              {/* Chat flow simulation */}
              <div className="space-y-4 text-xs">
                <div className="flex gap-2.5 max-w-[85%]">
                  <div className="h-6 w-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0 font-bold text-[10px]">
                    U
                  </div>
                  <div className="bg-white dark:bg-zinc-950 border border-zinc-200/30 dark:border-zinc-800/30 rounded-xl p-3 text-zinc-700 dark:text-zinc-300 font-medium">
                    Why isn&apos;t my Next.js client component fetching state on client side navigation?
                  </div>
                </div>

                <div className="flex gap-2.5 max-w-[90%] ml-auto justify-end">
                  <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-3 text-zinc-800 dark:text-zinc-200 font-medium leading-relaxed">
                    Remember: Server components render on the server, but client navigation via `&lt;Link&gt;` doesn&apos;t trigger a full document reload. Make sure you use a `useEffect` hook or fetch the session data client-side using a NextAuth hook. Here&apos;s a quick example...
                  </div>
                  <div className="h-6 w-6 rounded-full bg-violet-500 flex items-center justify-center text-white shrink-0">
                    <Sparkles className="h-3 w-3 fill-current" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Feature 2: Live Cohorts & Interactive Classes */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Visual Left */}
          <div className="lg:col-span-7 lg:order-1 order-2 relative">
            <div className="absolute -inset-4 rounded-3xl bg-indigo-500/10 blur-2xl" />
            <div className="relative border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-2xl p-5 shadow-lg max-w-xl mx-auto space-y-4">
              
              {/* Calendar list */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200/40 dark:border-zinc-800/40">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Upcoming Live Cohorts</span>
                <span className="text-[9px] font-semibold text-indigo-600 dark:text-indigo-400">Week of June 14</span>
              </div>

              {/* Event card 1 */}
              <div className="bg-white dark:bg-zinc-950 border border-zinc-200/40 dark:border-zinc-800/40 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex flex-col items-center justify-center shrink-0 border border-indigo-500/15">
                    <span className="text-[9px] font-bold">SUN</span>
                    <span className="text-xs font-bold leading-none">14</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-100">Next.js Hydration & SSR Deep Dive</h4>
                    <p className="text-[9px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5 mt-0.5">
                      <Clock className="h-3 w-3" /> 5:00 PM EST &bull; Marcus Aurelius
                    </p>
                  </div>
                </div>
                <button className="h-7 px-3.5 rounded-full bg-indigo-600 text-white font-bold text-[10px] hover:bg-indigo-500 transition-colors flex items-center gap-1 shadow-sm">
                  <Video className="h-3 w-3" /> Join
                </button>
              </div>

              {/* Event card 2 */}
              <div className="bg-white/70 dark:bg-zinc-950/70 border border-zinc-200/30 dark:border-zinc-800/30 rounded-xl p-3 flex items-center justify-between opacity-80">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[9px] font-bold">MON</span>
                    <span className="text-xs font-bold leading-none">15</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-100">Building Responsive Design Systems</h4>
                    <p className="text-[9px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5 mt-0.5">
                      <Clock className="h-3 w-3" /> 3:00 PM EST &bull; Sarah Connor
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-zinc-400 font-semibold px-2 py-0.5 bg-zinc-100 dark:bg-zinc-900 rounded-full">
                  Scheduled
                </span>
              </div>

            </div>
          </div>

          {/* Text Right */}
          <div className="lg:col-span-5 lg:order-2 order-1 space-y-6 text-left">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Calendar className="h-5 w-5" />
            </div>
            <h3 className="font-heading text-2xl font-extrabold text-zinc-900 dark:text-white leading-tight">
              Interactive Live Cohorts & Expert Q&A
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
              Attend real-time masterclasses with instructors and peers. Brainstorm architecture bottlenecks, work on team challenges, and build a lasting network.
            </p>
            <ul className="space-y-3">
              {[
                "Live coding sessions with screen-sharing and interactive editors",
                "Peer reviews and virtual cohort classrooms",
                "Office hours with industry leaders to address your questions"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                  <CheckCircle className="h-4.5 w-4.5 text-indigo-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Feature 3: Certifications & Careers */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Text Left */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="font-heading text-2xl font-extrabold text-zinc-900 dark:text-white leading-tight">
              Cryptographically Secure Certifications
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
              Go beyond basic certificates. Every credentials issued by Skillora carries a public cryptographic record on Next.js, allowing hiring managers to verify your projects instantly.
            </p>
            <ul className="space-y-3">
              {[
                "Unique, publicly verifiable URL for recruiters",
                "Integrations with LinkedIn profile certifications",
                "Metadata storing verified course milestones and final score"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Visual Right */}
          <div className="lg:col-span-7 relative">
            <div className="absolute -inset-4 rounded-3xl bg-emerald-500/10 blur-2xl" />
            <div className="relative border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950 rounded-2xl p-6 shadow-xl max-w-md mx-auto text-center space-y-4">
              
              {/* Mini certificate mock */}
              <div className="border-[6px] border-double border-zinc-100 dark:border-zinc-900 p-5 rounded-lg space-y-3 relative">
                {/* Badge watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5">
                  <GraduationCap className="h-28 w-28 text-indigo-600" />
                </div>

                <div className="flex items-center justify-center gap-1.5 font-heading text-xs font-black text-indigo-600 tracking-wider">
                  <Award className="h-4 w-4" /> SKILLORA CERTIFICATION
                </div>
                <h4 className="text-sm font-black text-zinc-900 dark:text-white">Sarah Connor</h4>
                <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-normal">
                  has successfully mastered the intensive curricula and completed all course criteria for
                </p>
                <h5 className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200">
                  Creative UI/UX Design Systems for Modern SaaS
                </h5>
                <div className="flex items-center justify-between text-[8px] text-zinc-400 dark:text-zinc-500 pt-3 border-t border-zinc-100 dark:border-zinc-900">
                  <span>ID: SK-8392-C</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">STATUS: VERIFIED</span>
                  <span>June 2026</span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
