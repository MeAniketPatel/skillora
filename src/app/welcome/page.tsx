import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import WelcomeForm from "./welcome-form";

export const metadata = {
  title: "Welcome to Skillora",
  description: "Choose your role to get started with Skillora.",
};

export default async function WelcomePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <SessionProvider session={session}>
      <WelcomeForm />
    </SessionProvider>
  );
}
