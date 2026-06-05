import { GraduationCap, Search, UserSearch } from "lucide-react";
import { getAllInstructors } from "@/data/user.data";
import { Card, CardContent } from "@/components/ui/card";
import { InstructorCard } from "@/components/marketing/instructor-card";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Input } from "@/components/ui/input";
import { APP } from "@/constants/app";
import { ROUTES } from "@/constants/routes";

export const metadata = {
  title: "Browse Instructors | Skillora",
  description:
    "Discover the world's best instructors teaching on Skillora. Filter by topic, rating, and expertise.",
};

interface InstructorsPageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

export default async function InstructorsPage({
  searchParams,
}: InstructorsPageProps) {
  const { search, page } = await searchParams;
  const pageNum = Math.max(1, Number(page) || 1);

  const { instructors, total, pages } = await getAllInstructors({
    search: search || undefined,
    page: pageNum,
    limit: APP.PAGINATION_DEFAULT,
  });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-10 space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
            <UserSearch className="h-3.5 w-3.5" /> Instructor Directory
          </span>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            Learn from the best in the industry
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed">
            {total} active instructors teaching on Skillora. Search by name or
            specialty to find your next mentor.
          </p>
        </header>

        <form
          method="GET"
          action={ROUTES.INSTRUCTORS}
          className="mb-8 flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3 backdrop-blur"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="search"
              defaultValue={search || ""}
              placeholder="Search instructors by name or specialty…"
              className="h-10 border-0 pl-10 shadow-none focus-visible:ring-0"
            />
          </div>
        </form>

        {instructors.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {instructors.map((instructor) => (
                <InstructorCard
                  key={instructor.id}
                  instructor={{
                    ...instructor,
                    averageRating: 0,
                  }}
                />
              ))}
            </div>

            {pages > 1 && (
              <nav
                aria-label="Pagination"
                className="mt-10 flex items-center justify-center gap-2"
              >
                {Array.from({ length: pages }).map((_, idx) => {
                  const pageNumber = idx + 1;
                  const params = new URLSearchParams();
                  if (search) params.set("search", search);
                  if (pageNumber > 1) params.set("page", String(pageNumber));
                  const href = params.toString()
                    ? `${ROUTES.INSTRUCTORS}?${params.toString()}`
                    : ROUTES.INSTRUCTORS;
                  const isActive = pageNumber === pageNum;
                  return (
                    <a
                      key={pageNumber}
                      href={href}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${
                        isActive
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border/60 hover:border-primary/40"
                      }`}
                    >
                      {pageNumber}
                    </a>
                  );
                })}
              </nav>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

function EmptyState() {
  return (
    <Card className="flex flex-col items-center justify-center border-dashed border-border/60 p-16 text-center">
      <CardContent className="space-y-3">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <GraduationCap className="h-8 w-8" />
        </div>
        <h2 className="text-lg font-bold">No instructors found</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Try a different search term, or check back soon as new instructors
          join the platform every week.
        </p>
      </CardContent>
    </Card>
  );
}
