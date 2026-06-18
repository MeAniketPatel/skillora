"use client";

import * as React from "react";
import { Plus, Minus } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "How does the 7-day free trial work?",
    answer: "You get unrestricted access to all 1,000+ courses, interactive coding playgrounds, and the Skillora AI tutor for 7 days. You can cancel at any time from your billing settings before the trial ends, and you will not be charged."
  },
  {
    id: "faq-2",
    question: "Can I showcase these certificates to employers?",
    answer: "Absolutely. Each Skillora certificate contains a unique cryptographic hash and a public verification link. Recruiters can audit the status, score, and final project repository. It is also compatible with one-click LinkedIn certification sharing."
  },
  {
    id: "faq-3",
    question: "What architecture and standards are taught in your courses?",
    answer: "We focus on production-grade patterns. For instance, in our Next.js tracks, we teach monorepo organization, ESLint boundary rules, the Page -> Action -> Service -> Repository layer pattern, server-side Zod validation contracts, and Prisma integration."
  },
  {
    id: "faq-4",
    question: "Is there 1-on-1 support for learners?",
    answer: "Yes. The Professional tier gives you priority access to cohort Discord channels and study groups. The Premium tier unlocks direct 1-on-1 calls with our expert instructors and comprehensive design audits of your code repositories."
  },
  {
    id: "faq-5",
    question: "Can I switch or cancel my plan at any time?",
    answer: "Yes, you can upgrade, downgrade, or cancel your subscription at any time via your account settings. If you upgrade, the billing is prorated instantly; if you cancel, you will retain access until the end of your billing cycle."
  }
];

export function FAQSection() {
  const [openId, setOpenId] = React.useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="bg-white dark:bg-zinc-950 py-24 border-b border-zinc-200/50 dark:border-zinc-800/50 scroll-mt-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Got Questions?
          </span>
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-normal">
            Everything you need to know about Skillora subscriptions, cohorts, and certification.
          </p>
        </div>

        {/* FAQ list */}
        <div className="space-y-4">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div 
                key={faq.id}
                className="rounded-2xl border border-zinc-200/40 dark:border-zinc-800/40 bg-zinc-50/20 dark:bg-zinc-900/10 overflow-hidden transition-all duration-300"
              >
                {/* Trigger Toggle Button */}
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left font-semibold text-sm text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer select-none"
                >
                  <span className="pr-4">{faq.question}</span>
                  <div className="h-7 w-7 rounded-full bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-850 flex items-center justify-center shrink-0">
                    {isOpen ? (
                      <Minus className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 transition-transform duration-300 rotate-90" />
                    ) : (
                      <Plus className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 transition-transform duration-300" />
                    )}
                  </div>
                </button>

                {/* Sliding Content Container */}
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 font-normal border-t border-zinc-100/50 dark:border-zinc-900/50 pt-3">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
