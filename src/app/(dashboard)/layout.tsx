import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { GraduationCap, User, Menu } from "lucide-react";

import { auth } from "@/auth";
import { ThemeToggle } from "@/shared/components/shared/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { NotificationsMenu } from "@/shared/components/shared/notifications-menu";
import { Sidebar } from "@/shared/components/layout/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/components/ui/sheet";
import { Button } from "@/shared/components/ui/button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex">
          <Sidebar session={session} />
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden fixed top-3 left-3 z-50 h-10 w-10 rounded-full bg-white dark:bg-neutral-900 shadow-md border border-neutral-200 dark:border-neutral-700">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <Sidebar session={session} />
          </SheetContent>
        </Sheet>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {/* Header Mobile */}
          <header className="md:hidden flex h-16 shrink-0 items-center justify-end px-6 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <Link href="/" className="flex items-center gap-2 font-heading text-lg font-bold tracking-tight text-primary mr-auto ml-10">
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
          <main className="flex-1 overflow-y-auto p-6 md:p-10 min-h-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
