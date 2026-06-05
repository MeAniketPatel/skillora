import { getUserSubscription } from "@/data";
import { auth } from "@/auth";
import { PricingTable } from "@/components/marketing/pricing-table";
import { Badge } from "@/shared/components/ui/badge";
import { Sparkles } from "lucide-react";

export const metadata = {
  title: "Pricing Plans | Skillora",
  description: "Find the plan that matches your study goals on Skillora.",
};

export default async function PricingPage() {
  const session = await auth();
  
  let currentPlan = "FREE";
  if (session?.user) {
    const sub = await getUserSubscription(session.user.id!);
    if (sub) {
      currentPlan = sub.plan;
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-8">
      {/* Title */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <Badge variant="outline" className="bg-indigo-50/50 text-indigo-700 border-indigo-250 dark:bg-indigo-950/20 dark:text-indigo-400 text-[10px] font-bold">
          <Sparkles className="h-3 w-3 mr-1" /> Flexible Plans
        </Badge>
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-850 dark:text-neutral-50">
          Plans Built for Lifelong Learners
        </h1>
        <p className="text-xs text-neutral-500 leading-relaxed">
          Upgrade your learning path, unlock certification templates, and gain priority support with Pro or Enterprise tiers. Choose the plan that fits you best.
        </p>
      </div>

      <PricingTable currentPlan={currentPlan} />
    </div>
  );
}
