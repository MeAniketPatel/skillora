import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-neutral-955 dark:bg-neutral-950 flex flex-col">
      {children}
    </div>
  );
}
