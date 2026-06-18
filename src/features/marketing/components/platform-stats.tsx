"use client";

import { useEffect, useRef, useState } from "react";
import { Users, GraduationCap, Trophy, Award } from "lucide-react";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
}

function AnimatedCounter({ target, suffix = "" }: AnimatedCounterProps) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) {
      setValue(target);
      return;
    }

    const duration = 1600;
    const start = performance.now();
    let frame: number;

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return (
    <span ref={ref}>
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

interface PlatformStatItem {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  description: string;
  icon: React.ReactNode;
}

const DEFAULT_STATS: PlatformStatItem[] = [
  { 
    id: "students", 
    label: "Active Students", 
    value: 50000, 
    suffix: "+",
    description: "Ambitious minds learning daily",
    icon: <Users className="h-5 w-5 text-indigo-500" />
  },
  { 
    id: "courses", 
    label: "Expert Courses", 
    value: 1000, 
    suffix: "+",
    description: "Quality hand-picked curriculum",
    icon: <GraduationCap className="h-5 w-5 text-violet-500" />
  },
  { 
    id: "instructors", 
    label: "Top Instructors", 
    value: 250, 
    suffix: "+",
    description: "Industry-leading practitioners",
    icon: <Trophy className="h-5 w-5 text-blue-500" />
  },
  { 
    id: "success", 
    label: "Success Rate", 
    value: 95, 
    suffix: "%",
    description: "Alumni salary & career growth",
    icon: <Award className="h-5 w-5 text-emerald-500" />
  },
];

export function PlatformStats() {
  return (
    <section className="relative border-y border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/20 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {DEFAULT_STATS.map((stat) => (
            <div 
              key={stat.id} 
              className="relative overflow-hidden rounded-2xl border border-zinc-200/40 dark:border-zinc-800/40 bg-white dark:bg-zinc-950 p-6 flex flex-col gap-3 shadow-xs hover:border-indigo-500/20 transition-all duration-300 group"
            >
              {/* Top Row with icon */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {stat.label}
                </span>
                <div className="h-9 w-9 rounded-lg bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-200/30 dark:border-zinc-800/30">
                  {stat.icon}
                </div>
              </div>

              {/* Main counter value */}
              <div className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white font-heading">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>

              {/* Description */}
              <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed font-normal">
                {stat.description}
              </p>

              {/* Decorative side hover accent */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
