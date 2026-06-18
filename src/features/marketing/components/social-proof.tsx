"use client";

import * as React from "react";
import { ShieldCheck, Award, Users } from "lucide-react";

export function SocialProof() {
  const companies = [
    { name: "Google", logo: "Google" },
    { name: "Meta", logo: "Meta" },
    { name: "Microsoft", logo: "Microsoft" },
    { name: "Amazon", logo: "Amazon" },
    { name: "Netflix", logo: "Netflix" },
    { name: "Stripe", logo: "Stripe" },
    { name: "Slack", logo: "Slack" },
    { name: "Zoom", logo: "Zoom" },
  ];

  return (
    <section className="bg-white dark:bg-zinc-950 py-16 border-b border-zinc-200/50 dark:border-zinc-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          Global Learning Standards
        </span>
        <h2 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
          Empowering teams at world-class organizations
        </h2>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
          Our alumni work at top technology companies, creative agencies, and global enterprises.
        </p>

        {/* Logo cloud */}
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8 items-center justify-center opacity-60">
          {companies.map((comp) => (
            <div 
              key={comp.name} 
              className="flex items-center justify-center h-12 px-4 rounded-xl border border-zinc-100 dark:border-zinc-900 hover:border-indigo-500/20 hover:opacity-100 hover:scale-105 transition-all duration-300 group cursor-default"
            >
              <span className="font-heading font-black text-lg text-zinc-600 dark:text-zinc-400 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {comp.logo}
              </span>
            </div>
          ))}
        </div>

        {/* Key trust indicators */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3 border-t border-zinc-100 dark:border-zinc-900 pt-10">
          <div className="flex flex-col items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Verifiable Credentials</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs">
              Every certificate carries a cryptographic signature and public verification page.
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center text-violet-600 dark:text-violet-400 shrink-0">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Expert-Led Curriculum</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs">
              Courses are designed and reviewed by industry practitioners with decades of experience.
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Community Learning</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs">
              Join active study channels, peer review sessions, and direct teacher discussions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
