import { getBlogPostDetail } from "@/data";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { BlogComments } from "@/components/blog/blog-comments";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { ArrowLeft, User, Calendar, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BlogPostDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostDetailPageProps) {
  const { slug } = await params;
  const post = await getBlogPostDetail(slug);
  return {
    title: `${post?.title || "Blog Post"} | Skillora`,
    description: post?.excerpt || post?.content?.slice(0, 150),
  };
}

export default async function BlogPostDetailPage({ params }: BlogPostDetailPageProps) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const post = await getBlogPostDetail(slug);
  if (!post) {
    notFound();
  }

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
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      {/* Back Button */}
      <div>
        <Link
          href="/blog"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
          )}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
        </Link>
      </div>

      {/* Main Blog Post Content */}
      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm overflow-hidden">
        {post.coverImage && (
          <div className="h-72 md:h-96 w-full relative overflow-hidden bg-neutral-100 dark:bg-neutral-850">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-6 md:p-8 space-y-6">
          <div className="space-y-3">
            <h1 className="text-xl md:text-2xl font-extrabold text-neutral-850 dark:text-neutral-50 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 flex-wrap pt-2 border-t border-b border-neutral-100 dark:border-neutral-800/60 py-3">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={post.author.image || undefined} />
                  <AvatarFallback className="text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800">
                    {post.author.name?.slice(0, 2).toUpperCase() || "US"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                      {post.author.name || "Anonymous Learner"}
                    </span>
                    <Badge variant="outline" className={`text-[8px] font-bold py-0 px-1.5 ${getRoleBadgeColor(post.author.role)}`}>
                      {post.author.role}
                    </Badge>
                  </div>
                  <p className="text-[9px] text-neutral-450">{post.author.headline || "Skillora Contributor"}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 ml-auto text-[10px] text-neutral-400 font-mono">
                <Calendar className="h-4 w-4" />
                <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap font-sans">
            {post.content}
          </div>
        </div>
      </Card>

      {/* Comments section */}
      <BlogComments postId={post.id} comments={post.comments as any} />
    </div>
  );
}
