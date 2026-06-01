import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-950 overflow-hidden">
      {/* Premium aesthetic dynamic background glow blobs */}
      <div className="absolute -top-10 -left-10 w-96 h-96 bg-neutral-200 dark:bg-neutral-800/30 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-neutral-300 dark:bg-neutral-700/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse pointer-events-none" />

      <div className="relative z-10 w-full flex justify-center">
        {children}
      </div>
    </div>
  );
}
