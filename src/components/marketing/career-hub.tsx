import Link from "next/link";
import {
  Code2,
  LineChart,
  PenTool,
  Briefcase,
  Megaphone,
  Server,
  ArrowRight,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CAREER_PATHS } from "@/constants/marketing";
import { ROUTES } from "@/constants/routes";
import type { CareerPath } from "@/types/marketing.types";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2,
  LineChart,
  PenTool,
  Briefcase,
  Megaphone,
  Server,
};

export function CareerHub() {
  return (
    <section className="bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Career paths
          </span>
          <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
            Chart your next role
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Follow curated learning tracks that take you from foundational
            skills to job-ready expertise.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CAREER_PATHS.map((path) => (
            <CareerPathCard key={path.id} path={path} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CareerPathCard({ path }: { path: CareerPath }) {
  const Icon = ICON_MAP[path.icon] ?? Briefcase;

  return (
    <Card className="flex h-full flex-col border-border/60 bg-card transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <CardHeader className="space-y-4 p-6">
        <div className="flex items-start justify-between">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex flex-col items-end gap-1 text-right text-xs">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3 w-3" /> {path.growthRate}
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-muted-foreground">
              <DollarSign className="h-3 w-3" /> {path.averageSalary}
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <CardTitle className="text-lg font-extrabold">{path.title}</CardTitle>
          <CardDescription className="text-xs">{path.summary}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="mt-auto space-y-4 p-6 pt-0">
        <ol className="relative space-y-4 border-l border-border/60 pl-5">
          {path.steps.map((step, idx) => (
            <li key={step.id} className="relative">
              <span className="absolute -left-[27px] flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary bg-background text-[10px] font-bold text-primary">
                {idx + 1}
              </span>
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold">{step.title}</p>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {step.duration}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <Link
          href={ROUTES.LEARNING_PATHS}
          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
        >
          Start this path <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardContent>
    </Card>
  );
}
