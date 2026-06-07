import * as React from "react"

import { cn } from "@/shared/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-neutral-200 bg-white/50 px-3 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-neutral-900 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-neutral-900/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-1 aria-invalid:ring-red-500/20 md:text-sm dark:border-neutral-800 dark:bg-neutral-950/50 dark:focus-visible:border-neutral-100 dark:focus-visible:bg-neutral-950 dark:focus-visible:ring-neutral-100/20 dark:disabled:bg-neutral-900",
        className
      )}
      {...props}
    />
  )
}

export { Input }
