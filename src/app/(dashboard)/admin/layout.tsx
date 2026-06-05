import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isAdmin } from "@/features/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!isAdmin(session?.user?.role as any)) {
    redirect("/dashboard");
  }
  return <>{children}</>;
}
