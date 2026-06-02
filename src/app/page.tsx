import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import LinkButton from "@/components/ui/link-button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, BookOpen, ShieldCheck, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="relative px-4 py-20 md:py-32 overflow-hidden bg-background text-foreground">
          {/* Subtle Background Gradient Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-primary)/10,_transparent_50%)]" />

          <div className="relative mx-auto max-w-5xl text-center">
            <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
              Learn Without Limits. <br />
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Teach Without Boundaries.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed sm:text-xl">
              Skillora is a modern e-learning marketplace built for modern
              creators and curious minds. Build, sell, and learn courses in
              minutes.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <LinkButton
                size="lg"
                href="/courses"
                className="rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                Browse Courses <ArrowRight className="ml-2 h-4 w-4" />
              </LinkButton>
              <LinkButton
                size="lg"
                variant="outline"
                href="/register?role=teacher"
                className="rounded-full"
              >
                Become an Instructor
              </LinkButton>
            </div>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="px-4 py-16 bg-muted/40">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="border-border/50 bg-background/50 backdrop-blur">
                <CardHeader>
                  <Zap className="h-10 w-10 text-primary mb-2" />
                  <CardTitle className="font-heading text-xl">
                    LMS Platform
                  </CardTitle>
                  <CardDescription>
                    Rich curriculum builder with high-speed video streaming,
                    text articles, and quizzes.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border/50 bg-background/50 backdrop-blur">
                <CardHeader>
                  <ShieldCheck className="h-10 w-10 text-primary mb-2" />
                  <CardTitle className="font-heading text-xl">
                    Secure Payments
                  </CardTitle>
                  <CardDescription>
                    Stripe Checkout for instant student enrollment and Stripe
                    Connect for direct payouts to teachers.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border/50 bg-background/50 backdrop-blur">
                <CardHeader>
                  <BookOpen className="h-10 w-10 text-primary mb-2" />
                  <CardTitle className="font-heading text-xl">
                    Certificates
                  </CardTitle>
                  <CardDescription>
                    Automatically generate downloadable and verifiable PDF
                    completion certificates for your students.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
