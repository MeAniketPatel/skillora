"use client";

import * as React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import LinkButton from "@/shared/components/ui/link-button";
import { ROUTES } from "@/shared/constants/routes";

export function FinalCTA() {
  return (
    <section className="bg-white dark:bg-zinc-950 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Banner Inner Shell */}
        <div className="relative rounded-[2rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-blue-600 px-8 py-16 md:py-20 text-center text-white overflow-hidden shadow-2xl shadow-indigo-500/10">
          
          {/* Decorative floating grids/bubbles */}
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,#000_60%,transparent_100%)]" />
          <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-pink-500/20 blur-3xl" />

          {/* Copy and CTAs */}
          <div className="relative max-w-3xl mx-auto space-y-6">
            
            {/* Sparkle badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold text-white/90 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 fill-current text-amber-300" />
              <span>UNLIMITED ACCESS TO LATEST CURRICULUMS</span>
            </div>

            {/* Headline */}
            <h2 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl leading-tight">
              Start Learning Today.<br />Build the Career You Want.
            </h2>

            {/* Value text */}
            <p className="max-w-xl mx-auto text-sm text-zinc-100/80 leading-relaxed font-normal">
              Join over 50,000+ ambitious developers, systems architects, and designers using Skillora to master verified credentials and unlock job opportunities.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <LinkButton
                size="lg"
                href={`${ROUTES.REGISTER}?plan=pro`}
                className="rounded-full bg-white text-indigo-600 hover:bg-zinc-50 font-bold px-8 shadow-lg shadow-black/5"
              >
                Start Free Trial
              </LinkButton>
              <LinkButton
                size="lg"
                variant="outline"
                href={ROUTES.COURSES}
                className="rounded-full border-white/30 hover:bg-white/10 text-white font-bold px-8"
              >
                Browse Courses <ArrowRight className="ml-2 h-4 w-4" />
              </LinkButton>
            </div>

            {/* Guarantee detail */}
            <p className="text-[10px] text-zinc-200/60 font-semibold tracking-wider uppercase pt-2">
              7-DAY FREE TRIAL &bull; NO SETUP FEES &bull; CANCEL ANY TIME
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}
