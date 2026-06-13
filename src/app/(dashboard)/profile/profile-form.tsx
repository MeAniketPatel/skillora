"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { buttonVariants } from "@/shared/components/ui/button";
import { Mail, User as UserIcon, Edit2, Globe, Bookmark, FileText } from "lucide-react";

const Twitter = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);


interface ProfileFormProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    headline: string | null;
    bio: string | null;
    socialLinks: { twitter?: string; linkedin?: string; github?: string };
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const socialEntries = Object.entries(user.socialLinks).filter(([_, val]) => !!val);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground text-sm">View your public portfolio, bio, and social handles.</p>
        </div>
        <Link
          href="/settings?tab=profile"
          className={buttonVariants({ variant: "outline", size: "sm", className: "gap-2 shadow-sm shrink-0" })}
        >
          <Edit2 className="h-3.5 w-3.5" />
          Edit Profile
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        {/* Profile Sidebar Card */}
        <div className="space-y-6">
          <Card className="overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm">
            {/* Gradient Header */}
            <div className="h-24 bg-gradient-to-br from-primary/80 via-primary to-primary/60" />
            <CardContent className="px-6 pb-6 -mt-12">
              {/* Avatar */}
              <div className="relative w-24 h-24 mx-auto mb-4">
                <Avatar className="w-24 h-24 border-4 border-white dark:border-neutral-900 shadow-md">
                  <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                  <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                    {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* User Info */}
              <div className="text-center space-y-1">
                <h3 className="text-lg font-semibold truncate">{user.name || "Unnamed User"}</h3>
                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                {user.headline && (
                  <p className="text-xs text-muted-foreground pt-1.5 line-clamp-2 leading-relaxed">
                    {user.headline}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Card */}
          <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10 text-primary">
                  <UserIcon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Account Type</p>
                  <p className="font-semibold text-xs mt-0.5 text-neutral-700 dark:text-neutral-300">Member</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Info Details */}
        <div className="space-y-6">
          <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm h-full">
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Public biography and portfolio handles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Display Headline */}
              {user.headline && (
                <div className="space-y-1.5">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 flex items-center gap-1.5">
                    <Bookmark className="h-3 w-3" />
                    Professional Headline
                  </div>
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                    {user.headline}
                  </p>
                </div>
              )}

              {/* Display Bio */}
              <div className="space-y-1.5">
                <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <FileText className="h-3 w-3" />
                  Biography
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-350 leading-relaxed whitespace-pre-line">
                  {user.bio || "No biography provided yet. Tell others about your skills and goals!"}
                </p>
              </div>

              {/* Display Social Handles */}
              <div className="border-t border-neutral-100 dark:border-neutral-800/50 pt-4 space-y-3">
                <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <Globe className="h-3 w-3" />
                  Social Handles
                </div>
                
                {socialEntries.length === 0 ? (
                  <p className="text-xs text-neutral-400 italic">No social handles configured.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {user.socialLinks.twitter && (
                      <a
                        href={user.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 text-xs text-neutral-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors w-fit font-medium"
                      >
                        <Twitter className="h-4 w-4" />
                        <span>Twitter / X</span>
                      </a>
                    )}
                    {user.socialLinks.linkedin && (
                      <a
                        href={user.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 text-xs text-neutral-500 hover:text-blue-600 dark:hover:text-blue-500 transition-colors w-fit font-medium"
                      >
                        <Linkedin className="h-4 w-4" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {user.socialLinks.github && (
                      <a
                        href={user.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors w-fit font-medium"
                      >
                        <Github className="h-4 w-4" />
                        <span>GitHub</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}