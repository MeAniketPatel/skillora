import React from "react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="text-muted-foreground">
        Have questions or need help? Email{" "}
        <a href="mailto:hello@skillora.example">hello@skillora.example</a>.
      </p>
      <p className="mt-6">
        Back to <Link href="/">home</Link>.
      </p>
    </main>
  );
}
