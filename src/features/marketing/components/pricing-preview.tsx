"use client";

import * as React from "react";
import { Check } from "lucide-react";
import LinkButton from "@/shared/components/ui/link-button";
import { ROUTES } from "@/shared/constants/routes";

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  recommended: boolean;
  ctaText: string;
  ctaHref: string;
}

const PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Launch your tech learning journey with core catalog access.",
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      "Access to 10+ intro courses",
      "Public learner profile",
      "Standard PDF certificates",
      "Active community forum",
    ],
    recommended: false,
    ctaText: "Join for Free",
    ctaHref: ROUTES.REGISTER,
  },
  {
    id: "professional",
    name: "Professional",
    description: "Complete access to master-level curriculum and AI assistance.",
    monthlyPrice: 19,
    annualPrice: 15,
    features: [
      "Access to all 1,000+ courses",
      "AI Tutor & Code Reviewer",
      "Live Q&A cohort sessions",
      "Verifiable cryptographic certificates",
      "Priority Discord channel access",
      "Resume & portfolio reviews",
    ],
    recommended: true,
    ctaText: "Start 7-Day Free Trial",
    ctaHref: `${ROUTES.REGISTER}?plan=pro`,
  },
  {
    id: "premium",
    name: "Premium Team",
    description: "1-on-1 coaching, personalized tracks, and team support.",
    monthlyPrice: 49,
    annualPrice: 39,
    features: [
      "Everything in Professional",
      "Direct 1-on-1 expert mentor calls",
      "Custom enterprise learning paths",
      "API integrations for HR analytics",
      "Dedicated account manager",
      "Staging workspace audits",
    ],
    recommended: false,
    ctaText: "Get Enterprise Access",
    ctaHref: `${ROUTES.REGISTER}?plan=team`,
  },
];

export function PricingPreview() {
  const [billingFrequency, setBillingFrequency] = React.useState<"monthly" | "annual">("annual");

  return (
    <section id="pricing" className="bg-white dark:bg-zinc-950 py-24 border-b border-zinc-200/50 dark:border-zinc-800/50 scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Investment in Growth
          </span>
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-normal">
            Choose the subscription plan that aligns with your goals. No hidden contracts. Cancel at any time.
          </p>

          {/* Toggle Switch */}
          <div className="flex items-center justify-center pt-4">
            <div className="relative border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/40 p-1 rounded-full flex items-center">
              <button
                onClick={() => setBillingFrequency("monthly")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  billingFrequency === "monthly"
                    ? "bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white shadow-sm"
                    : "text-zinc-400 dark:text-zinc-500"
                }`}
              >
                Monthly billing
              </button>
              <button
                onClick={() => setBillingFrequency("annual")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  billingFrequency === "annual"
                    ? "bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white shadow-sm"
                    : "text-zinc-400 dark:text-zinc-500"
                }`}
              >
                Annual billing
                <span className="text-[9px] font-bold text-white bg-indigo-600 px-2 py-0.5 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 items-stretch">
          {PLANS.map((plan) => {
            const price = billingFrequency === "monthly" ? plan.monthlyPrice : plan.annualPrice;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 border ${
                  plan.recommended
                    ? "border-indigo-600 bg-white dark:bg-zinc-950 shadow-2xl shadow-indigo-500/5 md:-translate-y-4 z-10"
                    : "border-zinc-200/50 dark:border-zinc-850 bg-zinc-50/20 dark:bg-zinc-900/10"
                }`}
              >
                {/* Recommended Top Badge */}
                {plan.recommended && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 text-white font-bold text-[9px] uppercase tracking-widest px-4 py-1.5 shadow-sm">
                    RECOMMENDED PLAN
                  </span>
                )}

                {/* Body Content */}
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-lg font-extrabold text-zinc-900 dark:text-white">
                      {plan.name}
                    </h3>
                  </div>

                  <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed font-normal min-h-[36px]">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mt-6 flex items-baseline gap-1 text-zinc-900 dark:text-white">
                    <span className="text-4xl font-black font-heading tracking-tight">
                      ${price}
                    </span>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold">
                      / month
                    </span>
                  </div>

                  {billingFrequency === "annual" && plan.monthlyPrice > 0 && (
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block mt-1 font-medium">
                      Billed annually (${price * 12}/yr)
                    </span>
                  )}

                  {/* Features List */}
                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                        <Check className="h-4.5 w-4.5 text-indigo-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Action */}
                <div className="mt-8 pt-4">
                  <LinkButton
                    href={plan.ctaHref}
                    className={`w-full rounded-full font-bold text-xs py-2.5 transition-all duration-300 border-none ${
                      plan.recommended
                        ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20"
                        : "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
                    }`}
                  >
                    {plan.ctaText}
                  </LinkButton>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
