import { LoginForm } from "@/features/auth/server";

export const metadata = {
  title: "Login - Skillora",
  description: "Sign in to your Skillora account to continue learning or teaching.",
};

export default function LoginPage() {
  return <LoginForm />;
}

