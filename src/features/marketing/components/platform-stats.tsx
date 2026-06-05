"use client";

import { useEffect, useRef, useState } from "react";

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
}

interface PlatformStatsProps {
  stats?: PlatformStatItem[];
}

const DEFAULT_STATS: PlatformStatItem[] = [
  { id: "students", label: "Active Learners", value: 48230, suffix: "+" },
  { id: "courses", label: "Curated Courses", value: 1240, suffix: "+" },
  { id: "instructors", label: "Expert Instructors", value: 318, suffix: "" },
  { id: "certificates", label: "Certificates Issued", value: 9600, suffix: "+" },
];

export function PlatformStats({ stats = DEFAULT_STATS }: PlatformStatsProps) {
  return (
    <section className="border-y border-border/60 bg-muted/30">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        {stats.map((stat) => (
          <div key={stat.id} className="text-center md:text-left">
            <div className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
            </div>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
