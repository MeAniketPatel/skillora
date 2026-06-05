"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Search, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import { SKILL_CATALOG } from "@/shared/constants/marketing";
import { recommendSkillGapAction } from "@/actions/skill-gap.actions";
import { ROUTES } from "@/shared/constants/routes";

interface SkillGapAnalyzerProps {
  initialSkillIds?: string[];
}

const MAX_SELECTED = 4;

export function SkillGapAnalyzer({ initialSkillIds = [] }: SkillGapAnalyzerProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSkillIds));
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const filteredSkills = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return SKILL_CATALOG;
    return SKILL_CATALOG.filter(
      (s) =>
        s.label.toLowerCase().includes(normalized) ||
        s.description.toLowerCase().includes(normalized),
    );
  }, [query]);

  const toggleSkill = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < MAX_SELECTED) {
        next.add(id);
      } else {
        toast.error(`Pick up to ${MAX_SELECTED} skills at a time.`);
      }
      return next;
    });
  };

  const handleAnalyze = () => {
    if (selected.size === 0) {
      toast.error("Pick at least one skill to analyze.");
      return;
    }
    startTransition(async () => {
      const res = await recommendSkillGapAction(Array.from(selected));
      if (!res.success) {
        toast.error(res.error || "Could not analyze your skill gap.");
        return;
      }
      const params = new URLSearchParams();
      Array.from(selected).forEach((s) => params.append("skill", s));
      router.push(`${ROUTES.SEARCH}?${params.toString()}`);
    });
  };

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Skill Gap Analyzer
            </span>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
              What should you learn next?
            </h2>
            <p className="max-w-xl text-sm text-muted-foreground leading-relaxed">
              Pick the skills you want to grow. We&apos;ll match you to the
              top-rated courses and learning paths on Skillora that close the
              gap.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                Personalized matches updated in real time
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                Combines courses, paths, and instructors
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                No login required — explore freely
              </li>
            </ul>
          </div>

          <Card className="border-border/60 bg-card/80 backdrop-blur">
            <CardContent className="space-y-5 p-6">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search skills (e.g. React, copywriting, leadership)"
                  className="h-11 pl-10"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {filteredSkills.map((skill) => {
                  const isActive = selected.has(skill.id);
                  return (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => toggleSkill(skill.id)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                        isActive
                          ? "border-primary bg-primary text-primary-foreground shadow"
                          : "border-border/60 bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
                      )}
                      aria-pressed={isActive}
                    >
                      {skill.label}
                    </button>
                  );
                })}
                {filteredSkills.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    No skills match your search.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-border/60 pt-4">
                <Badge variant="secondary" className="font-mono text-[10px]">
                  {selected.size}/{MAX_SELECTED} selected
                </Badge>
                <Button
                  onClick={handleAnalyze}
                  disabled={isPending || selected.size === 0}
                  className="rounded-full"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing…
                    </>
                  ) : (
                    <>
                      Find my courses <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
