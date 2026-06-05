"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  GraduationCap, 
  BookOpen, 
  BarChart, 
  Settings, 
  LogOut,
  User,
  LayoutDashboard,
  Coins,
  MessageSquare,
  Layers,
  Compass,
  Trophy
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { NotificationsMenu } from "@/components/shared/notifications-menu";
import { logoutCurrentSession } from "@/actions/auth.actions";
import { ROUTES } from "@/shared/constants/routes";

interface SidebarProps {
  session: {
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    } | null;
  } | null;
}

export function Sidebar({ session }: SidebarProps) {
  const pathname = usePathname();
  if (!session?.user) return null;

  const role = session.user.role;
  const isTeacher = role === "TEACHER" || role === "ADMIN";

  const navigation = isTeacher
    ? [
        { name: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
        { name: "My Courses", href: ROUTES.TEACHER_COURSES, icon: BookOpen },
        { name: "Analytics", href: ROUTES.TEACHER_ANALYTICS, icon: BarChart },
        { name: "Payouts", href: ROUTES.TEACHER_PAYOUTS, icon: Coins },
        { name: "Profile", href: "/profile", icon: User },
        { name: "Messages", href: "/messages", icon: Settings }, // Settings can be replaced with messaging or other icon
        { name: "Settings", href: ROUTES.SETTINGS, icon: Settings },
      ]
    : [
        { name: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
        { name: "My Learning", href: ROUTES.STUDENT_COURSES, icon: BookOpen },
        { name: "Learning Paths", href: "/learning-paths", icon: Compass },
        { name: "Flashcards", href: "/student/flashcards", icon: Layers },
        { name: "Discussions", href: "/discussions", icon: MessageSquare },
        { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
        { name: "Study Groups", href: "/student/study-groups", icon: GraduationCap },
        { name: "Profile", href: "/profile", icon: User },
        { name: "Messages", href: "/messages", icon: Settings },
        { name: "Settings", href: ROUTES.SETTINGS, icon: Settings },
      ];


  const handleSignOut = async (e: React.FormEvent) => {
    e.preventDefault();
    await logoutCurrentSession();
  };

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <div className="flex h-16 items-center px-6 border-b border-neutral-200 dark:border-neutral-800">
        <Link href="/" className="flex items-center gap-2 font-heading text-xl font-bold tracking-tight text-primary">
          <GraduationCap className="h-7 w-7 text-primary" />
          <span>Skillora</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50"
                  : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:text-neutral-50 dark:hover:bg-neutral-800/50"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={session.user.image || ""} />
            <AvatarFallback className="bg-neutral-100 dark:bg-neutral-800">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-semibold truncate">
              {session.user.name || "User"}
            </span>
            <span className="text-[10px] text-neutral-500 truncate">
              {role}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <NotificationsMenu />
            <ThemeToggle />
          </div>
        </div>
        <form onSubmit={handleSignOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
