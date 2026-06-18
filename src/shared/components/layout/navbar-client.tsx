"use client";

import * as React from "react";
import Link from "next/link";
import { 
  Menu, 
  X, 
  GraduationCap, 
  ChevronDown, 
  Laptop, 
  Brain, 
  Palette, 
  Database, 
  TrendingUp, 
  ShieldCheck,
  ArrowRight
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import LinkButton from "@/shared/components/ui/link-button";
import { ThemeToggle } from "@/shared/components/shared/theme-toggle";
import { logoutCurrentSession } from "@/features/auth";
import { ROUTES } from "@/shared/constants/routes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

type Session = {
  user?: { id?: string; role?: string; name?: string | null } | null;
} | null;

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface NavbarClientProps {
  session: Session;
  categories?: Category[];
}

const FALLBACK_CATEGORIES: Category[] = [
  { id: "web-dev", name: "Web Development", slug: "web-development" },
  { id: "ai-ml", name: "AI & Machine Learning", slug: "ai-machine-learning" },
  { id: "ui-ux", name: "UI/UX Design", slug: "ui-ux-design" },
  { id: "data-sci", name: "Data Science", slug: "data-science" },
  { id: "marketing", name: "Marketing", slug: "marketing" },
  { id: "cyber", name: "Cybersecurity", slug: "cybersecurity" },
];

const getCategoryIcon = (slug: string) => {
  const s = slug.toLowerCase();
  if (s.includes("web") || s.includes("dev")) return <Laptop className="h-4 w-4 text-blue-500" />;
  if (s.includes("ai") || s.includes("machine") || s.includes("intelligence")) return <Brain className="h-4 w-4 text-violet-500" />;
  if (s.includes("ux") || s.includes("ui") || s.includes("design")) return <Palette className="h-4 w-4 text-pink-500" />;
  if (s.includes("data") || s.includes("science") || s.includes("database")) return <Database className="h-4 w-4 text-emerald-500" />;
  if (s.includes("marketing") || s.includes("sales") || s.includes("business")) return <TrendingUp className="h-4 w-4 text-amber-500" />;
  if (s.includes("cyber") || s.includes("security") || s.includes("shield")) return <ShieldCheck className="h-4 w-4 text-red-500" />;
  return <Laptop className="h-4 w-4 text-indigo-500" />;
};

export default function NavbarClient({ session, categories = [] }: NavbarClientProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [clientSession, setClientSession] = React.useState<Session>(session);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    if (!clientSession) {
      let mounted = true;
      (async () => {
        try {
          const res = await fetch("/api/auth/session");
          if (!mounted) return;
          if (res.ok) {
            const json = await res.json();
            if (json) setClientSession(json);
          }
        } catch {
          // ignore
        }
      })();
      return () => {
        mounted = false;
      };
    }
    return;
  }, [clientSession]);

  const isLoggedIn = !!clientSession?.user;
  const isTeacher =
    clientSession?.user?.role === "TEACHER" ||
    clientSession?.user?.role === "ADMIN";

  const handleLogout = async () => {
    await logoutCurrentSession();
  };

  const navCategories = categories.length > 0 ? categories : FALLBACK_CATEGORIES;

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-zinc-200/50 bg-white/80 dark:border-zinc-800/50 dark:bg-zinc-950/80 backdrop-blur-md shadow-xs"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo left */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 font-heading text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 bg-clip-text text-transparent"
          >
            <GraduationCap className="h-7 w-7 text-indigo-600 stroke-[2.5]" />
            <span>Skillora</span>
          </Link>
        </div>

        {/* Navigation center (Desktop) */}
        <div className="hidden md:flex md:items-center md:gap-8">
          <Link
            href={ROUTES.COURSES}
            className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Courses
          </Link>

          {/* Categories Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer outline-none transition-colors">
              Categories <ChevronDown className="h-3.5 w-3.5 opacity-70" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 p-2 rounded-xl border-zinc-200/50 dark:border-zinc-800/50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md shadow-lg">
              {navCategories.map((cat) => (
                <DropdownMenuItem key={cat.id} asChild>
                  <Link
                    href={`/courses?categoryId=${cat.id}`}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors"
                  >
                    {getCategoryIcon(cat.slug)}
                    <span className="font-medium">{cat.name}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="/#pricing"
            className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Pricing
          </Link>

          <Link
            href="/#success-stories"
            className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Success Stories
          </Link>

          <Link
            href={ROUTES.ABOUT}
            className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            About
          </Link>
        </div>

        {/* CTA buttons right (Desktop) */}
        <div className="hidden md:flex md:items-center md:gap-4">
          <ThemeToggle />

          {!isLoggedIn ? (
            <>
              <LinkButton
                variant="ghost"
                href={ROUTES.LOGIN}
                className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-full px-5 py-2 transition-all"
              >
                Login
              </LinkButton>
              <LinkButton
                href={ROUTES.REGISTER}
                className="rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-500 hover:to-blue-500 shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 px-6 py-2 text-sm font-semibold border-none transition-all duration-300"
              >
                Get Started
              </LinkButton>
            </>
          ) : (
            <>
              <Link
                href={ROUTES.SETTINGS}
                className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Settings
              </Link>
              {isTeacher ? (
                <LinkButton
                  href={ROUTES.TEACHER_COURSES}
                  className="rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-5 py-2 text-sm font-semibold border-none"
                >
                  Dashboard
                </LinkButton>
              ) : (
                <LinkButton
                  href={ROUTES.DASHBOARD}
                  className="rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-5 py-2 text-sm font-semibold border-none"
                >
                  Dashboard
                </LinkButton>
              )}
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-red-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-full px-4"
              >
                Logout
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="h-9 w-9 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md px-4 py-6 md:hidden animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-5">
            <Link
              href={ROUTES.COURSES}
              onClick={() => setIsOpen(false)}
              className="text-base font-semibold text-zinc-800 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Courses
            </Link>

            {/* Mobile Categories Accordion Grid */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Categories
              </span>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {navCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/courses?categoryId=${cat.id}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    {getCategoryIcon(cat.slug)}
                    <span className="truncate">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <hr className="border-zinc-100 dark:border-zinc-900" />

            <Link
              href="/#pricing"
              onClick={() => setIsOpen(false)}
              className="text-base font-semibold text-zinc-800 dark:text-zinc-200 hover:text-indigo-600"
            >
              Pricing
            </Link>

            <Link
              href="/#success-stories"
              onClick={() => setIsOpen(false)}
              className="text-base font-semibold text-zinc-800 dark:text-zinc-200 hover:text-indigo-600"
            >
              Success Stories
            </Link>

            <Link
              href={ROUTES.ABOUT}
              onClick={() => setIsOpen(false)}
              className="text-base font-semibold text-zinc-800 dark:text-zinc-200 hover:text-indigo-600"
            >
              About
            </Link>

            <hr className="border-zinc-100 dark:border-zinc-900" />

            <div className="flex flex-col gap-3">
              {!isLoggedIn ? (
                <>
                  <LinkButton
                    href={ROUTES.LOGIN}
                    variant="outline"
                    className="w-full rounded-full border-zinc-200 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </LinkButton>
                  <LinkButton
                    href={ROUTES.REGISTER}
                    className="w-full rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </LinkButton>
                </>
              ) : (
                <>
                  <LinkButton
                    href={ROUTES.SETTINGS}
                    variant="outline"
                    className="w-full rounded-full border-zinc-200 dark:border-zinc-850"
                    onClick={() => setIsOpen(false)}
                  >
                    Settings
                  </LinkButton>
                  {isTeacher ? (
                    <LinkButton
                      href={ROUTES.TEACHER_COURSES}
                      className="w-full rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </LinkButton>
                  ) : (
                    <LinkButton
                      href={ROUTES.DASHBOARD}
                      className="w-full rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </LinkButton>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
