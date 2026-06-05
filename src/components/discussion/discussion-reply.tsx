"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { discussionReplySchema } from "@/validations/discussion.schema";
import { addDiscussionReplyAction } from "@/actions/discussion.actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Reply } from "lucide-react";

type FormValues = z.infer<typeof discussionReplySchema>;

interface DiscussionReplyProps {
  discussionId: string;
}

export function DiscussionReply({ discussionId }: DiscussionReplyProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(discussionReplySchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const res = await addDiscussionReplyAction(discussionId, values);
      if (!res.success) {
        toast.error(res.error || "Failed to post reply");
      } else {
        toast.success("Reply posted successfully!");
        form.reset();
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Write a helpful reply... (min 2 chars)"
                  rows={3}
                  className="bg-neutral-50/50 dark:bg-neutral-950/30 border-neutral-200/50 dark:border-neutral-800/50 focus:border-neutral-350 dark:focus:border-neutral-700"
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
            className="flex items-center gap-1.5"
          >
            <Reply className="h-3.5 w-3.5" />
            {isSubmitting ? "Submitting..." : "Reply"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
