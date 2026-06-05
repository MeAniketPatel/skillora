"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createStudyGroupSchema } from "@/features/study-groups/contracts/study-group.contract";
import { createStudyGroupAction } from "../actions/study-group.actions";
import { Loader2, Plus } from "lucide-react";
import { z } from "zod";

type FormValues = z.infer<typeof createStudyGroupSchema>;

export function CreateGroupForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(createStudyGroupSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      isPrivate: false,
    },
  });

  const onSubmit = (data: FormValues) => {
    setError(null);
    startTransition(async () => {
      const res = await createStudyGroupAction(data);
      if (!res.success) {
        setError(res.error || "Failed to create study group.");
      } else {
        setIsOpen(false);
        reset();
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 rounded-xl text-xs gap-2 font-bold"
      >
        <Plus className="h-4 w-4" />
        Create Study Group
      </Button>

      {isOpen && (
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-4">Start New Study Group</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold">Group Name</Label>
                <Input id="name" placeholder="e.g. Next.js App Router Masters" {...register("name")} className="h-10 rounded-xl" />
                {errors.name && <p className="text-[10px] text-red-500 font-medium">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-bold">Description</Label>
                <Input id="description" placeholder="Briefly specify study focus, target materials or meeting schedules..." {...register("description")} className="h-10 rounded-xl" />
                {errors.description && <p className="text-[10px] text-red-500 font-medium">{errors.description.message}</p>}
              </div>

              {error && <p className="text-[11px] text-red-500 font-semibold">{error}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="h-9 rounded-xl text-xs">
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending} className="h-9 rounded-xl text-xs gap-1.5 font-bold">
                  {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Create Group
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
