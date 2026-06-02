"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import LinkButton from "@/components/ui/link-button";
import { ThemeToggle } from "@/components/theme-toggle";

type Session = {
  user?: { id?: string; role?: string; name?: string | null } | null;
} | null;

export default function NavbarClient({ session }: { session: Session }) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Keep a client-side session state so the navbar updates after client
  // navigation (home page may be statically rendered without a session).
  const [clientSession, setClientSession] = React.useState<Session>(session);

  React.useEffect(() => {
    if (!clientSession) {
      let mounted = true;
      (async () => {
        try {
          const res = await fetch("/api/auth/session");
          if (!mounted) return;
          if (res.ok) {
            const json = await res.json();
            // NextAuth returns the session object or null
            if (json) setClientSession(json);
          }
        } catch (e) {
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
    try {
      await fetch("/api/auth/signout", { method: "POST" });
    } catch (e) {
      // fallback to redirect
      window.location.href = "/api/auth/signout";
    }
    window.location.reload();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 font-heading text-2xl font-bold tracking-tight text-primary"
          >
            <GraduationCap className="h-8 w-8 text-primary" />
            <span>Skillora</span>
          </Link>
        </div>

        <div className="hidden md:flex md:items-center md:gap-6">
          <Link
            href="/courses"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Courses
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
          <Link
            href="/teachers"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Teachers
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </Link>
        </div>

        <div className="hidden md:flex md:items-center md:gap-4">
          <ThemeToggle />

          {!isLoggedIn ? (
            <>
              <LinkButton variant="ghost" href="/login">
                Login
              </LinkButton>
              <LinkButton href="/register">Join Free</LinkButton>
            </>
          ) : (
            <>
              <Link
                href="/settings"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Settings
              </Link>
              {isTeacher ? (
                <LinkButton href="/teacher/courses">Dashboard</LinkButton>
              ) : (
                <LinkButton href="/dashboard">Dashboard</LinkButton>
              )}
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="h-9 w-9"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="border-b border-border bg-background px-4 py-4 md:hidden animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-4">
            <Link
              href="/courses"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Courses
            </Link>
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="/teachers"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Teachers
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </Link>

            <hr className="border-border" />

            <div className="flex flex-col gap-2">
              {!isLoggedIn ? (
                <>
                  <LinkButton
                    href="/login"
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </LinkButton>
                  <LinkButton
                    href="/register"
                    className="w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    Join Free
                  </LinkButton>
                </>
              ) : (
                <>
                  <LinkButton
                    href="/settings"
                    className="w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    Settings
                  </LinkButton>
                  {isTeacher ? (
                    <LinkButton
                      href="/teacher/courses"
                      className="w-full"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </LinkButton>
                  ) : (
                    <LinkButton
                      href="/dashboard"
                      className="w-full"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </LinkButton>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full"
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
