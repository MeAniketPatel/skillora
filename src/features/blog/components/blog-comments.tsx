"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { blogCommentSchema } from "@/validations/blog.schema";
import { addBlogCommentAction } from "@/actions/blog.actions";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/shared/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Card, CardContent } from "@/shared/components/ui/card";
import { toast } from "sonner";
import { MessageSquare, Reply } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type FormValues = z.infer<typeof blogCommentSchema>;

interface CommentUser {
  id: string;
  name: string | null;
  image: string | null;
  role: string;
}

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  user: CommentUser;
}

interface BlogCommentsProps {
  postId: string;
  comments: Comment[];
}

export function BlogComments({ postId, comments }: BlogCommentsProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(blogCommentSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const res = await addBlogCommentAction(postId, values);
      if (!res.success) {
        toast.error(res.error || "Failed to add comment.");
      } else {
        toast.success("Comment added!");
        form.reset();
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
        <MessageSquare className="h-5 w-5 text-indigo-500" />
        <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-150">Comments ({comments.length})</h3>
      </div>

      {/* New Comment Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Join the discussion... (min 2 characters)"
                    rows={3}
                    className="bg-neutral-50/50 dark:bg-neutral-950/20 border-neutral-200/50 dark:border-neutral-800/50 focus:border-indigo-300 dark:focus:border-indigo-900"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              size="sm"
              className="flex items-center gap-1.5 rounded-xl text-xs font-bold"
            >
              <Reply className="h-3.5 w-3.5" />
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Comments List */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <div className="text-center py-6 bg-neutral-50/50 dark:bg-neutral-950/10 border border-neutral-150 dark:border-neutral-850/50 rounded-xl">
            <p className="text-xs text-neutral-500 font-medium">No comments yet. Start the conversation!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={comment.user.image || undefined} />
                    <AvatarFallback className="text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800">
                      {comment.user.name?.slice(0, 2).toUpperCase() || "US"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-neutral-800 dark:text-neutral-150">
                        {comment.user.name || "Anonymous Learner"}
                      </span>
                      {comment.user.role === "ADMIN" && (
                        <span className="text-[8px] font-bold bg-red-500/10 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-full border border-red-500/20">
                          Staff
                        </span>
                      )}
                      {comment.user.role === "TEACHER" && (
                        <span className="text-[8px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-full border border-amber-500/20">
                          Instructor
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-neutral-400 font-mono">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed pl-0.5">
                  {comment.content}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
