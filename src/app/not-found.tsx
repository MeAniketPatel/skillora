import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <h1 className="text-6xl font-extrabold">404</h1>
      <p className="mt-4 text-xl">Page not found.</p>
      <p className="mt-6">
        Return <Link href="/">home</Link> or visit{" "}
        <Link href="/contact">contact</Link> if you need help.
      </p>
    </main>
  );
}
