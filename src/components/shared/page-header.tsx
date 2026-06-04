import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-neutral-100 dark:border-neutral-800/60">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-neutral-50 dark:to-neutral-400 bg-clip-text text-transparent">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-neutral-500 mt-1 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {children && <div className="flex items-center gap-x-2 shrink-0">{children}</div>}
    </div>
  );
}
