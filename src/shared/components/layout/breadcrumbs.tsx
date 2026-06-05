"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumbs() {
  const pathname = usePathname();
  
  if (pathname === "/" || pathname === "/dashboard") return null;

  const paths = pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 text-xs text-neutral-500 dark:text-neutral-400 mb-4">
      <Link
        href="/dashboard"
        className="flex items-center gap-1 hover:text-neutral-900 dark:hover:text-neutral-50 transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>

      {paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join("/")}`;
        const isLast = index === paths.length - 1;
        const formattedName = path
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());

        // Skip dynamic IDs from showing directly or keep them simple
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(path);
        const name = isUuid ? "Detail" : formattedName;

        return (
          <React.Fragment key={path}>
            <ChevronRight className="h-3 w-3 shrink-0 text-neutral-400" />
            {isLast ? (
              <span className="font-semibold text-neutral-900 dark:text-neutral-50 truncate max-w-[150px]">
                {name}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-neutral-900 dark:hover:text-neutral-50 transition-colors truncate max-w-[150px]"
              >
                {name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
