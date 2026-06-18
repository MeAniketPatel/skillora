"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Quote, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  salaryIncrease: string;
  story: string;
  image: string;
}

const STORIES: Testimonial[] = [
  {
    id: "story-1",
    name: "Alex Rivera",
    role: "Senior Frontend Engineer",
    company: "Vercel",
    salaryIncrease: "+52% Salary Increase",
    story: "The Next.js course on Skillora completely refactored how I write production code. I built my capstone project using the repository pattern taught in the module, and it literally became the main talking point in my interview.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    id: "story-2",
    name: "Emily Watson",
    role: "Lead Product Designer",
    company: "Stripe",
    salaryIncrease: "+40% Salary Increase",
    story: "Skillora's UI/UX design systems course was incredibly practical. Instead of standard high-level advice, we went deep into custom Figma variables, tokens, and engineering handoff guidelines. It immediately upgraded my work quality.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    id: "story-3",
    name: "Devon Chen",
    role: "AI Engineer",
    company: "Meta",
    salaryIncrease: "+65% Salary Increase",
    story: "The AI & ML curriculum on Skillora is unmatched. Working on custom LLM agents and prompt graphs rather than basic API calls helped me transition from a traditional data analyst role to an AI researcher position.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80"
  }
];

export function SuccessStories() {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % STORIES.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + STORIES.length) % STORIES.length);
  };

  const current = STORIES[activeIndex];

  return (
    <section id="success-stories" className="bg-zinc-50/50 dark:bg-zinc-900/10 py-24 border-b border-zinc-200/50 dark:border-zinc-800/50 scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-14 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Real Impact
            </span>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Alumni Success Stories
            </h2>
            <p className="max-w-2xl text-sm text-zinc-500 dark:text-zinc-400 font-normal">
              Read how Skillora graduates leveled up their credentials and landed roles at top-tier companies.
            </p>
          </div>

          {/* Carousel Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrev}
              className="h-10 w-10 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              aria-label="Previous story"
            >
              <ChevronLeft className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            </button>
            <button
              onClick={handleNext}
              className="h-10 w-10 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              aria-label="Next story"
            >
              <ChevronRight className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            </button>
          </div>
        </div>

        {/* Carousel Slider Card */}
        <div className="relative overflow-hidden rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950 shadow-xl p-8 md:p-12 transition-all duration-300">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -z-10 h-72 w-72 rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-3xl" />

          {/* Testimonial Content grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Avatar & Metric (Col span 4) */}
            <div className="md:col-span-4 flex flex-col items-center text-center space-y-4">
              <Avatar className="h-28 w-28 ring-4 ring-indigo-500/10 shrink-0">
                <AvatarImage src={current.image} alt={current.name} className="object-cover" />
                <AvatarFallback className="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 text-lg font-bold">
                  {current.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div>
                <h4 className="font-heading text-lg font-extrabold text-zinc-900 dark:text-white">{current.name}</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{current.role}</p>
                <div className="inline-block mt-2 text-[10px] font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/30 dark:border-zinc-800/30 px-3 py-1 rounded-md">
                  WORKS AT <span className="font-heading font-black text-indigo-600 dark:text-indigo-400 ml-1">{current.company.toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Testimonial Quote & salary indicator (Col span 8) */}
            <div className="md:col-span-8 space-y-6 text-left relative">
              
              {/* Giant quote mark */}
              <div className="absolute -top-6 -left-4 opacity-5 text-indigo-600 dark:text-indigo-400">
                <Quote className="h-16 w-16 fill-current" />
              </div>

              {/* Salary highlight badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/15 shadow-sm">
                <TrendingUp className="h-4 w-4" />
                <span>{current.salaryIncrease}</span>
              </div>

              <blockquote className="text-base md:text-lg font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans italic">
                &ldquo;{current.story}&rdquo;
              </blockquote>

              {/* Slider bullets */}
              <div className="flex gap-2">
                {STORIES.map((story, index) => (
                  <button
                    key={story.id}
                    onClick={() => setActiveIndex(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === activeIndex ? "w-8 bg-indigo-600" : "w-2 bg-zinc-200 dark:bg-zinc-800"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
