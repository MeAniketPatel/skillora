import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { ROUTES } from "@/shared/constants/routes";

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
    <path d="m10 15 5-3-5-3z" fill="currentColor" />
  </svg>
);

export function Footer() {
  return (
    <footer className="border-t border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
          {/* Brand Col */}
          <div className="col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 font-heading text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              <GraduationCap className="h-6 w-6 text-indigo-600 stroke-[2.5]" />
              <span>Skillora</span>
            </Link>
            <p className="max-w-xs text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Skillora is a world-class e-learning platform empowering expert teachers to share their knowledge and helping students unlock their dream careers.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-2">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" aria-label="Twitter">
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" aria-label="GitHub">
                <GithubIcon className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" aria-label="LinkedIn">
                <LinkedinIcon className="h-5 w-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" aria-label="YouTube">
                <YoutubeIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Product */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Product</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href={ROUTES.COURSES} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Explore Courses
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href={ROUTES.COMPARE} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Compare Courses
                </Link>
              </li>
              <li>
                <Link href={ROUTES.SEARCH} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Advanced Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: For Instructors */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Instructors</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href={`${ROUTES.REGISTER}?role=teacher`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Become a Teacher
                </Link>
              </li>
              <li>
                <Link href={ROUTES.LOGIN} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Instructor Portal
                </Link>
              </li>
              <li>
                <Link href={ROUTES.ABOUT} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Teaching Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Resources */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Resources</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/#success-stories" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href={ROUTES.ABOUT} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Frequently Asked FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Legal */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Legal</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 border-t border-zinc-200/50 dark:border-zinc-800/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} Skillora Inc. All rights reserved. Handcrafted with premium design.
          </p>
          <div className="flex items-center gap-4 text-xs text-zinc-400 dark:text-zinc-500">
            <span>Next.js 16 App Router</span>
            <span>&bull;</span>
            <span>Tailwind CSS v4</span>
            <span>&bull;</span>
            <span>Shadcn/UI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
