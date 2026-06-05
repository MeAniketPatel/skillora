"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, GraduationCap } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import LinkButton from "@/shared/components/ui/link-button";
import { ThemeToggle } from "@/shared/components/shared/theme-toggle";
import { logoutCurrentSession } from "@/features/auth/actions/auth.actions";
import { ROUTES } from "@/shared/constants/routes";

type Session = {
  user?: { id?: string; role?: string; name?: string | null } | null;
} | null;

const NAV_LINKS = [
  { name: "Courses", href: ROUTES.COURSES },
  { name: "About", href: ROUTES.ABOUT },
  { name: "Teachers", href: "/teachers" },
  { name: "Contact", href: ROUTES.CONTACT },
];

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
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex md:items-center md:gap-4">
          <ThemeToggle />

          {!isLoggedIn ? (
            <>
              <LinkButton variant="ghost" href={ROUTES.LOGIN}>
                Login
              </LinkButton>
              <LinkButton href={ROUTES.REGISTER}>Join Free</LinkButton>
            </>
          ) : (
            <>
              <Link
                href={ROUTES.SETTINGS}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Settings
              </Link>
              {isTeacher ? (
                <LinkButton href={ROUTES.TEACHER_COURSES}>Dashboard</LinkButton>
              ) : (
                <LinkButton href={ROUTES.DASHBOARD}>Dashboard</LinkButton>
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
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}

            <hr className="border-border" />

            <div className="flex flex-col gap-2">
              {!isLoggedIn ? (
                <>
                  <LinkButton
                    href={ROUTES.LOGIN}
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </LinkButton>
                  <LinkButton
                    href={ROUTES.REGISTER}
                    className="w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    Join Free
                  </LinkButton>
                </>
              ) : (
                <>
                  <LinkButton
                    href={ROUTES.SETTINGS}
                    className="w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    Settings
                  </LinkButton>
                  {isTeacher ? (
                    <LinkButton
                      href={ROUTES.TEACHER_COURSES}
                      className="w-full"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </LinkButton>
                  ) : (
                    <LinkButton
                      href={ROUTES.DASHBOARD}
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
