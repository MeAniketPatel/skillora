import React from "react";
import type { Metadata } from "next";
import { RegisterForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a new Skillora account to start learning or teaching.",
};

export default function RegisterPage() {
  return (
    <React.Suspense fallback={<div className="p-6">Loading…</div>}>
      <RegisterForm />
    </React.Suspense>
  );
}

