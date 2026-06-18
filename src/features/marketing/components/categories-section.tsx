"use client";

import * as React from "react";
import Link from "next/link";
import { 
  Laptop, 
  Brain, 
  Palette, 
  Database, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight 
} from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  coursesCount: number;
  icon: React.ReactNode;
  gradient: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: "web-dev",
    name: "Web Development",
    slug: "web-development",
    description: "HTML/CSS, React, Next.js, Node.js, and Cloud Infrastructure.",
    coursesCount: 384,
    icon: <Laptop className="h-6 w-6" />,
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    id: "ai-ml",
    name: "AI & Machine Learning",
    slug: "ai-machine-learning",
    description: "Neural Networks, LLMs, NLP, PyTorch, and Vector Databases.",
    coursesCount: 242,
    icon: <Brain className="h-6 w-6" />,
    gradient: "from-violet-500 to-purple-500",
  },
  {
    id: "ui-ux",
    name: "UI/UX Design",
    slug: "ui-ux-design",
    description: "Figma tokens, Design Systems, Typography, and Prototyping.",
    coursesCount: 198,
    icon: <Palette className="h-6 w-6" />,
    gradient: "from-pink-500 to-rose-500",
  },
  {
    id: "data-sci",
    name: "Data Science",
    slug: "data-science",
    description: "Python, SQL, Pandas, Data Visualization, and Statistics.",
    coursesCount: 165,
    icon: <Database className="h-6 w-6" />,
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    id: "marketing",
    name: "Growth & Marketing",
    slug: "marketing",
    description: "SEO, Performance Marketing, Copywriting, and Analytics.",
    coursesCount: 128,
    icon: <TrendingUp className="h-6 w-6" />,
    gradient: "from-amber-500 to-orange-500",
  },
  {
    id: "cyber",
    name: "Cybersecurity",
    slug: "cybersecurity",
    description: "Network Security, Penetration Testing, IAM, and Cryptography.",
    coursesCount: 110,
    icon: <ShieldCheck className="h-6 w-6" />,
    gradient: "from-red-500 to-rose-500",
  },
];

interface CategoriesSectionProps {
  categories?: { id: string; name: string; slug: string }[];
}

export function CategoriesSection({ categories = [] }: CategoriesSectionProps) {
  // If we have DB categories, we can map courses counts to them
  // But for the best visual presentation, we use our rich items and cross-reference IDs if possible
  return (
    <section className="bg-white dark:bg-zinc-950 py-24 border-b border-zinc-200/50 dark:border-zinc-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Infinite Potential
          </span>
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Explore In-Demand Categories
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-normal">
            Target your skills and accelerate your learning trajectory with structured curricular paths.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => {
            // Find corresponding database category id if available
            const dbCat = categories.find(c => c.slug.toLowerCase() === cat.slug.toLowerCase());
            const targetUrl = dbCat ? `/courses?categoryId=${dbCat.id}` : `/courses?search=${cat.name}`;

            return (
              <Link
                key={cat.id}
                href={targetUrl}
                className="group relative rounded-2xl border border-zinc-200/40 dark:border-zinc-800/40 bg-zinc-50/30 dark:bg-zinc-900/10 p-6 flex flex-col justify-between h-56 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5"
              >
                {/* Custom Gradient Border Hover Accent */}
                <div className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-r ${cat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`} />
                <div className="absolute inset-[1px] rounded-2.5xl bg-white dark:bg-zinc-950 -z-10" />

                {/* Top: Icon & Metric */}
                <div className="flex items-center justify-between">
                  <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${cat.gradient} text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/5 group-hover:scale-110 transition-transform duration-300`}>
                    {cat.icon}
                  </div>
                  <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full border border-zinc-200/20 dark:border-zinc-800/20">
                    {cat.coursesCount} Courses
                  </span>
                </div>

                {/* Body: Title & Description */}
                <div className="space-y-1.5 mt-4">
                  <h3 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed font-normal line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                {/* Bottom: Arrow Link */}
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <span>Explore path</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
