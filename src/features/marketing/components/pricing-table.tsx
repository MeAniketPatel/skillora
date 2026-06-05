"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { subscribeToPlanAction } from "@/features/subscriptions/actions/subscription.actions";
import { toast } from "sonner";
import { Check, Loader2, Star, Zap, Shield } from "lucide-react";

interface PricingTableProps {
  currentPlan?: string;
}

const PLANS = [
  {
    id: "FREE",
    name: "Free Learner",
    price: "$0",
    period: "forever",
    description: "Ideal for beginners starting out.",
    icon: Zap,
    color: "border-neutral-200/60 dark:border-neutral-800/60 bg-white dark:bg-neutral-900",
    features: [
      "Access to free lessons",
      "Spaced repetition flashcards limit (1 deck)",
      "Standard discussion Q&A access",
      "Platform-wide Public Leaderboards",
    ],
  },
  {
    id: "PRO",
    name: "Pro Master",
    price: "$19",
    period: "per month",
    description: "Best for dedicated scholars seeking deep mastery.",
    icon: Star,
    color: "border-indigo-250 bg-gradient-to-b from-indigo-500/5 to-transparent relative overflow-hidden bg-white dark:bg-neutral-900",
    badge: "Most Popular",
    features: [
      "Access to ALL premium courses",
      "Unlimited spaced repetition decks & cards",
      "Priority AI Study Tutor responses",
      "Curated Learning Paths timeline tracks",
      "Downloadable PDF Certificates of Completion",
      "Full platform forum writing privileges",
    ],
  },
  {
    id: "ENTERPRISE",
    name: "Enterprise Team",
    price: "$49",
    period: "per user/month",
    description: "Custom cohorts for teams and corporate setups.",
    icon: Shield,
    color: "border-neutral-200/60 dark:border-neutral-800/60 bg-white dark:bg-neutral-900",
    features: [
      "Everything in Pro Tier",
      "Collaborative Study Groups creator tools",
      "Teacher analytics panel for team leaders",
      "Custom payout triggers for co-authored courses",
      "SLA support and custom integrations",
    ],
  },
];

export function PricingTable({ currentPlan }: PricingTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [submittingPlan, setSubmittingPlan] = useState<string | null>(null);

  const handleSubscribe = (planId: string) => {
    setSubmittingPlan(planId);
    startTransition(async () => {
      try {
        const res = await subscribeToPlanAction(planId as any);
        if (!res.success) {
          toast.error(res.error || "Failed to subscribe.");
        } else {
          toast.success(`Successfully subscribed to ${planId} plan!`);
          router.refresh();
        }
      } catch (err: any) {
        toast.error(err.message || "An unexpected error occurred");
      } finally {
        setSubmittingPlan(null);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
      {PLANS.map((plan) => {
        const Icon = plan.icon;
        const isActive = currentPlan === plan.id;
        const isLoading = isPending && submittingPlan === plan.id;

        return (
          <Card
            key={plan.id}
            className={`border rounded-3xl p-6 flex flex-col justify-between shadow-sm transition-all hover:scale-[1.01] ${plan.color}`}
          >
            {plan.badge && (
              <span className="absolute top-4 right-4 bg-indigo-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                {plan.badge}
              </span>
            )}

            <div className="space-y-6">
              <CardHeader className="p-0 space-y-1">
                <div className="h-9 w-9 bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-350 rounded-lg flex items-center justify-center border border-neutral-100 dark:border-neutral-700 shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-md font-extrabold text-neutral-800 dark:text-neutral-50 pt-2">
                  {plan.name}
                </CardTitle>
                <p className="text-[10px] text-neutral-450 leading-relaxed">{plan.description}</p>
              </CardHeader>

              {/* Price */}
              <div className="flex items-baseline gap-1 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <span className="text-3xl font-extrabold text-neutral-800 dark:text-neutral-50">{plan.price}</span>
                <span className="text-[10px] text-neutral-450 font-medium">/ {plan.period}</span>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 pt-2 text-[10px] font-medium text-neutral-550 dark:text-neutral-400">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2 leading-snug">
                    <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6">
              <Button
                disabled={isActive || isPending}
                onClick={() => handleSubscribe(plan.id)}
                className={`w-full rounded-xl text-xs font-bold h-9 gap-1.5 ${
                  isActive
                    ? "bg-neutral-100 text-neutral-450 border border-neutral-200 cursor-default"
                    : plan.badge
                    ? "bg-indigo-650 hover:bg-indigo-750 text-white"
                    : "variant-outline"
                }`}
                variant={isActive ? "secondary" : plan.badge ? "default" : "outline"}
              >
                {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {isActive ? "Current Plan" : `Choose ${plan.name.split(" ")[0]}`}
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
