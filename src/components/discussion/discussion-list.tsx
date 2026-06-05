"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pin, MessageSquare, Search, Flame, Filter, Heart, Eye } from "lucide-react";

interface DiscussionUser {
  id: string;
  name: string | null;
  image: string | null;
}

interface Discussion {
  id: string;
  title: string;
  category: string;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: DiscussionUser;
  _count: {
    replies: number;
  };
}

interface DiscussionListProps {
  discussions: Discussion[];
}

const CATEGORIES = [
  { value: "ALL", label: "All Topics" },
  { value: "GENERAL", label: "General" },
  { value: "HELP", label: "Get Help" },
  { value: "SHOW_AND_TELL", label: "Show & Tell" },
];

export function DiscussionList({ discussions }: DiscussionListProps) {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDiscussions = discussions.filter((discussion) => {
    const matchesCategory =
      selectedCategory === "ALL" || discussion.category === selectedCategory;
    const matchesSearch =
      discussion.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "HELP":
        return "bg-red-50 text-red-700 border-red-200/50 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30";
      case "SHOW_AND_TELL":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30";
      default:
        return "bg-neutral-50 text-neutral-700 border-neutral-200/50 dark:bg-neutral-900 dark:text-neutral-300 dark:border-neutral-800";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "HELP":
        return "Get Help";
      case "SHOW_AND_TELL":
        return "Show & Tell";
      default:
        return "General";
    }
  };

  return (
    <div className="space-y-6">
      {/* Category selector & Search bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 p-4 rounded-2xl shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-neutral-50/50 dark:bg-neutral-950/30 border-neutral-200/60 dark:border-neutral-800/60"
          />
        </div>

        <div className="flex flex-wrap gap-1 w-full sm:w-auto sm:ml-auto">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.value}
              variant={selectedCategory === cat.value ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory(cat.value)}
              className="rounded-full text-xs"
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Discussion List */}
      <div className="space-y-3">
        {filteredDiscussions.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl">
            <MessageSquare className="h-10 w-10 text-neutral-400 mx-auto mb-3" />
            <h4 className="font-bold text-neutral-800 dark:text-neutral-200 text-sm">No discussions found</h4>
            <p className="text-xs text-neutral-500 mt-1">Try resetting filters or start a new topic!</p>
          </div>
        ) : (
          filteredDiscussions.map((discussion) => (
            <Card
              key={discussion.id}
              className={`p-5 bg-white dark:bg-neutral-900 border transition-all hover:border-neutral-350 dark:hover:border-neutral-700 relative overflow-hidden group ${
                discussion.isPinned
                  ? "border-amber-200/80 dark:border-amber-900/50 bg-amber-50/10"
                  : "border-neutral-200/50 dark:border-neutral-800/50"
              }`}
            >
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10 shrink-0 border border-neutral-100 dark:border-neutral-800">
                  <AvatarImage src={discussion.user.image || undefined} alt={discussion.user.name || "User"} />
                  <AvatarFallback className="text-xs font-bold bg-neutral-100 dark:bg-neutral-850">
                    {discussion.user.name?.slice(0, 2).toUpperCase() || "US"}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className={`text-[9px] font-bold ${getCategoryColor(discussion.category)}`}>
                      {getCategoryLabel(discussion.category)}
                    </Badge>
                    {discussion.isPinned && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200/50 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30 text-[9px] font-bold flex items-center gap-0.5">
                        <Pin className="h-2.5 w-2.5 fill-amber-500 stroke-none" /> Pinned
                      </Badge>
                    )}
                  </div>

                  <Link href={`/discussions/${discussion.id}`} className="block">
                    <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 hover:text-amber-500 dark:hover:text-amber-400 transition-colors truncate">
                      {discussion.title}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-2 text-[10px] text-neutral-450 font-medium">
                    <span className="font-semibold text-neutral-600 dark:text-neutral-300">
                      {discussion.user.name || "Anonymous User"}
                    </span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(discussion.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-center shrink-0 pl-2">
                  <div className="flex items-center gap-1 text-neutral-450 dark:text-neutral-500">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-xs font-semibold font-mono">{discussion._count.replies}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
