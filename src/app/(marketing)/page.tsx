import { redirect } from "next/navigation";
import { ArrowRight, ShieldCheck, Sparkles, Zap, BookOpen } from "lucide-react";
import { auth } from "@/auth";
import LinkButton from "@/shared/components/ui/link-button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { HeroSection, PlatformStats } from "@/features/marketing";
import { ROUTES } from "@/shared/constants/routes";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) redirect(ROUTES.DASHBOARD);

  return (
    <>
      <HeroSection />
      <PlatformStats />

      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Built for serious learning
            </span>
            <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
              Everything you need to launch, teach, and grow
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<Zap className="h-5 w-5" />}
              title="LMS Platform"
              description="Rich curriculum builder with high-speed video, text articles, and quizzes."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Secure Payments"
              description="Stripe Checkout for instant enrollment and direct teacher payouts."
            />
            <FeatureCard
              icon={<BookOpen className="h-5 w-5" />}
              title="Verifiable Certificates"
              description="Auto-generated PDF certificates with public verification links."
            />
            <FeatureCard
              icon={<Sparkles className="h-5 w-5" />}
              title="AI Tutor & Insights"
              description="Built-in AI assistant and actionable analytics."
            />
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 bg-gradient-to-br from-primary/10 via-background to-blue-500/10">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
            Ready to start teaching — or learning?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            Join a community of expert instructors and ambitious learners.
            No setup fees. Pay only when you earn.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <LinkButton href={ROUTES.COURSES} size="lg" className="rounded-full px-6">
              Explore Courses <ArrowRight className="ml-2 h-4 w-4" />
            </LinkButton>
            <LinkButton
              href={`${ROUTES.REGISTER}?role=teacher`}
              size="lg"
              variant="outline"
              className="rounded-full px-6"
            >
              Become an Instructor
            </LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-border/60 bg-card/80 backdrop-blur">
      <CardHeader>
        <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <CardTitle className="text-base font-extrabold">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}

