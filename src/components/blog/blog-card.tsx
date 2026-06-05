"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Calendar, User, ArrowRight } from "lucide-react";

interface Author {
  id: string;
  name: string | null;
  image: string | null;
  role: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  createdAt: Date;
  author: Author;
  _count: {
    comments: number;
  };
}

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-50 text-red-700 border-red-200/50 dark:bg-red-950/20 dark:text-red-400";
      case "TEACHER":
        return "bg-amber-50 text-amber-700 border-amber-200/50 dark:bg-amber-950/20 dark:text-amber-400";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200/50 dark:bg-blue-950/20 dark:text-blue-400";
    }
  };

  return (
    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between group">
      <div>
        {post.coverImage ? (
          <div className="h-44 w-full relative overflow-hidden bg-neutral-100 dark:bg-neutral-850 shrink-0">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="h-44 w-full bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 flex items-center justify-center shrink-0 border-b border-neutral-100 dark:border-neutral-800/60">
            <User className="h-12 w-12 text-indigo-400/50" />
          </div>
        )}

        <CardContent className="p-5 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={`text-[9px] font-bold ${getRoleBadgeColor(post.author.role)}`}>
              {post.author.role === "ADMIN" ? "Staff" : post.author.role === "TEACHER" ? "Instructor" : "Student"}
            </Badge>
            <span className="text-[9px] text-neutral-400 font-mono flex items-center gap-0.5">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>

          <Link href={`/blog/${post.slug}`} className="block">
            <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 hover:text-indigo-550 dark:hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
              {post.title}
            </h3>
          </Link>

          <p className="text-xs text-neutral-500 dark:text-neutral-450 line-clamp-2 leading-relaxed">
            {post.excerpt || "Click to read the full article and join the discussion."}
          </p>
        </CardContent>
      </div>

      <div className="px-5 pb-5 pt-0 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800/40 mt-auto">
        <div className="flex items-center gap-2 pt-3">
          <Avatar className="h-6 w-6">
            <AvatarImage src={post.author.image || undefined} />
            <AvatarFallback className="text-[9px] font-bold bg-neutral-100 dark:bg-neutral-800">
              {post.author.name?.slice(0, 2).toUpperCase() || "US"}
            </AvatarFallback>
          </Avatar>
          <span className="text-[10px] text-neutral-500 font-semibold truncate max-w-[100px]">
            {post.author.name || "Learner"}
          </span>
        </div>

        <div className="flex items-center gap-3 pt-3">
          <span className="text-[10px] text-neutral-450 font-semibold flex items-center gap-1 font-mono">
            <MessageSquare className="h-3.5 w-3.5" />
            {post._count.comments}
          </span>
          <Link href={`/blog/${post.slug}`} className="text-[10px] text-indigo-500 hover:text-indigo-600 font-bold flex items-center gap-0.5">
            Read <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
