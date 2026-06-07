import type { Metadata } from "next";
import React from "react";

import { ResetPasswordForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your Skillora account.",
};

export default function ResetPasswordPage() {
  return (
    <React.Suspense fallback={<div className="p-6">Loading...</div>}>
      <ResetPasswordForm />
    </React.Suspense>
  );
}

