"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createGoalSchema } from "@/validations/learning-goal.schema";
import { createGoalAction } from "@/actions/learning-goal.actions";
import { z } from "zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface FormValues {
  type: "WEEKLY" | "MONTHLY";
  target: number;
  targetDate: Date;
}

export function CreateGoalForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(createGoalSchema),
    defaultValues: {
      type: "WEEKLY",
      target: 5,
      targetDate: new Date(Date.now() + 7 * 86400000), // Default to next week
    },
  });

  const onSubmit = (values: any) => {
    startTransition(async () => {
      const result = await createGoalAction(values);
      if (result.success) {
        toast.success("Learning Goal created successfully!");
        form.reset({
          type: "WEEKLY",
          target: 5,
          targetDate: new Date(Date.now() + 7 * 86400000),
        });
      } else {
        toast.error(result.error || "Failed to create goal");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goal Period</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isPending}
              >
                <FormControl>
                  <SelectTrigger className="rounded-xl h-10">
                    <SelectValue placeholder="Select period type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl">
                  <SelectItem value="WEEKLY">Weekly</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Decide if this target resets weekly or monthly.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="target"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Lessons Count</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g. 5"
                  disabled={isPending}
                  className="rounded-xl h-10"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                />
              </FormControl>
              <FormDescription>
                How many lessons do you want to complete?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="targetDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  disabled={isPending}
                  className="rounded-xl h-10"
                  {...field}
                  value={
                    field.value instanceof Date
                      ? field.value.toISOString().split("T")[0]
                      : field.value
                  }
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                When is your target deadline?
              </FormDescription>
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
            "Set Goal"
          )}
        </Button>
      </form>
    </Form>
  );
}
