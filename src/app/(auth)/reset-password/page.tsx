import React from "react";

import ResetPasswordForm from "@/components/auth/reset-password-form";

export const metadata = {
  title: "Reset Password - Skillora",
  description: "Set a new password for your Skillora account.",
};

export default function ResetPasswordPage() {
  return (
    <React.Suspense fallback={<div className="p-6">Loading...</div>}>
      <ResetPasswordForm />
    </React.Suspense>
  );
}
