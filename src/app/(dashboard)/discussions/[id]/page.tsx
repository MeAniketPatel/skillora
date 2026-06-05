import { getDiscussionThread } from "@/data";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { DiscussionReply } from "@/components/discussion/discussion-reply";
import LinkButton from "@/components/ui/link-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, MessageSquare, ShieldAlert, Pin } from "lucide-react";

interface DiscussionDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: DiscussionDetailPageProps) {
  const { id } = await params;
  const discussion = await getDiscussionThread(id);
  return {
    title: `${discussion?.title || "Discussion Thread"} | Skillora`,
    description: discussion?.content?.slice(0, 150),
  };
}

export default async function DiscussionDetailPage({ params }: DiscussionDetailPageProps) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const discussion = await getDiscussionThread(id);
  if (!discussion) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <div>
        <LinkButton href="/discussions" variant="ghost" size="sm" className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Discussions
        </LinkButton>
      </div>

      {/* Main Discussion Topic */}
      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-neutral-100 dark:border-neutral-850">
              <AvatarImage src={discussion.user.image || undefined} alt={discussion.user.name || "User"} />
              <AvatarFallback className="text-xs font-bold bg-neutral-100 dark:bg-neutral-800">
                {discussion.user.name?.slice(0, 2).toUpperCase() || "US"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  {discussion.user.name || "Anonymous User"}
                </span>
                {discussion.user.role === "TEACHER" && (
                  <span className="text-[8px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-full border border-amber-500/20">
                    Instructor
                  </span>
                )}
                {discussion.user.role === "ADMIN" && (
                  <span className="text-[8px] font-bold bg-red-500/10 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-full border border-red-500/20">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-[10px] text-neutral-450 font-medium">
                Posted {formatDistanceToNow(new Date(discussion.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-lg md:text-xl font-bold text-neutral-850 dark:text-neutral-50 flex items-center gap-2">
              {discussion.title}
              {discussion.isPinned && (
                <Pin className="h-4 w-4 fill-amber-500 stroke-none text-amber-500 shrink-0" />
              )}
            </h1>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap pt-2">
              {discussion.content}
            </p>
          </div>
        </div>
      </Card>

      {/* Discussion Replies Title */}
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-neutral-400" />
        <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-250">
          Replies ({discussion.replies.length})
        </h3>
      </div>

      {/* Replies list */}
      <div className="space-y-4">
        {discussion.replies.length === 0 ? (
          <div className="text-center py-8 bg-neutral-50/50 dark:bg-neutral-900/30 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl">
            <p className="text-xs text-neutral-500 font-medium">No replies yet. Be the first to start the conversation!</p>
          </div>
        ) : (
          discussion.replies.map((reply) => (
            <Card key={reply.id} className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 border border-neutral-100 dark:border-neutral-850">
                    <AvatarImage src={reply.user.image || undefined} alt={reply.user.name || "User"} />
                    <AvatarFallback className="text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800">
                      {reply.user.name?.slice(0, 2).toUpperCase() || "US"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                        {reply.user.name || "Anonymous User"}
                      </span>
                      {reply.user.role === "TEACHER" && (
                        <span className="text-[8px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-full border border-amber-500/20">
                          Instructor
                        </span>
                      )}
                      {reply.user.role === "ADMIN" && (
                        <span className="text-[8px] font-bold bg-red-500/10 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-full border border-red-500/20">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-[9px] text-neutral-450 font-medium">
                      {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-350 leading-relaxed whitespace-pre-wrap pl-1">
                  {reply.content}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Reply editor */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Leave a Reply</h4>
        {discussion.isLocked ? (
          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-250 p-4 rounded-xl text-yellow-700 text-xs font-medium dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-900/30">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            This discussion has been locked. Replies are disabled.
          </div>
        ) : (
          <DiscussionReply discussionId={discussion.id} />
        )}
      </div>
    </div>
  );
}
