import Link from "next/link"
import { GraduationCap } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-heading text-xl font-bold tracking-tight">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span>Skillora</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground leading-relaxed">
              Skillora is a modern e-learning platform empowering expert teachers to share their knowledge and helping students learn without limits.
            </p>
          </div>

          {/* Links Col 1: Product */}
          <div>
            <h3 className="font-heading text-sm font-semibold tracking-wider text-foreground uppercase">Product</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/courses" className="text-muted-foreground hover:text-foreground transition-colors">
                  Explore Courses
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </Link>
              </li>

            </ul>
          </div>

          {/* Links Col 2: Teachers */}
          <div>
            <h3 className="font-heading text-sm font-semibold tracking-wider text-foreground uppercase">For Teachers</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/register?role=teacher" className="text-muted-foreground hover:text-foreground transition-colors">
                  Become a Teacher
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  Teaching Guidelines
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                  Teacher Portal
                </Link>
              </li>
            </ul>
          </div>


        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Skillora Inc. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with Next.js 16 & Tailwind CSS v4.
          </p>
        </div>
      </div>
    </footer>
  )
}
