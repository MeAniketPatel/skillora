import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { 
  GraduationCap, 
  User
} from "lucide-react";

import { auth } from "@/auth";
import { ThemeToggle } from "@/shared/components/shared/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { NotificationsMenu } from "@/shared/components/shared/notifications-menu";
import { ROUTES } from "@/shared/constants/routes";
import { Sidebar } from "@/shared/components/layout/sidebar";
import { cookies } from "next/headers";
import { StopImpersonationBanner } from "@/features/admin";
import { CartSidebar } from "@/features/cart";
import { getUserXPPoints } from "@/features/gamification/server";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const points = await getUserXPPoints(session.user.id!);


  const cookieStore = await cookies();
  const isImpersonating = cookieStore.has("impersonate_user_id");

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col">
      {isImpersonating && <StopImpersonationBanner />}
      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar session={session} />


      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Mobile */}
        <header className="md:hidden flex h-16 items-center justify-between px-6 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <Link href="/" className="flex items-center gap-2 font-heading text-lg font-bold tracking-tight text-primary">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span>Skillora</span>
          </Link>

          <div className="flex items-center gap-3">
            <NotificationsMenu />
            <ThemeToggle />
            <Avatar className="h-8 w-8">
              <AvatarImage src={session.user.image || ""} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          {children}
        </main>
      </div>
      <CartSidebar
        userPoints={points}
        userId={session.user.id!}
        userName={session.user.name || "Student"}
      />
    </div>
  </div>
  );
}
