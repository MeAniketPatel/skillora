import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import LinkButton from "@/shared/components/ui/link-button";
import { ROUTES } from "@/shared/constants/routes";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--color-primary)/15,_transparent_55%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,_var(--color-primary)/10,_transparent_60%)]" />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-32 lg:px-8">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/50 px-3 py-1 text-xs font-semibold text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>New: AI tutor + spaced-repetition flashcards</span>
          </div>

          <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Learn without limits.{" "}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Teach without boundaries.
            </span>
          </h1>

          <p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
            Skillora is a modern e-learning marketplace built for serious
            creators and curious minds. Build polished courses, run live
            cohorts, and track real outcomes — all from a single dashboard.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <LinkButton
              size="lg"
              href={ROUTES.COURSES}
              className="rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/30"
            >
              Browse Courses <ArrowRight className="ml-2 h-4 w-4" />
            </LinkButton>
            <LinkButton
              size="lg"
              variant="outline"
              href={`${ROUTES.REGISTER}?role=teacher`}
              className="rounded-full px-6"
            >
              Become an Instructor
            </LinkButton>
          </div>

          <dl className="grid grid-cols-3 gap-4 border-t border-border/60 pt-6 text-sm">
            <div>
              <dt className="text-muted-foreground text-xs uppercase tracking-wider">
                Curated catalog
              </dt>
              <dd className="mt-1 text-xl font-extrabold">1,200+</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs uppercase tracking-wider">
                Expert teachers
              </dt>
              <dd className="mt-1 text-xl font-extrabold">300+</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs uppercase tracking-wider">
                Avg. rating
              </dt>
              <dd className="mt-1 text-xl font-extrabold">4.8 / 5</dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-primary/30 to-blue-500/20 blur-3xl" />
          <div className="grid grid-cols-2 gap-4">
            <PreviewCard
              tone="primary"
              title="Live cohorts"
              description="Run real-time sessions with Meet links, attendance, and replays."
              label="ENGAGE"
            />
            <PreviewCard
              tone="muted"
              title="Curriculum builder"
              description="Drag-and-drop sections, lessons, and assignments."
              label="STRUCTURE"
            />
            <PreviewCard
              tone="muted"
              title="Quizzes & grading"
              description="Auto-graded quizzes and rich feedback on assignments."
              label="ASSESS"
            />
            <PreviewCard
              tone="primary"
              title="Certificates"
              description="Verifiable PDF certificates with LinkedIn sharing."
              label="CERTIFY"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

interface PreviewCardProps {
  title: string;
  description: string;
  label: string;
  tone: "primary" | "muted";
}

function PreviewCard({ title, description, label, tone }: PreviewCardProps) {
  const toneClasses =
    tone === "primary"
      ? "border-primary/30 bg-gradient-to-br from-primary/15 to-blue-500/5"
      : "border-border/60 bg-background/70";

  return (
    <div
      className={`rounded-2xl border p-5 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-lg ${toneClasses}`}
    >
      <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
        {label}
      </span>
      <h3 className="mt-2 text-base font-extrabold">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
