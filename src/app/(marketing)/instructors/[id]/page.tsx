import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getInstructorProfile } from "@/features/auth/server";
import { InstructorProfile } from "@/features/marketing";

interface InstructorPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Instructor Profile",
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
    <>
      <main className="mx-auto w-full max-w-7xl flex-grow px-4 py-12 sm:px-6 lg:px-8">
        <InstructorProfile teacher={teacher} />
      </main>
    </>
  );
}

