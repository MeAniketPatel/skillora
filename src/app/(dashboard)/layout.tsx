import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { 
  GraduationCap, 
  BookOpen, 
  BarChart, 
  Settings, 
  LogOut,
  User,
  LayoutDashboard
} from "lucide-react";

import { auth, signOut } from "@/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationsMenu } from "@/components/shared/notifications-menu";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role;
  const isTeacher = role === "TEACHER" || role === "ADMIN";

  const navigation = isTeacher
    ? [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "My Courses", href: "/teacher/courses", icon: BookOpen },
        { name: "Analytics", href: "/teacher/analytics", icon: BarChart },
        { name: "Settings", href: "/settings", icon: Settings },
      ]
    : [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "My Learning", href: "/student/courses", icon: BookOpen },
        { name: "Settings", href: "/settings", icon: Settings },
      ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="flex h-16 items-center px-6 border-b border-neutral-200 dark:border-neutral-800">
          <Link href="/" className="flex items-center gap-2 font-heading text-xl font-bold tracking-tight text-primary">
            <GraduationCap className="h-7 w-7 text-primary" />
            <span>Skillora</span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:text-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={session.user.image || ""} />
              <AvatarFallback className="bg-neutral-100 dark:bg-neutral-800">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xs font-semibold truncate max-w-[100px]">
                {session.user.name || "User"}
              </span>
              <span className="text-[10px] text-neutral-500 truncate max-w-[100px]">
                {role}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <NotificationsMenu />
            <ThemeToggle />
          </div>
        </div>
      </aside>

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
    </div>
  );
}
