import type { Metadata } from "next";
import { LoginForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your Skillora account to continue learning or teaching.",
};

export default function LoginPage() {
  return <LoginForm />;
}

