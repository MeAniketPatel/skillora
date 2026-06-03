import ForgotPasswordForm from "@/components/auth/forgot-password-form";

export const metadata = {
  title: "Forgot Password - Skillora",
  description: "Request a secure Skillora password reset link.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
