import { redirect } from "next/navigation";
import { ArrowRight, ShieldCheck, Sparkles, Zap, BookOpen } from "lucide-react";
import { auth } from "@/auth";
import { Navbar } from "@/shared/components/layout/navbar";
import { Footer } from "@/shared/components/layout/footer";
import LinkButton from "@/shared/components/ui/link-button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { HeroSection } from "@/features/marketing";
import { PlatformStats } from "@/features/marketing";
import { FeaturedCourses } from "@/features/marketing";
import { TestimonialGrid } from "@/features/marketing";
import { SkillGapAnalyzer } from "@/features/marketing";
import { CareerHub } from "@/features/marketing";
import { getFeaturedCourses, getPlatformStats } from "@/features/skill-gap/server";
import { TESTIMONIALS } from "@/shared/constants/marketing";
import { ROUTES } from "@/shared/constants/routes";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) redirect(ROUTES.DASHBOARD);

  const [featuredCourses, platformStats] = await Promise.all([
    getFeaturedCourses(6),
    getPlatformStats(),
  ]);

  const statsForView = [
    { id: "students", label: "Active Learners", value: platformStats.students, suffix: "+" },
    { id: "courses", label: "Curated Courses", value: platformStats.courses, suffix: "+" },
    { id: "instructors", label: "Expert Instructors", value: platformStats.instructors, suffix: "" },
    { id: "certificates", label: "Certificates Issued", value: platformStats.certificates, suffix: "+" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <PlatformStats stats={statsForView} />
        <FeaturedCourses courses={featuredCourses} />

        <section className="bg-background">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
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
                description="Built-in AI assistant, gamification, and actionable analytics."
              />
            </div>
          </div>
        </section>

        <TestimonialGrid testimonials={TESTIMONIALS} />
        <CareerHub />
        <SkillGapAnalyzer />

        <section className="border-t border-border/60 bg-gradient-to-br from-primary/10 via-background to-blue-500/10">
          <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
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
      </main>
      <Footer />
    </div>
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
