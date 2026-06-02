import Link from "next/link";
import { buttonVariants } from "./button";
import { cn } from "@/lib/utils";
import type { AnchorHTMLAttributes } from "react";
import type { VariantProps } from "class-variance-authority";

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof buttonVariants> & {
    href: string;
  };

export default function LinkButton({
  href,
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </Link>
  );
}
