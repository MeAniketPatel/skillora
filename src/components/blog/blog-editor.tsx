"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createBlogPostSchema } from "@/validations/blog.schema";
import { createBlogPostAction } from "@/actions/blog.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { PenTool, Sparkles } from "lucide-react";

type FormValues = z.infer<typeof createBlogPostSchema>;

interface BlogEditorProps {
  onSuccess?: () => void;
}

export function BlogEditor({ onSuccess }: BlogEditorProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(createBlogPostSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      coverImage: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const res = await createBlogPostAction(values);
      if (!res.success) {
        toast.error(res.error || "Failed to create post.");
      } else {
        toast.success("Blog post drafted successfully!");
        form.reset();
        if (onSuccess) {
          onSuccess();
        }
        router.push("/blog");
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
          <PenTool className="h-5 w-5 text-indigo-500" />
          <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100">Write an Article</h3>
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold text-neutral-700 dark:text-neutral-350">Post Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter title (min 5 characters)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="coverImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold text-neutral-700 dark:text-neutral-350">Cover Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.jpg" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="excerpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold text-neutral-700 dark:text-neutral-350">Short Summary / Excerpt</FormLabel>
                <FormControl>
                  <Input placeholder="Brief post summary" {...field} value={field.value || ""} />
                </FormControl>
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
              <FormLabel className="text-xs font-bold text-neutral-700 dark:text-neutral-350">Content Body</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write the full post contents here... (min 20 characters)"
                  rows={8}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto rounded-xl text-xs font-bold h-9"
          >
            {isSubmitting ? "Drafting..." : "Submit Draft"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
