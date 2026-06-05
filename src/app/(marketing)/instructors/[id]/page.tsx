import { notFound } from "next/navigation";
import { getInstructorProfile } from "@/features/auth";
import { Navbar } from "@/shared/components/layout/navbar";
import { Footer } from "@/shared/components/layout/footer";
import { InstructorProfile } from "@/features/marketing";

interface InstructorPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Instructor Profile | Skillora",
  description:
    "View the instructor's bio, published courses, and student reviews on Skillora.",
};

export default async function InstructorProfilePage({
  params,
}: InstructorPageProps) {
  const { id } = await params;
  const teacher = await getInstructorProfile(id);

  if (!teacher) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <InstructorProfile teacher={teacher} />
      </main>
      <Footer />
    </div>
  );
}
