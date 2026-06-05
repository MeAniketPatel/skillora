import { getBlogPosts } from "@/data";
import { auth } from "@/auth";
import { BlogCard } from "@/components/blog/blog-card";
import { BlogEditor } from "@/components/blog/blog-editor";
import { Badge } from "@/shared/components/ui/badge";
import { PenTool, Sparkles, BookOpen } from "lucide-react";

export const metadata = {
  title: "Blog & Insights | Skillora",
  description: "Read technical articles, platform updates, and learning summaries from the Skillora community.",
};

export default async function BlogPage() {
  const session = await auth();
  const posts = await getBlogPosts(true);

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-6">
      {/* Title */}
      <div className="bg-gradient-to-tr from-indigo-500/10 via-indigo-500/5 to-transparent border border-indigo-250/20 dark:border-indigo-900/30 p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute right-6 top-6 opacity-10">
          <BookOpen className="h-24 w-24 text-indigo-500" />
        </div>

        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-indigo-100/50 text-indigo-700 border-indigo-250 dark:bg-indigo-950/20 dark:text-indigo-400 text-[10px] font-bold">
              Community Insights
            </Badge>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-850 dark:text-neutral-50 flex items-center gap-2">
            Skillora Blog
          </h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-350 leading-relaxed">
            Discover articles, tutorials, and success stories written by our community. Students, instructors, and staff members are welcome to share their expertise.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Listing */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-neutral-850 dark:text-neutral-50 mb-3 flex items-center gap-1.5">
            <Sparkles className="h-4.5 w-4.5 text-indigo-500" /> Latest Articles
          </h2>

          {posts.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl">
              <p className="text-xs text-neutral-500 font-medium">No published articles yet. Be the first to write one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post as any} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Blog Editor (only if logged in) */}
        <div className="space-y-6">
          {session?.user ? (
            <BlogEditor />
          ) : (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl p-5 shadow-sm text-center space-y-2">
              <PenTool className="h-8 w-8 text-neutral-300 mx-auto" />
              <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Want to Write?</h4>
              <p className="text-[10px] text-neutral-500">Sign in to your Skillora account to draft posts and join the community.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
