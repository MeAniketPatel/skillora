import type { Metadata } from "next";
import { Briefcase, TrendingUp, Sparkles } from "lucide-react";
import { CareerHub } from "@/features/marketing/server";
import { SkillGapAnalyzer } from "@/features/marketing/server";
import { Navbar } from "@/shared/components/layout/navbar";
import { Footer } from "@/shared/components/layout/footer";
import LinkButton from "@/shared/components/ui/link-button";
import { ROUTES } from "@/shared/constants/routes";

export const metadata: Metadata = {
  title: "Career Paths",
  description:
    "Explore curated learning tracks for the most in-demand careers in tech, design, and product.",
};

export default function CareersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="border-b border-border/60 bg-gradient-to-b from-primary/5 via-background to-background">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center space-y-5">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Career Hub
              </span>
              <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl">
                Follow a path. Land a role.
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed">
                Browse curated career paths built by industry practitioners.
                Each step shows the courses and skills you need — no guesswork,
                no filler.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <LinkButton href={ROUTES.COURSES} className="rounded-full">
                  Browse all courses
                </LinkButton>
                <LinkButton
                  href={ROUTES.INSTRUCTORS}
                  variant="outline"
                  className="rounded-full"
                >
                  Meet the instructors
                </LinkButton>
              </div>

              <div className="mx-auto grid max-w-xl grid-cols-3 gap-3 pt-6 text-center">
                <Highlight icon={<Briefcase className="h-4 w-4" />} label="Career tracks" value="10+" />
                <Highlight
                  icon={<TrendingUp className="h-4 w-4" />}
                  label="Avg. growth"
                  value="+24%"
                />
                <Highlight
                  icon={<Sparkles className="h-4 w-4" />}
                  label="Hiring partners"
                  value="50+"
                />
              </div>
            </div>
          </div>
        </section>

        <CareerHub />
        <SkillGapAnalyzer />
      </main>

      <Footer />
    </div>
  );
}

function Highlight({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-3">
      <div className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <p className="text-lg font-extrabold">{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

