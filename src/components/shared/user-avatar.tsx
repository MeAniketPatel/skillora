"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  className?: string;
  fallbackClassName?: string;
}

export function UserAvatar({
  src,
  name,
  className = "",
  fallbackClassName = "",
}: UserAvatarProps) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "";

  return (
    <Avatar className={`h-9 w-9 border border-neutral-200 dark:border-neutral-800 ${className}`}>
      {src && <AvatarImage src={src} alt={name || "User Avatar"} />}
      <AvatarFallback className={`bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-semibold text-xs ${fallbackClassName}`}>
        {initials || <User className="h-4 w-4 text-neutral-400" />}
      </AvatarFallback>
    </Avatar>
  );
}
