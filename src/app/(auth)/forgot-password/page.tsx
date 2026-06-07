import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Request a secure Skillora password reset link.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}

