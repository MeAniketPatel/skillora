"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pollSchema } from "@/validations/poll.schema";
import { createPollAction } from "@/actions/poll.actions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface PollCreatorProps {
  courseId: string;
}

export function PollCreator({ courseId }: PollCreatorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(pollSchema) as any,
    defaultValues: {
      question: "",
      options: ["", ""],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const onSubmit = (data: any) => {
    setError(null);
    startTransition(async () => {
      const res = await createPollAction(courseId, data);
      if (!res.success) {
        setError(res.error || "Failed to create poll.");
      } else {
        reset({ question: "", options: ["", ""] });
        router.refresh();
      }
    });
  };

  return (
    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question" className="text-xs font-bold">Poll Question</Label>
            <Input
              id="question"
              placeholder="e.g., Which topic should we cover in the live Q&A?"
              {...register("question")}
              disabled={isPending}
              className="h-10 rounded-xl"
            />
            {errors.question?.message && (
              <p className="text-[10px] text-red-500 font-medium">{String(errors.question.message)}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-xs font-bold block">Options</Label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-center">
                <div className="flex-1">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    {...register(`options.${index}`)}
                    disabled={isPending}
                    className="h-10 rounded-xl"
                  />
                  {(errors.options as any)?.[index]?.message && (
                    <p className="text-[10px] text-red-500 font-medium mt-1">
                      {String((errors.options as any)[index].message)}
                    </p>
                  )}
                </div>

                {fields.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={isPending}
                    className="h-10 w-10 text-neutral-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-955/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}

            {fields.length < 6 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => append("")}
                disabled={isPending}
                className="w-full h-10 rounded-xl text-xs gap-1.5 border-dashed"
              >
                <Plus className="h-4 w-4" />
                Add Option
              </Button>
            )}
            {errors.options?.message && (
              <p className="text-[10px] text-red-500 font-medium text-center">{String(errors.options.message)}</p>
            )}
          </div>

          {error && (
            <p className="text-[11px] font-semibold text-red-500 bg-red-50 dark:bg-red-950/30 p-2.5 rounded-lg">
              {error}
            </p>
          )}

          <Button type="submit" disabled={isPending} className="w-full h-10 rounded-xl text-xs gap-2">
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Create Poll
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
