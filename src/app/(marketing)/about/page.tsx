import React from "react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold mb-4">About Skillora</h1>
      <p className="text-muted-foreground">
        Skillora is a platform for teachers and learners to create and consume
        high-quality courses.
      </p>
      <p className="mt-4">
        Built with Next.js, Prisma, and modern UI primitives.
      </p>
      <p className="mt-6">
        Back to <Link href="/">home</Link>.
      </p>
    </div>
  );
}
