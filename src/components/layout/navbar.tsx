"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-heading text-2xl font-bold tracking-tight text-primary">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span>Skillora</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-6">
          <Link href="/courses" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Courses
          </Link>
          <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
          <Link href="/teachers" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Teachers
          </Link>
          <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </Link>
        </div>

        {/* Actions */}
        <div className="hidden md:flex md:items-center md:gap-4">
          <ThemeToggle />
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Join Free</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
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

      {/* Mobile Menu Dropdown */}
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
              <Button variant="outline" asChild className="w-full">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  Join Free
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
