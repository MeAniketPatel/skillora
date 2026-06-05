"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCollectionSchema } from "@/features/collections/contracts/collection.contract";
import { createCollectionAction } from "@/features/collections/actions/collection.actions";
import { z } from "zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type FormValues = z.infer<typeof createCollectionSchema>;

export function CreateCollectionForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(createCollectionSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      const result = await createCollectionAction(values);
      if (result.success) {
        toast.success("Collection created successfully!");
        form.reset({
          name: "",
          description: "",
        });
      } else {
        toast.error(result.error || "Failed to create collection");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Playlist Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Frontend Mastery"
                  disabled={isPending}
                  className="rounded-xl h-10"
                  {...field}
                />
              </FormControl>
              <FormDescription>Give your playlist a clear name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g. Essential courses for frontend engineers..."
                  disabled={isPending}
                  className="rounded-xl min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full rounded-xl h-10 mt-2">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Playlist"
          )}
        </Button>
      </form>
    </Form>
  );
}
