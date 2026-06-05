"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createDiscussionSchema } from "@/validations/discussion.schema";
import { createDiscussionAction } from "@/actions/discussion.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { MessageSquarePlus } from "lucide-react";

type FormValues = z.infer<typeof createDiscussionSchema>;

interface DiscussionEditorProps {
  onSuccess?: () => void;
}

export function DiscussionEditor({ onSuccess }: DiscussionEditorProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(createDiscussionSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "GENERAL",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const res = await createDiscussionAction(values);
      if (!res.success) {
        toast.error(res.error || "Failed to create discussion");
      } else {
        toast.success("Discussion created successfully!");
        form.reset();
        if (onSuccess) {
          onSuccess();
        }
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
          <MessageSquarePlus className="h-5 w-5 text-amber-500" />
          <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100">Start a New Discussion</h3>
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold text-neutral-700 dark:text-neutral-350">Topic Title</FormLabel>
              <FormControl>
                <Input placeholder="What is on your mind? (min 5 chars)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold text-neutral-700 dark:text-neutral-350">Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="GENERAL">General Discussions</SelectItem>
                    <SelectItem value="HELP">Get Help / Ask a Question</SelectItem>
                    <SelectItem value="SHOW_AND_TELL">Show & Tell / Project Showcase</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold text-neutral-700 dark:text-neutral-350">Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Elaborate on your topic... (min 10 chars, markdown supported in display)"
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? "Posting..." : "Post Discussion"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
